from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from typing import Any, Iterable, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, NotFoundException
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
    exclude_user_ids: Optional[Iterable[int]] = None,
    link: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[int] = None,
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
    for user_id in member_ids:
        if user_id in exclude:
            continue
        await NotificationService.push(
            db,
            user_id=user_id,
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
    if isinstance(value, (date, datetime)):
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
    entity_id: Optional[int],
    *,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    description: Optional[str] = None,
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

