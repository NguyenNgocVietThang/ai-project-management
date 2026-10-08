"""Handlers for supported durable work. No Celery worker is required."""
import hashlib
from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit

from app.core.job_runner import JobResult, PermanentJobError, RetryableJobError
from app.models.user import User
from app.services.job_service import aware


async def run_cpm(ctx):
    async def apply(db, job):
        from sqlalchemy import func, select

        from app.core.config import settings
        from app.models.dependency import Dependency
        from app.models.task import Task
        project_id = job.payload["project_id"]
        count = await db.scalar(select(func.count()).select_from(Task).where(Task.project_id == project_id))
        project_tasks = select(Task.id).where(Task.project_id == project_id)
        edges = await db.scalar(select(func.count()).select_from(Dependency).where(Dependency.predecessor_id.in_(project_tasks), Dependency.successor_id.in_(project_tasks)))
        if count > settings.CPM_MAX_TASKS or edges > settings.CPM_MAX_DEPENDENCIES:
            raise PermanentJobError("resource_limit_exceeded")
        from app.services.scheduling_service import recalculate_project
        await recalculate_project(db, project_id, force_sync=True)
    return JobResult(result={"project_id": ctx.job.payload["project_id"]}, apply=apply)


async def run_email(ctx):
    from app.utils.email import (
        send_email_verification_email,
        send_password_reset_email,
        send_project_invitation_email,
    )
    now = datetime.now(UTC)
    if ctx.job.request_dispatched_at and now >= aware(ctx.job.request_dispatched_at) + timedelta(hours=23):
        raise PermanentJobError("email_expired")
    data = ctx.job.payload
    async with ctx.session_factory() as db:
        user = await db.get(User, data["user_id"])
        if user is None or not user.is_active:
            raise PermanentJobError("invalid_payload")
        recipient = user.email
        if ctx.job.kind in ("email.verify", "email.reset"):
            token = parse_qs(urlsplit(data["link"]).query).get("token", [""])[0]
            expected = hashlib.sha256(token.encode()).hexdigest()
            actual = user.email_verification_token_hash if ctx.job.kind == "email.verify" else user.password_reset_token_hash
            expiry = user.email_verification_expires_at if ctx.job.kind == "email.verify" else user.password_reset_expires_at
            if expected != actual or expiry is None or aware(expiry) <= now:
                raise PermanentJobError("email_expired")
        elif ctx.job.kind == "email.invite":
            from sqlalchemy import select

            from app.models.associations import project_members
            from app.models.project import Project
            project = await db.get(Project, ctx.job.project_id)
            member = await db.scalar(select(project_members.c.user_id).where(project_members.c.project_id == ctx.job.project_id, project_members.c.user_id == user.id))
            if project is None or project.deleted_at is not None or member is None:
                raise PermanentJobError("project_unavailable")
        await db.commit()
    await ctx.mark_dispatched()
    try:
        if ctx.job.kind == "email.verify":
            await send_email_verification_email(recipient, data["link"], idempotency_key=ctx.job.dedupe_key)
        elif ctx.job.kind == "email.reset":
            await send_password_reset_email(recipient, data["link"], idempotency_key=ctx.job.dedupe_key)
        else:
            await send_project_invitation_email(recipient, data["inviter_name"], data["project_name"], data["role_name"], data["link"], idempotency_key=ctx.job.dedupe_key)
    except Exception as exc:
        # Adapter exception text/response may contain tokens or email addresses.
        from app.utils.email import EmailDeliveryError
        if isinstance(exc, EmailDeliveryError) and not exc.retryable:
            raise PermanentJobError("provider_rejected") from exc
        raise RetryableJobError("provider_error") from exc
    return JobResult(result={"sent": True})


HANDLERS = {"scheduling.cpm": run_cpm, "email.verify": run_email, "email.reset": run_email, "email.invite": run_email}
