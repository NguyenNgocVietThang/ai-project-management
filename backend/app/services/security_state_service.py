"""Short, durable transactions for revocation, one-time codes and abuse budgets.

Database errors fail closed. Never fall back to cache or log exception text: SQL
exceptions can include bound token/payload parameters. SQLite is for tests only.
"""

import asyncio
import hashlib
import logging
import math
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta

from sqlalchemy import case, delete, func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from app.core.config import settings
from app.core.exceptions import ServiceUnavailableException
from app.db.session import SecuritySessionLocal as AsyncSessionLocal
from app.models.security_state import SecurityState

logger = logging.getLogger(__name__)
STATE_OPERATION_TIMEOUT_SECONDS = 5
EXPIRY_CLEANUP_BATCH = 100


def database_enabled() -> bool:
    return settings.SECURITY_STATE_BACKEND == "database"


def _utcnow() -> datetime:
    return datetime.now(UTC)


def _hash(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()


def _ttl(expires_at: datetime) -> int:
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    return max(0, math.ceil((expires_at - _utcnow()).total_seconds()))


@asynccontextmanager
async def _transaction():
    try:
        async with asyncio.timeout(STATE_OPERATION_TIMEOUT_SECONDS):
            async with AsyncSessionLocal() as db, db.begin():
                yield db
    except Exception:
        logger.warning("Durable security state is unavailable")
        raise ServiceUnavailableException("Sign-in security is temporarily unavailable") from None


def _clock(db):
    return func.clock_timestamp() if db.get_bind().dialect.name == "postgresql" else _utcnow()


def _insert(db, namespace: str, key: str, ttl: int, *, payload=None, counter=0):
    if not namespace or len(namespace) > 40 or not key or ttl < 1:
        raise ValueError("Invalid security state metadata")
    dialect = db.get_bind().dialect.name
    if dialect not in {"postgresql", "sqlite"}:
        raise RuntimeError("Security state requires PostgreSQL")
    return (pg_insert if dialect == "postgresql" else sqlite_insert)(SecurityState).values(
        namespace=namespace, key_hash=_hash(key), payload=payload, counter=counter,
        expires_at=_utcnow() + timedelta(seconds=ttl),
    )


async def _prune(db) -> None:
    # SKIP LOCKED keeps cleanup from delaying an active claim/consume transaction.
    expired = select(SecurityState.id).where(SecurityState.expires_at <= _clock(db)).limit(
        EXPIRY_CLEANUP_BATCH
    )
    if db.get_bind().dialect.name == "postgresql":
        expired = expired.with_for_update(skip_locked=True)
    await db.execute(delete(SecurityState).where(SecurityState.id.in_(expired)))


async def _put(db, namespace: str, key: str, payload: dict, ttl: int) -> None:
    statement = _insert(db, namespace, key, ttl, payload=payload)
    await db.execute(statement.on_conflict_do_update(
        index_elements=[SecurityState.namespace, SecurityState.key_hash],
        set_={"payload": statement.excluded.payload,
              "expires_at": statement.excluded.expires_at, "updated_at": _utcnow()},
    ))


async def put(namespace: str, key: str, payload: dict, ttl: int) -> None:
    async with _transaction() as db:
        await _put(db, namespace, key, payload, ttl)
        await _prune(db)


async def claim(namespace: str, key: str, ttl: int) -> bool:
    """Claim an absent/expired key; concurrent live claims have exactly one winner."""
    async with _transaction() as db:
        statement = _insert(db, namespace, key, ttl, payload={})
        result = await db.scalar(statement.on_conflict_do_update(
            index_elements=[SecurityState.namespace, SecurityState.key_hash],
            set_={"payload": statement.excluded.payload,
                  "expires_at": statement.excluded.expires_at, "updated_at": _utcnow()},
            where=SecurityState.expires_at <= _clock(db),
        ).returning(SecurityState.id))
        await _prune(db)
        return result is not None


async def take(namespace: str, key: str) -> dict | None:
    """Consume only a live row; DELETE RETURNING serializes simultaneous consumers."""
    async with _transaction() as db:
        payload = await db.scalar(delete(SecurityState).where(
            SecurityState.namespace == namespace, SecurityState.key_hash == _hash(key),
            SecurityState.expires_at > _clock(db),
        ).returning(SecurityState.payload))
        await _prune(db)
        return payload


async def contains(namespace: str, key: str) -> bool:
    async with _transaction() as db:
        return await db.scalar(select(SecurityState.id).where(
            SecurityState.namespace == namespace, SecurityState.key_hash == _hash(key),
            SecurityState.expires_at > _clock(db),
        )) is not None


async def ttl(namespace: str, key: str) -> int | None:
    async with _transaction() as db:
        expiry = await db.scalar(select(SecurityState.expires_at).where(
            SecurityState.namespace == namespace, SecurityState.key_hash == _hash(key),
            SecurityState.expires_at > _clock(db),
        ))
        return (_ttl(expiry) or None) if expiry else None


async def clear(keys: list[tuple[str, str]]) -> None:
    async with _transaction() as db:
        for namespace, key in keys:
            await db.execute(delete(SecurityState).where(
                SecurityState.namespace == namespace, SecurityState.key_hash == _hash(key)
            ))
        await _prune(db)


async def _increment(db, namespace: str, key: str, window_seconds: int) -> tuple[int, int]:
    statement = _insert(db, namespace, key, window_seconds, counter=1)
    expired = SecurityState.expires_at <= _clock(db)
    result = (await db.execute(statement.on_conflict_do_update(
        index_elements=[SecurityState.namespace, SecurityState.key_hash],
        set_={"counter": case((expired, 1), else_=SecurityState.counter + 1),
              "expires_at": case((expired, statement.excluded.expires_at),
                                 else_=SecurityState.expires_at),
              "updated_at": _utcnow()},
    ).returning(SecurityState.counter, SecurityState.expires_at))).one()
    return result.counter, max(1, _ttl(result.expires_at))


async def increment(namespace: str, key: str, window_seconds: int) -> tuple[int, int]:
    async with _transaction() as db:
        result = await _increment(db, namespace, key, window_seconds)
        await _prune(db)
        return result


async def record_login_failure(
    key: str, lock_key: str, window: int, threshold: int, lock_steps: tuple
) -> None:
    # Count and lock update are one transaction; the count row serializes writers.
    async with _transaction() as db:
        count, _ = await _increment(db, "login-failures", key, window)
        if count >= threshold:
            seconds = lock_steps[min(count - threshold, len(lock_steps) - 1)]
            await _put(db, "login-lock", lock_key, {}, seconds)
        await _prune(db)
