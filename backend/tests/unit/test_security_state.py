"""Durable auth state survives Redis loss and rejects requests on DB failure."""

import asyncio
import importlib.util
import os
import time
from datetime import UTC, datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi import HTTPException, Request
from sqlalchemy import inspect, select, text, update
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.api.ws.deps import enforce_connection_validity
from app.core import login_throttle, oauth_exchange, oauth_state_store, token_revocation, ws_tickets
from app.core.config import settings
from app.core.dependencies import _user_from_token
from app.core.exceptions import ServiceUnavailableException, TooManyRequestsException
from app.core.rate_limit import client_key, limiter
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.base import Base
from app.models.security_state import SecurityState
from app.models.user import User
from app.services import security_state_service as store
from app.services.auth_service import AuthService


@pytest_asyncio.fixture(params=["sqlite", "postgresql"])
async def durable_store(request, monkeypatch):
    admin = None
    schema = None
    if request.param == "postgresql":
        url = os.getenv("SECURITY_TEST_DATABASE_URL")
        if not url:
            pytest.skip("Set SECURITY_TEST_DATABASE_URL to a disposable localhost Postgres")
        assert "127.0.0.1" in url or "localhost" in url
        schema = f"security_test_{uuid4().hex}"
        admin = create_async_engine(url)
        async with admin.begin() as db:
            await db.execute(text(f'CREATE SCHEMA "{schema}"'))
        engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    else:
        engine = create_async_engine("sqlite+aiosqlite:///:memory:", poolclass=StaticPool)
    async with engine.begin() as db:
        await db.run_sync(SecurityState.__table__.create)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    monkeypatch.setattr(store, "AsyncSessionLocal", factory)
    monkeypatch.setattr(settings, "SECURITY_STATE_BACKEND", "database")
    monkeypatch.setattr(settings, "APP_ENV", "production")
    yield factory
    await engine.dispose()
    if admin:
        async with admin.begin() as db:
            await db.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        await admin.dispose()


@pytest.mark.asyncio
async def test_revocation_survives_redis_loss_and_a_new_store_session(durable_store):
    expiry = int(time.time()) + 600
    with patch("app.core.token_revocation.get_redis", side_effect=RuntimeError("Redis lost")):
        assert await token_revocation.revoke("logout-jti", expiry)
        assert await token_revocation.is_revoked("logout-jti")
        assert await token_revocation.is_revoked("logout-jti")
        assert not await token_revocation.is_revoked("never-issued-jti")
    async with durable_store() as db:
        row = await db.scalar(select(SecurityState))
        assert "logout-jti" not in row.key_hash
        assert row.expires_at is not None


@pytest.mark.asyncio
async def test_concurrent_refresh_claim_has_exactly_one_winner(durable_store):
    results = await asyncio.gather(*(
        token_revocation.claim_revocation("one-refresh", int(time.time()) + 600)
        for _ in range(12)
    ))
    assert results.count(True) == 1
    assert await token_revocation.is_revoked("one-refresh")


@pytest.mark.asyncio
async def test_oauth_browser_binding_survives_loss_and_consumes_once(durable_store):
    payload = {"provider": "google", "mode": "login", "code_verifier": "private-pkce"}
    state, browser = await oauth_state_store.issue(payload)
    assert await oauth_state_store.consume(state, "another-browser") is None
    assert await oauth_state_store.consume(state, None) is None
    results = await asyncio.gather(*(
        oauth_state_store.consume(state, browser) for _ in range(12)
    ))
    assert results.count(payload) == 1
    assert results.count(None) == 11


@pytest.mark.asyncio
async def test_exchange_and_ws_ticket_are_durable_single_use(durable_store):
    exchange = await oauth_exchange.issue("test-access", "test-refresh")
    ticket = await ws_tickets.issue(7, 4)
    with patch("app.core.oauth_exchange.get_redis", side_effect=RuntimeError("Redis lost")), patch(
        "app.core.ws_tickets.get_redis", side_effect=RuntimeError("Redis lost")
    ):
        assert await oauth_exchange.redeem(exchange) == ("test-access", "test-refresh")
        assert await oauth_exchange.redeem(exchange) is None
        results = await asyncio.gather(*(ws_tickets.redeem(ticket) for _ in range(12)))
        assert results.count({"user_id": 7, "auth_version": 4}) == 1
        assert results.count(None) == 11


@pytest.mark.asyncio
async def test_expired_records_cannot_authorize_and_counters_reset(durable_store):
    ticket = await ws_tickets.issue(1, 0)
    assert await store.increment("test-counter", "identity", 60) == (1, 60)
    async with durable_store.begin() as db:
        await db.execute(update(SecurityState).values(
            expires_at=datetime.now(UTC) - timedelta(seconds=1)
        ))
    count, ttl = await store.increment("test-counter", "identity", 60)
    assert count == 1 and 0 < ttl <= 60
    assert await ws_tickets.redeem(ticket) is None


@pytest.mark.asyncio
async def test_account_lock_is_durable_and_success_clears_it(durable_store):
    for _ in range(login_throttle.FAILURE_THRESHOLD):
        await login_throttle.record_failure("Victim@Example.com")
    with patch("app.core.login_throttle.get_redis", side_effect=RuntimeError("Redis lost")):
        assert await login_throttle.seconds_until_unlocked("victim@example.com")
        await login_throttle.clear("victim@example.com")
        assert await login_throttle.seconds_until_unlocked("victim@example.com") is None


@pytest.mark.asyncio
async def test_concurrent_throttle_updates_preserve_every_failure(durable_store):
    results = await asyncio.gather(*(
        store.increment("rate-limit", "shared-identity", 60) for _ in range(12)
    ))
    assert sorted(count for count, _ in results) == list(range(1, 13))
    assert all(0 < ttl <= 60 for _, ttl in results)


@pytest.mark.asyncio
async def test_security_state_progresses_while_application_pool_is_saturated(durable_store, monkeypatch):
    engine = durable_store.kw["bind"]
    if engine.dialect.name != "postgresql":
        pytest.skip("Independent connection pools require real PostgreSQL")
    from app.db.session import security_engine as configured_security_engine

    assert configured_security_engine.pool.size() == 1
    assert configured_security_engine.pool._max_overflow == 0
    async with engine.connect() as db:
        schema = await db.scalar(text("SELECT current_schema()"))
    options = {"server_settings": {"search_path": schema}}
    application = create_async_engine(os.environ["SECURITY_TEST_DATABASE_URL"],
                                      pool_size=3, max_overflow=1, connect_args=options)
    security = create_async_engine(os.environ["SECURITY_TEST_DATABASE_URL"],
                                   pool_size=1, max_overflow=0, pool_timeout=4, connect_args=options)
    monkeypatch.setattr(store, "AsyncSessionLocal", async_sessionmaker(security, expire_on_commit=False))
    held = []
    try:
        for _ in range(4):
            connection = await application.connect()
            held.append(connection)
            await connection.execute(text("SELECT 1"))
        assert application.pool.checkedout() == 4

        async def authorize():
            assert await token_revocation.claim_revocation("saturated-refresh", int(time.time()) + 600)
            assert (await store.increment("rate-limit", "saturated-client", 60))[0] == 1

        await asyncio.wait_for(authorize(), timeout=5)
    finally:
        for connection in held:
            await connection.close()
        await application.dispose()
        await security.dispose()


@pytest.mark.asyncio
async def test_database_failure_never_falls_back_to_redis(durable_store, monkeypatch):
    def broken_factory():
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(store, "AsyncSessionLocal", broken_factory)
    calls = [
        lambda: token_revocation.is_revoked("jti"),
        lambda: token_revocation.revoke("jti", int(time.time()) + 60),
        lambda: token_revocation.claim_revocation("jti", int(time.time()) + 60),
        lambda: login_throttle.seconds_until_unlocked("a@example.com"),
        lambda: login_throttle.record_failure("a@example.com"),
        lambda: login_throttle.clear("a@example.com"),
        lambda: oauth_state_store.issue({"mode": "login"}),
        lambda: oauth_state_store.consume("state", "browser"),
        lambda: oauth_exchange.issue("access", "refresh"),
        lambda: oauth_exchange.redeem("exchange"),
        lambda: ws_tickets.issue(1, 0),
        lambda: ws_tickets.redeem("ticket"),
    ]
    for call in calls:
        with pytest.raises(ServiceUnavailableException) as error:
            await call()
        assert error.value.status_code == 503
        assert "database unavailable" not in error.value.detail


def _request(bearer=""):
    return Request({"type": "http", "method": "POST", "path": "/login",
                    "headers": [(b"authorization", f"Bearer {bearer}".encode())],
                    "client": ("203.0.113.10", 1234), "server": ("localhost", 80)})


def test_arbitrary_bearer_headers_cannot_change_the_throttle_identity():
    assert client_key(_request("one")) == client_key(_request("two"))


def test_revocation_ttl_cannot_end_before_the_token_expiry():
    with patch("app.core.token_revocation.time.time", return_value=1000.4):
        assert token_revocation._ttl_seconds(1010) == 10


@pytest.mark.asyncio
async def test_rate_limit_persists_across_decorator_recreation(durable_store, monkeypatch):
    monkeypatch.setattr(limiter, "enabled", True)

    async def endpoint(request: Request):
        return {"ok": True}

    first = limiter.limit("2/minute")(endpoint)
    assert await first(_request("one")) == {"ok": True}
    assert await first(_request("two")) == {"ok": True}
    restarted = limiter.limit("2/minute")(endpoint)
    with pytest.raises(TooManyRequestsException) as error:
        await restarted(_request("three"))
    assert error.value.status_code == 429
    assert int(error.value.headers["Retry-After"]) > 0


@pytest.mark.asyncio
async def test_rate_limit_db_failure_blocks_the_endpoint(durable_store, monkeypatch):
    monkeypatch.setattr(limiter, "enabled", True)

    def broken_factory():
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(store, "AsyncSessionLocal", broken_factory)
    called = False

    @limiter.limit("2/minute")
    async def endpoint(request: Request):
        nonlocal called
        called = True
        return {"ok": True}

    with pytest.raises(ServiceUnavailableException):
        await endpoint(_request())
    assert called is False


@pytest.mark.asyncio
async def test_watchdog_closes_when_database_cannot_reauthorize(monkeypatch):
    monkeypatch.setattr(settings, "SECURITY_STATE_BACKEND", "database")
    websocket = SimpleNamespace(close=AsyncMock())
    with patch("app.repositories.user_repository.UserRepository.get_by_id",
               AsyncMock(side_effect=RuntimeError("database down"))):
        await asyncio.wait_for(enforce_connection_validity(
            websocket, 7, 0, interval=0
        ), timeout=1)
    websocket.close.assert_awaited_once_with(code=4401)


@pytest.mark.asyncio
async def test_authenticated_request_rejects_logged_out_access_after_redis_loss(durable_store):
    engine = durable_store.kw["bind"]
    async with engine.begin() as db:
        await db.run_sync(Base.metadata.create_all)
    async with durable_store.begin() as db:
        user = User(email="logout@example.com", username="logout-user", full_name="Logout",
                    auth_version=0, is_active=True)
        db.add(user)
        await db.flush()
        user_id = user.id
    access = create_access_token({"sub": str(user_id), "ver": 0})
    refresh = create_refresh_token({"sub": str(user_id), "ver": 0})
    async with durable_store.begin() as db:
        assert (await _user_from_token(access, db)).id == user_id
        await AuthService(db).logout(refresh, access)
    with patch("app.core.token_revocation.get_redis", side_effect=RuntimeError("Redis lost")):
        async with durable_store() as db:
            with pytest.raises(HTTPException) as error:
                await _user_from_token(access, db)
            assert error.value.status_code == 401
        assert await token_revocation.is_revoked(decode_token(refresh)["jti"])


@pytest.mark.asyncio
async def test_actual_refresh_concurrency_issues_at_most_one_token_pair(durable_store):
    engine = durable_store.kw["bind"]
    if engine.dialect.name != "postgresql":
        pytest.skip("Independent simultaneous auth transactions require real PostgreSQL")
    async with engine.begin() as db:
        await db.run_sync(Base.metadata.create_all)
    async with durable_store.begin() as db:
        user = User(email="refresh@example.com", username="refresh-user", full_name="Refresh",
                    auth_version=0, is_active=True)
        db.add(user)
        await db.flush()
        user_id = user.id
    refresh = create_refresh_token({"sub": str(user_id), "ver": 0})

    async def rotate():
        try:
            async with durable_store() as db:
                result = await AuthService(db).refresh(refresh)
                await db.commit()
                return result
        except HTTPException as exc:
            return exc.status_code

    results = await asyncio.gather(*(rotate() for _ in range(8)))
    assert sum(not isinstance(result, int) for result in results) == 1
    assert results.count(401) == 7
    assert await token_revocation.is_revoked(decode_token(refresh)["jti"])


@pytest.mark.asyncio
async def test_security_migration_upgrade_downgrade_and_row_security(durable_store):
    engine = durable_store.kw["bind"]
    path = Path(__file__).parents[2] / "alembic/versions/20261008_security_state.py"
    spec = importlib.util.spec_from_file_location("security_state_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    assert migration.down_revision == "20261008_durable_jobs"

    def migrate(connection, upgrade):
        with Operations.context(MigrationContext.configure(connection)):
            (migration.upgrade if upgrade else migration.downgrade)()

    async with engine.begin() as db:
        await db.run_sync(SecurityState.__table__.drop)
        await db.run_sync(lambda connection: migrate(connection, True))
        columns = await db.run_sync(lambda connection: inspect(connection).get_columns(
            "security_states"
        ))
        assert {column["name"] for column in columns} >= {"namespace", "key_hash", "expires_at"}
        if engine.dialect.name == "postgresql":
            assert await db.scalar(text("SELECT relrowsecurity FROM pg_class WHERE oid = "
                                        "'security_states'::regclass")) is True
    assert await token_revocation.claim_revocation("migrated", int(time.time()) + 60)
    async with engine.begin() as db:
        await db.run_sync(lambda connection: migrate(connection, False))
        assert not await db.run_sync(lambda connection: inspect(connection).has_table(
            "security_states"
        ))
