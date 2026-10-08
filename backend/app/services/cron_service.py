"""Daily schedules use Vietnam dates; catch up only today's bounded window."""
import asyncio
from datetime import UTC, datetime, time, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import and_, delete, or_, select

from app.core.config import settings
from app.core.job_runner import JobResult, PermanentJobError
from app.models.project import Project, ProjectStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.services.job_service import enqueue


async def enqueue_due_schedules(db, *, now=None):
    tz = ZoneInfo(settings.APP_TIMEZONE)
    now = (now or datetime.now(UTC)).astimezone(tz)
    jobs = []
    for name, hour, minute in (("reminders", 8, 0), ("risk", 8, 30)):
        due = datetime.combine(now.date(), time(hour, minute), tz)
        expiry = due + timedelta(hours=settings.CRON_CATCHUP_HOURS)
        if due <= now < expiry:
            jobs.append(await enqueue(db, f"cron.{name}", {"day": now.date().isoformat(), "after_id": 0}, f"cron:{name}:{now.date().isoformat()}:0", expires_at=expiry))
    return jobs


async def run_daily_batch(ctx):
    data = ctx.job.payload
    tz = ZoneInfo(settings.APP_TIMEZONE)
    day = datetime.fromisoformat(data["day"]).date()
    if datetime.now(tz).date() != day:
        raise PermanentJobError("job_expired")

    async def apply(db, job):
        if job.kind == "cron.risk":
            from app.models.ai_request import AIRequestType
            from app.services.ai_service import AIService
            projects = (await db.scalars(select(Project).where(Project.id > data["after_id"], Project.status == ProjectStatus.ACTIVE, Project.deleted_at.is_(None)).order_by(Project.id).limit(settings.CRON_BATCH_SIZE))).all()
            for project in projects:
                user = await db.get(User, project.pm_id)
                if user is None or not user.is_active or not user.email_verified:
                    continue
                await AIService(db)._queue(AIRequestType.RISK_ANALYSIS, {"project_id": project.id}, user, project_id=project.id, message="Daily risk scan queued", request_key=f"cron-risk:{day}:{project.id}")
                # Expiry prevents an old queued scan from running after a long pause.
                from app.models.job import Job
                risk_job = await db.scalar(select(Job).where(Job.dedupe_key == f"ai:{user.id}:RISK_ANALYSIS:cron-risk:{day}:{project.id}"))
                risk_job.expires_at = job.expires_at
            ids = [project.id for project in projects]
        else:
            tasks = (await db.scalars(select(Task).join(Project, Project.id == Task.project_id).where(
                Task.id > data["after_id"], Project.deleted_at.is_(None),
                or_(and_(Task.start_date == day, Task.status == TaskStatus.TODO, Task.last_start_notified_at.is_(None)),
                    and_(Task.due_date == day + timedelta(days=1), Task.status != TaskStatus.DONE, Task.last_due_soon_notified_at.is_(None))),
            ).order_by(Task.id).limit(settings.CRON_BATCH_SIZE).with_for_update(of=Task))).all()
            from app.services.daily_reminders import sweep_task_dates
            ids = [task.id for task in tasks]
            if ids:
                await sweep_task_dates(db, task_ids=ids)
        if len(ids) == settings.CRON_BATCH_SIZE:
            name = job.kind.split(".")[1]
            await enqueue(db, job.kind, {"day": data["day"], "after_id": ids[-1]}, f"cron:{name}:{day}:{ids[-1]}", expires_at=job.expires_at)
    return JobResult(result={"day": data["day"]}, apply=apply)


async def catchup_loop(session_factory, stop):
    # This loop has no inbound HTTP ping; sleeping Render remains asleep.
    while not stop.is_set():
        try:
            async with session_factory() as db, db.begin():
                await enqueue_due_schedules(db)
                from app.models.job import Job
                expired_ids = select(Job.id).where(Job.status.in_(["succeeded", "failed"]), Job.updated_at < datetime.now(UTC) - timedelta(days=7)).order_by(Job.id).limit(100)
                await db.execute(delete(Job).where(Job.id.in_(expired_ids)))
        except Exception:
            import logging
            logging.getLogger(__name__).warning("Schedule catchup unavailable (database_unavailable)")
        try:
            await asyncio.wait_for(stop.wait(), timeout=60)
        except TimeoutError:
            pass


CRON_HANDLERS = {"cron.reminders": run_daily_batch, "cron.risk": run_daily_batch}
