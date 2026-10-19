"""Durable checkpoints and quota reservations for bounded provider attempts."""
import hashlib
from contextvars import ContextVar
from datetime import UTC, datetime, time, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from app.core.config import settings
from app.core.job_runner import JobContext, PermanentJobError
from app.models.security_state import SecurityState

active_ai_context: ContextVar[JobContext | None] = ContextVar("active_ai_context", default=None)


async def reserve_ai_call(db, job):
    # Count every provider dispatch, including rejected attempts and retries.
    # The counter and dispatch intent commit together in mark_dispatched().
    today = datetime.now(ZoneInfo(settings.APP_TIMEZONE)).date()
    start = datetime.combine(today, time.min, ZoneInfo(settings.APP_TIMEZONE)).astimezone(UTC)
    insert = pg_insert if db.get_bind().dialect.name == "postgresql" else sqlite_insert
    statement = insert(SecurityState).values(namespace="ai-quota", key_hash=hashlib.sha256(today.isoformat().encode()).hexdigest(), counter=1, expires_at=start + timedelta(days=2))
    statement = statement.on_conflict_do_update(index_elements=[SecurityState.namespace, SecurityState.key_hash], set_={"counter": SecurityState.counter + 1}, where=SecurityState.counter < settings.AI_DAILY_JOB_LIMIT).returning(SecurityState.counter)
    if await db.scalar(statement) is None:
        raise PermanentJobError("ai_quota_exceeded")
