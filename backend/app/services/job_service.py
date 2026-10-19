"""Queue mutations belong to the caller's transaction; nothing commits here."""

from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy import case, or_, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job

ERROR_CODES = frozenset(
    {
        "provider_error",
        "provider_rejected",
        "model_catalog_unavailable",
        "no_free_model_available",
        "invalid_payload",
        "job_expired",
        "lease_expired",
        "external_outcome_unknown",
        "task_timeout",
        "handler_failed",
        "handler_missing",
        "attempts_exhausted",
        "ai_quota_exceeded",
        "ai_budget_exceeded",
        "resource_limit_exceeded",
        "project_unavailable",
        "email_expired",
        "email_unconfigured",
        "invalid_provider_response",
        "shutdown_interrupted",
        "storage_error",
        "database_unavailable",
    }
)


def utcnow() -> datetime:
    return datetime.now(UTC)


def aware(value: datetime) -> datetime:
    # SQLite drops timezone information; PostgreSQL returns aware timestamps.
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


def safe_error_code(code: str) -> str:
    return code if code in ERROR_CODES else "handler_failed"


class LeaseLostError(Exception):
    """The caller has no authority to publish or dispatch this attempt."""


async def enqueue(
    db: AsyncSession,
    kind: str,
    payload: dict,
    dedupe_key: str,
    *,
    owner_id: int | None = None,
    project_id: int | None = None,
    max_attempts: int = 3,
    expires_at: datetime | None = None,
    available_at: datetime | None = None,
    ambiguous_on_lease_loss: bool = False,
    coalesce: bool = False,
) -> Job:
    if not kind or len(kind) > 64 or not dedupe_key or len(dedupe_key) > 255 or max_attempts < 1:
        raise ValueError("Invalid job metadata")
    if coalesce and kind != "scheduling.cpm":
        raise ValueError("Only scheduling.cpm jobs support coalescing")
    dialect = db.get_bind().dialect.name
    if dialect not in {"postgresql", "sqlite"}:
        raise RuntimeError("Durable jobs require PostgreSQL (SQLite is for behavioral tests)")
    await db.flush()  # Ensure newly created owner/business rows exist before outbox FK insert.
    now = utcnow()
    statement = (pg_insert if dialect == "postgresql" else sqlite_insert)(Job).values(
        kind=kind,
        payload=payload,
        dedupe_key=dedupe_key,
        owner_id=owner_id,
        project_id=project_id,
        max_attempts=max_attempts,
        available_at=available_at or now,
        expires_at=expires_at,
        ambiguous_on_lease_loss=ambiguous_on_lease_loss,
        status="queued",
        attempts=0,
        generation=1,
        request_dispatched=False,
    )
    if coalesce:
        terminal = Job.status.in_(["succeeded", "failed"])
        statement = statement.on_conflict_do_update(
            index_elements=[Job.dedupe_key],
            set_={
                "payload": payload,
                "generation": Job.generation + 1,
                "status": case((Job.status == "running", "running"), else_="queued"),
                "available_at": available_at or now,
                "expires_at": expires_at,
                "attempts": case((terminal, 0), else_=Job.attempts),
                "error_code": None,
                "updated_at": now,
            },
            where=Job.kind == kind,
        )
    else:
        statement = statement.on_conflict_do_nothing(index_elements=[Job.dedupe_key])
    await db.execute(statement)
    job = await db.scalar(
        select(Job).where(Job.dedupe_key == dedupe_key).execution_options(populate_existing=True)
    )
    if job.kind != kind:
        raise ValueError("Dedupe key belongs to another job kind")
    return job


class JobService:
    @staticmethod
    async def claim(
        db: AsyncSession, limit: int, lease_seconds: float, *, now: datetime | None = None
    ) -> list[Job]:
        now = now or utcnow()
        if limit < 1 or lease_seconds <= 0:
            return []
        rows = (
            await db.scalars(
                select(Job)
                .where(
                    Job.status == "queued",
                    Job.available_at <= now,
                    Job.attempts < Job.max_attempts,
                    or_(Job.expires_at.is_(None), Job.expires_at > now),
                )
                .order_by(Job.available_at, Job.id)
                .limit(limit)
                .with_for_update(skip_locked=True)
                .execution_options(populate_existing=True)
            )
        ).all()
        claimed = []
        for job in rows:
            token = str(uuid4())
            result = await db.execute(
                update(Job)
                .where(Job.id == job.id, Job.status == "queued")
                .values(
                    status="running",
                    attempts=Job.attempts + 1,
                    lease_token=token,
                    lease_generation=Job.generation,
                    lease_expires_at=now + timedelta(seconds=lease_seconds),
                    error_code=None,
                )
                .execution_options(synchronize_session=False)
            )
            if result.rowcount:
                await db.refresh(job)
                claimed.append(job)
        return claimed

    @staticmethod
    async def lock_owned(
        db: AsyncSession, job_id: int, token: str, *, now: datetime | None = None
    ) -> Job:
        job = await db.scalar(
            select(Job)
            .where(Job.id == job_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if (
            job is None
            or job.status != "running"
            or job.lease_token != token
            or job.lease_expires_at is None
            or aware(job.lease_expires_at) <= (now or utcnow())
            or (job.expires_at is not None and aware(job.expires_at) <= (now or utcnow()))
        ):
            raise LeaseLostError()
        return job

    @staticmethod
    def succeed(job: Job, claimed_generation: int, result: dict | None = None) -> None:
        job.result = result
        job.error_code = None
        job.lease_token = None
        job.lease_generation = None
        job.lease_expires_at = None
        if job.generation != claimed_generation:
            job.status = "queued"
            job.available_at = utcnow()
            job.attempts = 0
        else:
            job.status = "succeeded"
            job.staged_result = None

    @staticmethod
    def fail(job: Job, code: str, *, retryable: bool, now: datetime | None = None) -> None:
        now = now or utcnow()
        newer_generation = (
            job.kind == "scheduling.cpm"
            and job.lease_generation is not None
            and job.generation != job.lease_generation
        )
        job.error_code = safe_error_code(code)
        job.lease_token = None
        job.lease_generation = None
        job.lease_expires_at = None
        if newer_generation and (job.expires_at is None or aware(job.expires_at) > now):
            job.status = "queued"
            job.available_at = now
            job.attempts = 0
            return
        delay = timedelta(seconds=min(300, 2 ** min(job.attempts, 8)))
        retry_time = now + delay
        can_retry = (
            retryable
            and job.attempts < job.max_attempts
            and (job.expires_at is None or aware(job.expires_at) > retry_time)
        )
        job.status = "queued" if can_retry else "failed"
        if can_retry:
            job.available_at = retry_time

    @staticmethod
    async def recover_expired(
        db: AsyncSession, *, now: datetime | None = None, limit: int = 100
    ) -> list[Job]:
        now = now or utcnow()
        jobs = (
            await db.scalars(
                select(Job)
                .where(
                    or_(
                        (Job.status == "running") & (Job.lease_expires_at <= now),
                        (Job.status == "queued") & (Job.expires_at <= now),
                        (Job.status == "queued") & (Job.attempts >= Job.max_attempts),
                    )
                )
                .order_by(Job.id)
                .limit(limit)
                .with_for_update(skip_locked=True)
                .execution_options(populate_existing=True)
            )
        ).all()
        for job in jobs:
            if job.expires_at is not None and aware(job.expires_at) <= now:
                JobService.fail(job, "job_expired", retryable=False, now=now)
            elif (
                job.ambiguous_on_lease_loss and job.request_dispatched and job.staged_result is None
            ):
                JobService.fail(job, "external_outcome_unknown", retryable=False, now=now)
            else:
                JobService.fail(job, "lease_expired", retryable=True, now=now)
                # Lease recovery is immediately eligible; failures use backoff.
                if job.status == "queued":
                    job.available_at = now
        return list(jobs)
