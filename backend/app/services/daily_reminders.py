from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.notification import NotificationType
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.services.phase2_common import notify_project_team

DUE_SOON_DAYS_AHEAD = 1

async def sweep_task_dates(db: AsyncSession, *, commit_every: int | None = None, task_ids: list[int] | None = None) -> dict:
    """Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.
    Idempotent theo từng ngày qua Task.last_start_notified_at / last_due_soon_notified_at.
    `db` có thể inject để dễ test — không commit; bên gọi chịu trách nhiệm việc đó.

    `commit_every` chot tien do theo tung lo. Bo trong (mac dinh, cho test) thi
    khong co commit trung gian nao.
    """
    processed = 0

    async def checkpoint() -> None:
        nonlocal processed
        processed += 1
        if commit_every and processed % commit_every == 0:
            await db.commit()
    # Gio he thong cua container thuong la UTC; ban quet phai chay theo mui gio
    # cua ung dung, nếu không 'hom nay' se lech mot ngay voi nguoi dung.
    today = datetime.now(ZoneInfo(settings.APP_TIMEZONE)).date()
    now = datetime.now(UTC)
    started = 0
    due_soon = 0

    starting_tasks = (
        await db.scalars(
            # Join sang Project: neu khong, cron 08:00 hang ngay van gui thong bao
            # cho task cua nhung du an da bi xoa mem.
            select(Task)
            .join(Project, Project.id == Task.project_id)
            .where(
                Task.start_date == today,
                Task.id.in_(task_ids) if task_ids is not None else True,
                Task.status == TaskStatus.TODO,
                Task.last_start_notified_at.is_(None),
                Project.deleted_at.is_(None),
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
        await checkpoint()

    due_soon_date = today + timedelta(days=DUE_SOON_DAYS_AHEAD)
    due_tasks = (
        await db.scalars(
            select(Task)
            .join(Project, Project.id == Task.project_id)
            .where(
                Task.due_date == due_soon_date,
                Task.id.in_(task_ids) if task_ids is not None else True,
                Task.status.notin_([TaskStatus.DONE]),
                Task.last_due_soon_notified_at.is_(None),
                Project.deleted_at.is_(None),
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
        await checkpoint()

    return {"started_notified": started, "due_soon_notified": due_soon}
