"""Real PostgreSQL contract tests. TEST_POSTGRES_URL must point to a disposable DB.

Each test creates and removes a unique schema. SQLite cannot verify SKIP LOCKED,
transaction isolation, fencing while competing, or PostgreSQL DDL behavior.
"""

import asyncio
import importlib.util
import os
import subprocess
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import uuid4

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.core.config import settings
from app.core.job_runner import PermanentJobError
from app.models.job import Job
from app.models.security_state import SecurityState
from app.services.ai.job_context import reserve_ai_call
from app.services.job_service import JobService, LeaseLostError, enqueue


@pytest_asyncio.fixture
async def postgres_factory():
    url = os.getenv("TEST_POSTGRES_URL")
    if not url:
        pytest.skip(
            "Set TEST_POSTGRES_URL to a disposable PostgreSQL server; SQLite does not prove locks"
        )
    admin = create_async_engine(url)
    schema = f"job_test_{uuid4().hex}"
    async with admin.begin() as db:
        await db.execute(text(f'CREATE SCHEMA "{schema}"'))
    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    async with engine.begin() as db:
        await db.execute(text("CREATE TABLE users (id INTEGER PRIMARY KEY)"))
        await db.execute(text("CREATE TABLE projects (id INTEGER PRIMARY KEY)"))
        await db.run_sync(lambda connection: Job.__table__.create(connection))
    try:
        yield async_sessionmaker(engine, expire_on_commit=False)
    finally:
        await engine.dispose()
        async with admin.begin() as db:
            await db.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        await admin.dispose()


@pytest.mark.asyncio
async def test_postgres_concurrent_dedupe_and_skip_locked_claims(postgres_factory):
    factory = postgres_factory

    async def insert():
        async with factory() as db, db.begin():
            return (await enqueue(db, "test", {}, "concurrent")).id

    ids = await asyncio.gather(insert(), insert(), insert())
    assert len(set(ids)) == 1
    async with factory() as db, db.begin():
        await enqueue(db, "test", {}, "second")
    # The first transaction intentionally holds its row lock. A competing claim
    # must immediately return the other job instead of blocking or double claiming.
    async with factory() as first, first.begin():
        claimed_first = await JobService.claim(first, 1, 120)
        async with factory() as second, second.begin():
            claimed_second = await asyncio.wait_for(JobService.claim(second, 2, 120), timeout=2)
            assert len(claimed_second) == 1
            assert claimed_first[0].id != claimed_second[0].id


@pytest.mark.asyncio
async def test_postgres_concurrent_ai_dispatch_reservations_enforce_daily_cap(postgres_factory, monkeypatch):
    factory = postgres_factory
    monkeypatch.setattr(settings, "AI_DAILY_JOB_LIMIT", 2)
    async with factory().bind.begin() as db:
        await db.run_sync(SecurityState.__table__.create)

    async def reserve():
        try:
            async with factory() as db, db.begin():
                await reserve_ai_call(db, None)
            return True
        except PermanentJobError as exc:
            assert str(exc) == "ai_quota_exceeded"
            return False

    results = await asyncio.gather(*(reserve() for _ in range(8)))
    assert results.count(True) == 2
    assert results.count(False) == 6
    async with factory() as db:
        assert await db.scalar(text("SELECT counter FROM security_states WHERE namespace='ai-quota'")) == 2


@pytest.mark.asyncio
async def test_postgres_restart_recovery_fences_abandoned_worker(postgres_factory):
    factory = postgres_factory
    now = datetime.now(UTC)
    async with factory() as db, db.begin():
        await enqueue(db, "test", {}, "restart", available_at=now)
    async with factory() as db, db.begin():
        job = (await JobService.claim(db, 1, 10, now=now))[0]
        job_id, old_token = job.id, job.lease_token
    # Closing that session simulates the abandoned runner. A new runner recovers.
    async with factory() as db, db.begin():
        await JobService.recover_expired(db, now=now + timedelta(seconds=11))
    async with factory() as db, db.begin():
        replacement = (await JobService.claim(db, 1, 10, now=now + timedelta(seconds=12)))[0]
        assert replacement.lease_token != old_token
    async with factory() as db, db.begin():
        with pytest.raises(LeaseLostError):
            await JobService.lock_owned(db, job_id, old_token, now=now + timedelta(seconds=12))


@pytest.mark.asyncio
async def test_postgres_jobs_migration_upgrade_downgrade(postgres_factory):
    factory = postgres_factory
    migration_path = Path(__file__).parents[2] / "alembic/versions/20261008_durable_jobs.py"
    spec = importlib.util.spec_from_file_location("jobs_migration_test", migration_path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)

    def verify(connection):
        Job.__table__.drop(connection)
        migration.op = Operations(MigrationContext.configure(connection))
        migration.upgrade()
        assert connection.execute(text("SELECT to_regclass('jobs')")).scalar() == "jobs"
        connection.execute(
            text(
                "INSERT INTO jobs(kind,payload,dedupe_key,available_at) VALUES ('test','{}','unique',now())"
            )
        )
        assert connection.execute(text("SELECT max_attempts FROM jobs")).scalar() == 3
        assert connection.execute(
            text("SELECT relrowsecurity FROM pg_class WHERE oid='jobs'::regclass")
        ).scalar()
        # Even an accidentally granted SELECT permission does not expose rows to
        # a non-owner role without a policy. The backend table owner still reads.
        reader = f"job_reader_{uuid4().hex}"
        schema = connection.execute(text("SELECT current_schema()")).scalar()
        connection.execute(text(f'CREATE ROLE "{reader}" NOSUPERUSER NOBYPASSRLS'))
        connection.execute(text(f'GRANT USAGE ON SCHEMA "{schema}" TO "{reader}"'))
        connection.execute(text(f'GRANT SELECT ON jobs TO "{reader}"'))
        connection.execute(text(f'SET LOCAL ROLE "{reader}"'))
        assert connection.execute(text("SELECT count(*) FROM jobs")).scalar() == 0
        connection.execute(text("RESET ROLE"))
        connection.execute(text(f'REVOKE SELECT ON jobs FROM "{reader}"'))
        connection.execute(text(f'REVOKE USAGE ON SCHEMA "{schema}" FROM "{reader}"'))
        connection.execute(text(f'DROP ROLE "{reader}"'))
        migration.downgrade()
        assert connection.execute(text("SELECT to_regclass('jobs')")).scalar() is None
        migration.upgrade()

    async with factory().bind.begin() as db:
        await db.run_sync(verify)


@pytest.mark.asyncio
async def test_postgres_recovers_after_worker_process_dies(postgres_factory):
    factory = postgres_factory
    async with factory() as db, db.begin():
        job_id = (await enqueue(db, "test", {}, "process-death")).id
        schema = await db.scalar(text("SELECT current_schema()"))
    child_env = dict(os.environ, JOB_TEST_SCHEMA=schema)
    script = """
import asyncio, os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.services.job_service import JobService
async def run():
    engine = create_async_engine(os.environ['TEST_POSTGRES_URL'], connect_args={
        'server_settings': {'search_path': os.environ['JOB_TEST_SCHEMA']}})
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        assert len(await JobService.claim(db, 1, 0.1)) == 1
    os._exit(23)  # No finally, heartbeat, graceful shutdown or process-local queue.
asyncio.run(run())
"""
    # Windows sandbox disallows asyncio's named pipes. A worker needs no IPC;
    # inherit no output handles and wait in a thread so the event loop stays free.
    process = await asyncio.to_thread(
        subprocess.run,
        [sys.executable, "-c", script],
        env=child_env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        timeout=20,
    )
    assert process.returncode == 23
    await asyncio.sleep(0.15)
    async with factory() as db, db.begin():
        await JobService.recover_expired(db)
    async with factory() as db, db.begin():
        replacement = (await JobService.claim(db, 1, 120))[0]
        assert replacement.id == job_id
        assert replacement.attempts == 2
