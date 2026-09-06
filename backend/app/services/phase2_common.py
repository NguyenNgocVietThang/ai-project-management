from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, NotFoundException
from app.core.request_context import set_current_project_id
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.notification import NotificationType
from app.models.project import Project
from app.models.role import Role
from app.models.task import Task
from app.models.user import User


@dataclass
class ProjectContext:
    project: Project
    role: str
    is_admin: bool


def is_admin(user: User) -> bool:
    return bool(user.is_superuser or any(role.name == "Admin" for role in user.roles))


async def get_project_context(
    db: AsyncSession, project_id: int, user: User
) -> ProjectContext:
    project = await db.get(Project, project_id)
    if project is None or project.deleted_at is not None:
        raise NotFoundException("Project not found")
    # Công bố dự án cho phần còn lại của request để mỗi dòng audit ghi lại được nó
    # mà không cần truyền qua từng lời gọi — xem app/core/request_context.py. Chỉ
    # đặt sau khi project đã được xác nhận tồn tại, và trước khi kiểm tra quyền
    # cũng không sao: một request bị 403 thì không ghi audit nào cả.
    set_current_project_id(project_id)
    admin = is_admin(user)
    if admin:
        return ProjectContext(project=project, role="Admin", is_admin=True)
    role = await db.scalar(
        select(Role.name)
        .select_from(project_members.join(Role, Role.id == project_members.c.role_id))
        .where(
            project_members.c.project_id == project_id,
            project_members.c.user_id == user.id,
        )
    )
    if role is None:
        # project_service coi project.pm_id là quản lý dự án (xem _capabilities ở đó),
        # nên nếu chỉ đọc project_members thì hai nơi có hai định nghĩa "PM" khác nhau.
        # Hiện create() luôn thêm PM vào project_members nên chưa vỡ, nhưng bất kỳ
        # đường nào đặt pm_id mà không thêm dòng thành viên sẽ khoá chính PM ra ngoài.
        if project.pm_id == user.id:
            return ProjectContext(project=project, role="PM", is_admin=False)
        raise ForbiddenException("You do not have access to this project")
    return ProjectContext(project=project, role=role, is_admin=False)


async def require_project_roles(
    db: AsyncSession, project_id: int, user: User, *roles: str
) -> ProjectContext:
    context = await get_project_context(db, project_id, user)
    if not context.is_admin and context.role not in roles:
        raise ForbiddenException(f"Required project roles: {list(roles)}")
    return context


async def get_task_context(db: AsyncSession, task_id: int, user: User):
    task = await db.get(Task, task_id)
    if task is None:
        raise NotFoundException("Task not found")
    context = await get_project_context(db, task.project_id, user)
    return task, context


async def notify_project_team(
    db: AsyncSession,
    project_id: int,
    *,
    title: str,
    message: str,
    ntype: NotificationType,
    exclude_user_ids: Iterable[int] | None = None,
    link: str | None = None,
    entity_type: str | None = None,
    entity_id: int | None = None,
) -> None:
    """Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`,
    bỏ qua bất kỳ id nào trong `exclude_user_ids` (thường là người thực hiện thay
    đổi, và/hoặc người đã nhận được push cụ thể hơn ở nơi khác)."""
    from app.services.notification_service import NotificationService

    exclude = set(exclude_user_ids) if exclude_user_ids else set()
    member_ids = (
        await db.scalars(
            select(project_members.c.user_id).where(project_members.c.project_id == project_id)
        )
    ).all()
    recipients = [user_id for user_id in member_ids if user_id not in exclude]
    # Một lần INSERT + một pipeline Redis cho cả nhóm. Vòng lặp gọi push() trước đây
    # tốn một flush và một round-trip Redis cho MỖI thành viên, ngay trong request —
    # nghĩa là mỗi lần đổi trạng thái task trên dự án 50 người phải trả 100 round-trip.
    await NotificationService.push_many(
        db,
        recipients,
        title=title,
        message=message,
        ntype=ntype,
        link=link,
        entity_type=entity_type,
        entity_id=entity_id,
    )


def json_value(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, date | datetime):
        return value.isoformat()
    if isinstance(value, list):
        return [json_value(item) for item in value]
    if isinstance(value, dict):
        return {key: json_value(item) for key, item in value.items()}
    return value


def serialize_model(instance: Any) -> dict:
    return {
        column.key: json_value(getattr(instance, column.key))
        for column in instance.__table__.columns
    }


def add_audit(
    db: AsyncSession,
    user_id: int,
    action: str,
    entity_type: str,
    entity_id: int | None,
    *,
    old_values: dict | None = None,
    new_values: dict | None = None,
    description: str | None = None,
) -> None:
    db.add(
        AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=json_value(old_values),
            new_values=json_value(new_values),
            description=description,
        )
    )

