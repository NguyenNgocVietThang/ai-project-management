from typing import Annotated, Optional

from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.associations import user_roles
from app.models.permission import Permission
from app.models.role import Role
from app.models.user import User
from app.schemas.admin import RoleCreate, RoleUpdate
from app.services.phase2_common import add_audit

PROTECTED_ROLE_NAME = "Admin"


class RoleService:
    """Admin-only role & role-permission management. Permissions themselves are a
    fixed, seeded catalog — only role <-> permission assignment is editable."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _user_counts_by_role(self) -> dict[int, int]:
        result = await self.db.execute(
            select(user_roles.c.role_id, func.count(user_roles.c.user_id)).group_by(
                user_roles.c.role_id
            )
        )
        return dict(result.all())

    async def list_roles(self) -> list[tuple[Role, int]]:
        result = await self.db.execute(select(Role).order_by(Role.name))
        roles = list(result.scalars().all())
        counts = await self._user_counts_by_role()
        return [(role, counts.get(role.id, 0)) for role in roles]

    async def get_role(self, role_id: int) -> tuple[Role, int]:
        role = await self.db.scalar(select(Role).where(Role.id == role_id))
        if role is None:
            raise NotFoundException("Role not found")
        count = await self.db.scalar(
            select(func.count(user_roles.c.user_id)).where(user_roles.c.role_id == role_id)
        )
        return role, count or 0

    async def _resolve_permissions(self, permission_ids: list[int]) -> list[Permission]:
        if not permission_ids:
            return []
        result = await self.db.execute(
            select(Permission).where(Permission.id.in_(permission_ids))
        )
        permissions = list(result.scalars().all())
        found_ids = {permission.id for permission in permissions}
        missing = set(permission_ids) - found_ids
        if missing:
            raise NotFoundException(f"Permission id(s) not found: {sorted(missing)}")
        return permissions

    async def create_role(self, data: RoleCreate, actor: User) -> Role:
        if await self.db.scalar(select(Role.id).where(Role.name == data.name)):
            raise ConflictException("A role with this name already exists")
        permissions = await self._resolve_permissions(data.permission_ids)
        role = Role(name=data.name, description=data.description, permissions=permissions)
        self.db.add(role)
        await self.db.flush()
        await self.db.refresh(role)
        add_audit(
            self.db,
            actor.id,
            "CREATE",
            "Role",
            role.id,
            new_values={
                "name": role.name,
                "description": role.description,
                "permissions": [f"{p.resource}:{p.action}" for p in permissions],
            },
            description=f"Admin {actor.email} created role {role.name}",
        )
        return role

    async def update_role(self, role_id: int, data: RoleUpdate, actor: User) -> Role:
        role = await self.db.scalar(select(Role).where(Role.id == role_id))
        if role is None:
            raise NotFoundException("Role not found")

        if data.name and data.name != role.name:
            if role.name == PROTECTED_ROLE_NAME:
                raise ForbiddenException(f"The built-in '{PROTECTED_ROLE_NAME}' role cannot be renamed")
            if await self.db.scalar(
                select(Role.id).where(Role.name == data.name, Role.id != role.id)
            ):
                raise ConflictException("A role with this name already exists")

        old_values = {
            "name": role.name,
            "description": role.description,
            "permissions": [f"{p.resource}:{p.action}" for p in role.permissions],
        }

        if data.name:
            role.name = data.name
        if data.description is not None:
            role.description = data.description
        if data.permission_ids is not None:
            role.permissions = await self._resolve_permissions(data.permission_ids)

        await self.db.flush()
        await self.db.refresh(role)

        add_audit(
            self.db,
            actor.id,
            "UPDATE",
            "Role",
            role.id,
            old_values=old_values,
            new_values={
                "name": role.name,
                "description": role.description,
                "permissions": [f"{p.resource}:{p.action}" for p in role.permissions],
            },
            description=f"Admin {actor.email} updated role {role.name}",
        )
        return role

    async def delete_role(self, role_id: int, actor: User) -> None:
        role = await self.db.scalar(select(Role).where(Role.id == role_id))
        if role is None:
            raise NotFoundException("Role not found")
        if role.name == PROTECTED_ROLE_NAME:
            raise ForbiddenException(f"The built-in '{PROTECTED_ROLE_NAME}' role cannot be deleted")

        user_count = await self.db.scalar(
            select(func.count(user_roles.c.user_id)).where(user_roles.c.role_id == role_id)
        )
        if user_count:
            raise ConflictException(
                f"Cannot delete role: {user_count} user(s) are still assigned to it"
            )

        add_audit(
            self.db,
            actor.id,
            "DELETE",
            "Role",
            role.id,
            old_values={"name": role.name, "description": role.description},
            description=f"Admin {actor.email} deleted role {role.name}",
        )
        await self.db.delete(role)
        await self.db.flush()


async def get_role_service(db: Annotated[AsyncSession, Depends(get_db)]) -> RoleService:
    return RoleService(db)


RoleServiceDep = Annotated[RoleService, Depends(get_role_service)]
