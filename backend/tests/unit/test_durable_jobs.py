import asyncio
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import select
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.job_runner import JobResult, JobRunner
from app.models.job import Job
from app.services.job_service import JobService, LeaseLostError, enqueue


@pytest.mark.asyncio
async def test_outbox_dedupes_and_rolls_back_with_business_transaction(session):
    first = await enqueue(session, "email.send", {"email_id": 1}, "email:1")
    duplicate = await enqueue(session, "email.send", {"email_id": 2}, "email:1")
    assert first.id == duplicate.id
    assert duplicate.payload == {"email_id": 1}
    await session.rollback()
    assert (await session.scalars(select(Job))).all() == []


@pytest.mark.asyncio
async def test_stale_worker_cannot_publish_after_lease_reclaim(session):
    now = datetime.now(UTC)
    await enqueue(session, "test", {}, "fence", available_at=now)
    await session.commit()
    old = (await JobService.claim(session, 1, 10, now=now))[0]
    token = old.lease_token
    await session.commit()
    await JobService.recover_expired(session, now=now + timedelta(seconds=11))
    await session.commit()
    fresh = (await JobService.claim(session, 1, 10, now=now + timedelta(seconds=12)))[0]
    await session.commit()
    assert fresh.lease_token != token
    with pytest.raises(LeaseLostError):
        await JobService.lock_owned(session, old.id, token, now=now + timedelta(seconds=12))


@pytest.mark.asyncio
async def test_external_dispatch_without_checkpoint_requires_manual_review(session):
    now = datetime.now(UTC)
    await enqueue(
        session, "ai.generate", {}, "ai:1", ambiguous_on_lease_loss=True, available_at=now
    )
    await session.commit()
    job = (await JobService.claim(session, 1, 10, now=now))[0]
    job.request_dispatched = True
    await session.commit()
    await JobService.recover_expired(session, now=now + timedelta(seconds=11))
    await session.commit()
    await session.refresh(job)
    assert job.status == "failed"
    assert job.error_code == "external_outcome_unknown"


@pytest.mark.asyncio
async def test_staged_provider_result_survives_lease_recovery(session):
    now = datetime.now(UTC)
    await enqueue(
        session, "ai.generate", {}, "ai:2", ambiguous_on_lease_loss=True, available_at=now
    )
    await session.commit()
    job = (await JobService.claim(session, 1, 10, now=now))[0]
    job.request_dispatched = True
    job.staged_result = {"answer": 42}
    await session.commit()
    await JobService.recover_expired(session, now=now + timedelta(seconds=11))
    await session.commit()
    await session.refresh(job)
    assert job.status == "queued"
    assert job.staged_result == {"answer": 42}


@pytest.mark.asyncio
async def test_cpm_edits_while_running_force_another_generation(session):
    await enqueue(session, "scheduling.cpm", {"v": 1}, "cpm:1", coalesce=True)
    await session.commit()
    job = (await JobService.claim(session, 1, 120))[0]
    generation, token = job.generation, job.lease_token
    await session.commit()
    await enqueue(session, "scheduling.cpm", {"v": 2}, "cpm:1", coalesce=True)
    await session.commit()
    owned = await JobService.lock_owned(session, job.id, token)
    JobService.succeed(owned, generation, {"v": 1})
    await session.commit()
    assert owned.status == "queued"
    assert owned.payload == {"v": 2}
    assert owned.generation == generation + 1


@pytest.mark.asyncio
async def test_retry_budget_and_expiry_are_bounded(session):
    now = datetime.now(UTC)
    await enqueue(session, "test", {}, "bounded", max_attempts=1, available_at=now)
    await session.commit()
    job = (await JobService.claim(session, 1, 10, now=now))[0]
    JobService.fail(job, "provider_error", retryable=True, now=now)
    await session.commit()
    assert job.status == "failed"
    await enqueue(session, "test", {}, "expired", expires_at=now - timedelta(seconds=1))
    await session.commit()
    await JobService.recover_expired(session, now=now)
    await session.commit()
    expired = await session.scalar(select(Job).where(Job.dedupe_key == "expired"))
    assert expired.status == "failed"
    assert expired.error_code == "job_expired"


@pytest.mark.asyncio
async def test_runner_commits_result_and_business_write_atomically(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        job = await enqueue(db, "test", {}, "atomic")
        job_id = job.id

    async def handler(ctx):
        async def apply(db, job):
            job.payload = {"business_write": True}
            raise ValueError("SECRET provider token must never become an error")

        return JobResult(result={"success": True}, apply=apply)

    runner = JobRunner(factory, {"test": handler})
    assert await runner.poll_once() == 1
    await asyncio.gather(*runner._active)
    async with factory() as db:
        job = await db.get(Job, job_id)
        assert job.payload == {}
        assert job.result is None
        assert job.status == "failed"
        assert job.error_code == "handler_failed"


@pytest.mark.asyncio
async def test_runner_bounds_concurrency_timeout_and_shutdown(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        for index in range(3):
            await enqueue(db, "test", {}, f"capacity:{index}", max_attempts=1)
    gate = asyncio.Event()
    started = 0

    async def handler(ctx):
        nonlocal started
        started += 1
        await gate.wait()
        return JobResult()

    runner = JobRunner(
        factory, {"test": handler}, concurrency=1, task_timeout=0.1, lease_seconds=10
    )
    assert await runner.poll_once() == 1
    await asyncio.sleep(0)
    assert await runner.poll_once() == 0
    await asyncio.gather(*runner._active)
    assert started == 1
    async with factory() as db:
        jobs = list((await db.scalars(select(Job).order_by(Job.id))).all())
        assert jobs[0].status == "failed"
        assert jobs[0].error_code == "task_timeout"
        assert [job.status for job in jobs[1:]] == ["queued", "queued"]
    runner.start()
    await runner.stop()
    assert runner._loop_task.done()


@pytest.mark.asyncio
async def test_cpm_latest_edit_survives_old_generation_exhausting_retries(session):
    now = datetime.now(UTC)
    await enqueue(
        session,
        "scheduling.cpm",
        {"v": 1},
        "cpm:retry",
        coalesce=True,
        max_attempts=1,
        available_at=now,
    )
    await session.commit()
    job = (await JobService.claim(session, 1, 10, now=now))[0]
    await session.commit()
    await enqueue(session, "scheduling.cpm", {"v": 2}, "cpm:retry", coalesce=True)
    await session.commit()
    await JobService.recover_expired(session, now=now + timedelta(seconds=11))
    await session.commit()
    await session.refresh(job)
    assert job.status == "queued"
    assert job.attempts == 0
    assert job.payload == {"v": 2}


@pytest.mark.asyncio
async def test_shutdown_also_drains_jobs_claimed_by_poll_already_in_progress(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        await enqueue(db, "test", {}, "shutdown-race")
    entered, proceed, terminated = asyncio.Event(), asyncio.Event(), asyncio.Event()

    async def handler(ctx):
        try:
            await asyncio.Event().wait()
        finally:
            terminated.set()

    runner = JobRunner(factory, {"test": handler}, shutdown_timeout=0.05)
    original_poll = runner.poll_once

    async def blocked_poll():
        entered.set()
        await proceed.wait()
        return await original_poll()

    runner.poll_once = blocked_poll
    runner.start()
    await entered.wait()
    stopping = asyncio.create_task(runner.stop())
    await asyncio.sleep(0)
    proceed.set()
    await stopping
    assert terminated.is_set()


@pytest.mark.asyncio
async def test_success_checkpoint_and_transition_are_durable(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        job_id = (await enqueue(db, "test", {}, "success-checkpoint")).id

    async def handler(ctx):
        await ctx.mark_dispatched()
        await ctx.stage_result({"answer": 42})
        assert ctx.job.staged_result == {"answer": 42}

        async def apply(db, job):
            job.payload = {"published": ctx.job.staged_result["answer"]}

        return JobResult(result={"answer": 42}, apply=apply)

    transitions = []

    async def on_transition(db, job):
        transitions.append(job.status)

    runner = JobRunner(factory, {"test": handler}, on_transition=on_transition)
    await runner.poll_once()
    await asyncio.gather(*runner._active)
    async with factory() as db:
        job = await db.get(Job, job_id)
        assert job.status == "succeeded"
        assert job.result == {"answer": 42}
        assert job.payload == {"published": 42}
        assert job.staged_result is None
        assert job.request_dispatched_at is not None
    assert transitions == ["running", "succeeded"]


@pytest.mark.asyncio
async def test_obsolete_cpm_generation_does_not_apply_stale_schedule(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        job_id = (await enqueue(db, "scheduling.cpm", {"v": 1}, "cpm:obsolete", coalesce=True)).id
    entered, proceed = asyncio.Event(), asyncio.Event()
    applied = []

    async def handler(ctx):
        entered.set()
        await proceed.wait()

        async def apply(db, job):
            applied.append(ctx.generation)
            job.payload = {"v": 1}

        return JobResult(result={"v": 1}, apply=apply)

    runner = JobRunner(factory, {"scheduling.cpm": handler})
    await runner.poll_once()
    await entered.wait()
    async with factory() as db, db.begin():
        await enqueue(db, "scheduling.cpm", {"v": 2}, "cpm:obsolete", coalesce=True)
    proceed.set()
    await asyncio.gather(*runner._active)
    async with factory() as db:
        job = await db.get(Job, job_id)
        assert job.status == "queued"
        assert job.payload == {"v": 2}
    assert applied == []


@pytest.mark.asyncio
async def test_transient_database_error_retries_without_persisting_parameters(engine):
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        job_id = (await enqueue(db, "test", {}, "transient-db")).id

    async def handler(ctx):
        raise OperationalError(
            "private SQL", {"token": "private token"}, Exception("private connection")
        )

    runner = JobRunner(factory, {"test": handler})
    await runner.poll_once()
    await asyncio.gather(*runner._active)
    async with factory() as db:
        job = await db.get(Job, job_id)
        assert job.status == "queued"
        assert job.error_code == "database_unavailable"
        assert job.attempts == 1
        assert job.available_at is not None
