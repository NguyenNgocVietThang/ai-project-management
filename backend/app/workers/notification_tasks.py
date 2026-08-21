"""Celery Beat task: sweeps tasks whose start_date/due_date crossed a
notification-relevant threshold today, and fans out a notification to the
whole project team (see notify_project_team). Runs once daily (see the
beat_schedule entry in celery_app.py).
"""
import asyncio
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.notification import NotificationType
from app.models.task import Task, TaskStatus
from app.services.phase2_common import notify_project_team
from app.workers.celery_app import celery_app

# How many days ahead of due_date counts as "due soon". Task.due_date has no
# time component, so this is a whole-day granularity, not a rolling 24h window.
DUE_SOON_DAYS_AHEAD = 1


@celery_app.task(name="notifications.sweep_task_dates")
def sweep_task_dates_task() -> dict:
    """Synchronous Celery entry point — runs the async sweep to completion."""
    return asyncio.run(_sweep_with_own_session())


async def _sweep_with_own_session() -> dict:
    async with AsyncSessionLocal() as db:
        result = await sweep_task_dates(db)
        await db.commit()
        return result


async def sweep_task_dates(db: AsyncSession) -> dict:
    """Fires 'task starting today' and 'task due soon' team notifications.
    Idempotent per day via Task.last_start_notified_at / last_due_soon_notified_at.
    Injectable `db` for testability — does not commit; caller is responsible.
    """
    today = date.today()
    now = datetime.now(timezone.utc)
    started = 0
    due_soon = 0

    starting_tasks = (
        await db.scalars(
            select(Task).where(
                Task.start_date == today,
                Task.status == TaskStatus.TODO,
                Task.last_start_notified_at.is_(None),
            )
        )
    ).all()
    for task in starting_tasks:
        await notify_project_team(
            db,
            task.project_id,
            title=f"Task '{task.name}' is starting today",
            message=f"Task '{task.name}' was scheduled to start today ({today.isoformat()}).",
            ntype=NotificationType.SYSTEM,
            link=f"/projects/{task.project_id}/tasks/{task.id}",
            entity_type="Task",
            entity_id=task.id,
        )
        task.last_start_notified_at = now
        started += 1

    due_soon_date = today + timedelta(days=DUE_SOON_DAYS_AHEAD)
    due_tasks = (
        await db.scalars(
            select(Task).where(
                Task.due_date == due_soon_date,
                Task.status.notin_([TaskStatus.DONE]),
                Task.last_due_soon_notified_at.is_(None),
            )
        )
    ).all()
    for task in due_tasks:
        await notify_project_team(
            db,
            task.project_id,
            title=f"Task '{task.name}' is due soon",
            message=f"Task '{task.name}' is due on {task.due_date.isoformat()}.",
            ntype=NotificationType.TASK_DUE_SOON,
            link=f"/projects/{task.project_id}/tasks/{task.id}",
            entity_type="Task",
            entity_id=task.id,
        )
        task.last_due_soon_notified_at = now
        due_soon += 1

    return {"started_notified": started, "due_soon_notified": due_soon}
