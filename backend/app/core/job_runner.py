"""Bounded durable job execution, with short transactions around external work."""

import asyncio
import logging
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from datetime import timedelta

from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.models.job import Job
from app.services.job_service import JobService, LeaseLostError, safe_error_code, utcnow

logger = logging.getLogger(__name__)
ApplyResult = Callable[[AsyncSession, Job], Awaitable[None]]
Transition = Callable[[AsyncSession, Job], Awaitable[None]]


class JobError(Exception):
    retryable = False

    def __init__(self, code: str = "handler_failed"):
        self.code = safe_error_code(code)
        super().__init__(self.code)


class RetryableJobError(JobError):
    retryable = True


class PermanentJobError(JobError):
    pass


class AmbiguousJobError(PermanentJobError):
    def __init__(self, code: str = "external_outcome_unknown"):
        super().__init__(code)


@dataclass
class JobResult:
    result: dict | None = None
    apply: ApplyResult | None = None


class JobContext:
    def __init__(self, job: Job, session_factory: async_sessionmaker[AsyncSession]):
        self.job = job
        self.session_factory = session_factory
        self.job_id = job.id
        self.lease_token = job.lease_token
        self.generation = job.generation

    async def mark_dispatched(self, before_dispatch: ApplyResult | None = None) -> None:
        """Persist dispatch intent before sending; optional quota reservation is atomic."""
        async with self.session_factory() as db, db.begin():
            owned = await JobService.lock_owned(db, self.job_id, self.lease_token)
            if before_dispatch is not None:
                await before_dispatch(db, owned)
            owned.request_dispatched = True
            if owned.request_dispatched_at is None:
                owned.request_dispatched_at = utcnow()
            self.job.request_dispatched = True
            self.job.request_dispatched_at = owned.request_dispatched_at

    async def stage_result(self, result: dict) -> None:
        """Save provider response before generating business rows; safe to resume."""
        async with self.session_factory() as db, db.begin():
            owned = await JobService.lock_owned(db, self.job_id, self.lease_token)
            owned.staged_result = result
        self.job.staged_result = result

    async def assert_lease(self) -> None:
        async with self.session_factory() as db, db.begin():
            await JobService.lock_owned(db, self.job_id, self.lease_token)


Handler = Callable[[JobContext], Awaitable[JobResult]]


class JobRunner:
    def __init__(
        self,
        session_factory: async_sessionmaker[AsyncSession],
        handlers: dict[str, Handler],
        *,
        concurrency: int = 1,
        poll_interval: float = 2,
        lease_seconds: float = 120,
        task_timeout: float = 90,
        shutdown_timeout: float = 10,
        on_transition: Transition | None = None,
    ):
        if (
            concurrency < 1
            or min(poll_interval, lease_seconds, task_timeout, shutdown_timeout) <= 0
        ):
            raise ValueError("Job runner bounds must be positive")
        if task_timeout >= lease_seconds:
            raise ValueError("Task timeout must be shorter than its lease")
        self.session_factory = session_factory
        self.handlers = handlers
        self.concurrency = concurrency
        self.poll_interval = poll_interval
        self.lease_seconds = lease_seconds
        self.task_timeout = task_timeout
        self.shutdown_timeout = shutdown_timeout
        self.on_transition = on_transition
        self._stop = asyncio.Event()
        self._loop_task: asyncio.Task | None = None
        self._active: set[asyncio.Task] = set()

    def start(self) -> None:
        if self._loop_task is None or self._loop_task.done():
            self._stop.clear()
            self._loop_task = asyncio.create_task(self._loop(), name="durable-job-poll")

    async def stop(self) -> None:
        self._stop.set()
        deadline = asyncio.get_running_loop().time() + self.shutdown_timeout
        if self._loop_task is not None:
            _, pending = await asyncio.wait({self._loop_task}, timeout=self.shutdown_timeout)
            for task in pending:
                task.cancel()
            if pending:
                await asyncio.wait(pending, timeout=min(1, self.shutdown_timeout))
        # A poll already in progress can claim jobs after stop() begins. Snapshot
        # active tasks only after stopping that poll so those tasks also drain.
        if not self._active:
            return
        remaining = max(0, deadline - asyncio.get_running_loop().time())
        _, pending = await asyncio.wait(set(self._active), timeout=remaining)
        for task in pending:
            task.cancel()
        # Cancellation may happen in external work. Leave its durable lease for
        # recovery; no shutdown path republishes unverified business results.
        if pending:
            await asyncio.wait(pending, timeout=min(1, self.shutdown_timeout))

    async def _transition(self, db: AsyncSession, job: Job) -> None:
        if self.on_transition:
            await self.on_transition(db, job)

    async def poll_once(self) -> int:
        """Recover and claim only free execution slots; useful for deterministic tests."""
        free = self.concurrency - len(self._active)
        async with self.session_factory() as db, db.begin():
            recovered = await JobService.recover_expired(db)
            for job in recovered:
                await self._transition(db, job)
            jobs = await JobService.claim(db, max(0, free), self.lease_seconds)
            for job in jobs:
                await self._transition(db, job)
            # Context snapshots remain valid even with expire_on_commit=True.
            for job in jobs:
                db.expunge(job)
        for job in jobs:
            task = asyncio.create_task(
                self._execute(JobContext(job, self.session_factory)), name=f"job-{job.id}"
            )
            self._active.add(task)
            task.add_done_callback(self._active.discard)
        return len(jobs)

    async def _loop(self) -> None:
        while not self._stop.is_set():
            try:
                await self.poll_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                # SQL errors can include payload parameters; never log exc text.
                logger.warning("Durable job poll failed (database_unavailable)")
            try:
                await asyncio.wait_for(self._stop.wait(), timeout=self.poll_interval)
            except TimeoutError:
                pass

    async def _heartbeat(self, ctx: JobContext) -> None:
        while True:
            await asyncio.sleep(max(0.01, self.lease_seconds / 3))
            async with self.session_factory() as db, db.begin():
                owned = await JobService.lock_owned(db, ctx.job_id, ctx.lease_token)
                owned.lease_expires_at = utcnow() + timedelta(seconds=self.lease_seconds)

    async def _perform(self, ctx: JobContext) -> None:
        handler = self.handlers.get(ctx.job.kind)
        if handler is None:
            raise PermanentJobError("handler_missing")
        result = await handler(ctx)
        if not isinstance(result, JobResult):
            raise PermanentJobError("handler_failed")
        async with self.session_factory() as db, db.begin():
            owned = await JobService.lock_owned(db, ctx.job_id, ctx.lease_token)
            # New CPM edits already committed while computation was running. Do
            # not overwrite those edits with an obsolete generation's schedule.
            current_generation = owned.generation == ctx.generation
            if result.apply is not None and current_generation:
                await result.apply(db, owned)
            JobService.succeed(owned, ctx.generation, result.result if current_generation else None)
            await self._transition(db, owned)

    async def _execute(self, ctx: JobContext) -> None:
        heartbeat = asyncio.create_task(self._heartbeat(ctx), name=f"lease-{ctx.job_id}")
        try:
            await asyncio.wait_for(self._perform(ctx), timeout=self.task_timeout)
        except (asyncio.CancelledError, LeaseLostError):
            # A crashed/stopped worker leaves the recovery rules to decide whether
            # another external call is safe. A stale worker can never finish.
            return
        except Exception as exc:
            code = "task_timeout" if isinstance(exc, asyncio.TimeoutError) else "handler_failed"
            retryable = isinstance(exc, asyncio.TimeoutError)
            if isinstance(exc, DBAPIError):
                code, retryable = "database_unavailable", True
            if isinstance(exc, JobError):
                code, retryable = exc.code, exc.retryable
            try:
                async with self.session_factory() as db, db.begin():
                    owned = await JobService.lock_owned(db, ctx.job_id, ctx.lease_token)
                    if (
                        owned.ambiguous_on_lease_loss
                        and owned.request_dispatched
                        and owned.staged_result is None
                    ):
                        code, retryable = "external_outcome_unknown", False
                    JobService.fail(owned, code, retryable=retryable)
                    await self._transition(db, owned)
            except LeaseLostError:
                pass
            except Exception:
                logger.warning("Durable job failure persistence failed (database_unavailable)")
        finally:
            heartbeat.cancel()
            try:
                await heartbeat
            except (asyncio.CancelledError, LeaseLostError):
                pass
            except Exception:
                logger.warning("Durable job heartbeat failed (database_unavailable)")
