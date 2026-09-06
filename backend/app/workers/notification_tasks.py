"""Celery Beat task: quét các task có start_date/due_date vượt qua một
ngưỡng liên quan đến thông báo trong hôm nay, và phát tán một thông báo tới
toàn bộ đội dự án (xem notify_project_team). Chạy một lần mỗi ngày (xem
mục beat_schedule trong celery_app.py).
"""
import asyncio
from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.notification import NotificationType
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.services.phase2_common import notify_project_team
from app.workers.celery_app import celery_app

# Bao nhiêu ngày trước due_date thì được tính là "sắp đến hạn". Task.due_date không
# có thành phần thời gian, nên đây là độ mịn theo nguyên ngày, không phải cửa sổ trượt 24h.
DUE_SOON_DAYS_AHEAD = 1


@celery_app.task(
    bind=True,
    name="notifications.sweep_task_dates",
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=300,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def sweep_task_dates_task(self) -> dict:
    """Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat.

    Co retry: `task_acks_late` bao ve khi worker chet, nhung khong bao ve khi loi
    ung dung (DB gian doan, SMTP timeout). Khong co retry thi ban quet cua ngay
    hom do mat trang va khong ai biet - lan chay ke tiep la 24 gio sau.

    Idempotent qua `last_start_notified_at` / `last_due_soon_notified_at`, nen
    chay lai an toan.
    """
    return asyncio.run(_sweep_with_own_session())


# Bao nhieu task thi commit mot lan. Mot ban quet toan he thong co the cham hang
# nghin task, moi task lai fan-out cho ca nhom; gom tat ca vao MOT transaction se
# giu lock rat lau va mat trang neu co bat ky loi nao o cuoi. Cac cot
# last_*_notified_at khien viec commit theo lo van an toan: phan da lam se khong
# duoc lam lai o lan chay sau.
COMMIT_BATCH_SIZE = 100


async def _sweep_with_own_session() -> dict:
    async with AsyncSessionLocal() as db:
        result = await sweep_task_dates(db, commit_every=COMMIT_BATCH_SIZE)
        await db.commit()
        return result


async def sweep_task_dates(db: AsyncSession, *, commit_every: int | None = None) -> dict:
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
