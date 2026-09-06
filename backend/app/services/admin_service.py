from typing import Annotated

from fastapi import Depends
from sqlalchemy import exists, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)
from app.core.security import hash_password
from app.db.session import get_db
from app.models.associations import user_roles
from app.models.role import Role
from app.models.user import User
from app.schemas.admin import AdminUserCreate, AdminUserResponse, AdminUserUpdate
from app.schemas.common import PaginatedResponse
from app.services.phase2_common import add_audit, is_admin


class AdminUserService:
    """Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài khoản nào."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _count_active_admins(self, *, exclude_user_id: int | None = None) -> int:
        admin_role_id = await self.db.scalar(select(Role.id).where(Role.name == "Admin"))
        conditions = [User.is_active.is_(True)]
        if admin_role_id is not None:
            has_admin_role = exists().where(
                user_roles.c.user_id == User.id,
                user_roles.c.role_id == admin_role_id,
            )
            conditions.append(or_(User.is_superuser.is_(True), has_admin_role))
        else:
            conditions.append(User.is_superuser.is_(True))
        if exclude_user_id is not None:
            conditions.append(User.id != exclude_user_id)
        result = await self.db.scalar(
            select(func.count(User.id.distinct())).where(*conditions)
        )
        return result or 0

    async def _resolve_roles(self, role_ids: list[int]) -> list[Role]:
        if not role_ids:
            return []
        result = await self.db.execute(select(Role).where(Role.id.in_(role_ids)))
        roles = list(result.scalars().all())
        found_ids = {role.id for role in roles}
        missing = set(role_ids) - found_ids
        if missing:
            raise NotFoundException(f"Role id(s) not found: {sorted(missing)}")
        return roles

    async def list_users(
        self,
        *,
        q: str | None = None,
        role_id: int | None = None,
        is_active: bool | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResponse[AdminUserResponse]:
        conditions = []
        if q:
            pattern = f"%{q.strip()}%"
            conditions.append(
                or_(
                    User.full_name.ilike(pattern),
                    User.username.ilike(pattern),
                    User.email.ilike(pattern),
                )
            )
        if is_active is not None:
            conditions.append(User.is_active.is_(is_active))

        base_stmt = select(User)
        count_stmt = select(func.count(User.id.distinct()))
        if role_id is not None:
            base_stmt = base_stmt.join(user_roles, user_roles.c.user_id == User.id).where(
                user_roles.c.role_id == role_id
            )
            count_stmt = count_stmt.select_from(User).join(
                user_roles, user_roles.c.user_id == User.id
            ).where(user_roles.c.role_id == role_id)
        if conditions:
            base_stmt = base_stmt.where(*conditions)
            count_stmt = count_stmt.where(*conditions)

        total = await self.db.scalar(count_stmt) or 0
        result = await self.db.execute(
            base_stmt.order_by(User.created_at.desc(), User.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        items = list(result.scalars().unique().all())
        total_pages = (total + page_size - 1) // page_size if page_size else 0
        return PaginatedResponse(
            items=[AdminUserResponse.model_validate(user) for user in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    async def get_user(self, user_id: int) -> User:
        user = await self.db.scalar(select(User).where(User.id == user_id))
        if user is None:
            raise NotFoundException("User not found")
        return user

    async def create_user(self, data: AdminUserCreate, actor: User) -> User:
        # Cùng một vector leo thang quyền như role_ids của update_user, chỉ qua một cửa khác:
        # nếu không, người giữ quyền "user:create" có thể tạo một tài khoản mới mang
        # role Admin và đăng nhập bằng tài khoản đó.
        if data.role_ids and not is_admin(actor):
            raise ForbiddenException(
                "Admin privileges are required to assign roles to a new user"
            )
        if await self.db.scalar(select(User.id).where(User.email == data.email)):
            raise ConflictException("Email already registered")
        if await self.db.scalar(select(User.id).where(User.username == data.username)):
            raise ConflictException("Username already taken")

        roles = await self._resolve_roles(data.role_ids)
        user = User(
            email=data.email,
            username=data.username,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            is_active=data.is_active,
            is_superuser=False,
            email_verified=True,
            roles=roles,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        add_audit(
            self.db,
            actor.id,
            "CREATE",
            "User",
            user.id,
            new_values={
                "email": user.email,
                "username": user.username,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "roles": [role.name for role in roles],
            },
            description=f"Admin {actor.email} created user {user.email}",
        )
        return user

    def _authorize_privilege_changes(
        self, user: User, data: AdminUserUpdate, changes: dict, actor: User
    ) -> None:
        """Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền.

        Bản thân endpoint chỉ được bảo vệ bởi quyền "user:update", quyền mà một
        Admin có thể trao cho bất kỳ role tùy chỉnh nào. Nếu không có các kiểm tra này,
        một role như vậy có thể PATCH chính tài khoản của nó với is_superuser=true
        (hoặc role_ids=[<Admin>]) và chiếm quyền toàn hệ thống. Cả hai kiểm tra đều
        so sánh với giá trị đã lưu để một trường không thay đổi trên payload — admin UI
        luôn gửi toàn bộ form — không bao giờ kích hoạt chúng; chỉ một thay đổi thực sự
        mới yêu cầu quyền cao hơn.
        """
        if "is_superuser" in changes and changes["is_superuser"] != user.is_superuser:
            if not actor.is_superuser:
                raise ForbiddenException("Only a superuser can change superuser status")
            if user.id == actor.id:
                raise ForbiddenException("You cannot change your own superuser status")

        if data.role_ids is not None and set(data.role_ids) != {r.id for r in user.roles}:
            if not is_admin(actor):
                raise ForbiddenException(
                    "Admin privileges are required to change role assignments"
                )
            if user.id == actor.id:
                raise ForbiddenException("You cannot change your own role assignments")

    async def update_user(self, user_id: int, data: AdminUserUpdate, actor: User) -> User:
        user = await self.get_user(user_id)
        changes = data.model_dump(exclude_unset=True, exclude={"role_ids"})

        self._authorize_privilege_changes(user, data, changes, actor)

        if changes.get("is_active") is False and user.id == actor.id:
            raise BadRequestException("You cannot deactivate your own account")

        if data.username and data.username != user.username:
            if await self.db.scalar(
                select(User.id).where(User.username == data.username, User.id != user.id)
            ):
                raise ConflictException("Username already taken")

        new_roles: list[Role] | None = None
        if data.role_ids is not None:
            new_roles = await self._resolve_roles(data.role_ids)

        currently_admin = is_admin(user)
        new_is_superuser = (
            data.is_superuser if data.is_superuser is not None else user.is_superuser
        )
        new_role_names = (
            {role.name for role in new_roles}
            if new_roles is not None
            else {role.name for role in user.roles}
        )
        will_be_admin = new_is_superuser or "Admin" in new_role_names
        will_be_active = changes.get("is_active", user.is_active)

        if currently_admin and (not will_be_admin or not will_be_active):
            if await self._count_active_admins(exclude_user_id=user.id) == 0:
                raise BadRequestException(
                    "Cannot remove Admin access from the last remaining admin"
                )

        old_values = {field: getattr(user, field) for field in changes}
        if new_roles is not None:
            old_values["roles"] = [role.name for role in user.roles]

        for field, value in changes.items():
            setattr(user, field, value)
        if new_roles is not None:
            user.roles = new_roles

        await self.db.flush()
        await self.db.refresh(user)

        new_values = dict(changes)
        if new_roles is not None:
            new_values["roles"] = [role.name for role in new_roles]

        add_audit(
            self.db,
            actor.id,
            "UPDATE",
            "User",
            user.id,
            old_values=old_values,
            new_values=new_values,
            description=f"Admin {actor.email} updated user {user.email}",
        )
        return user

    async def deactivate_user(self, user_id: int, actor: User) -> User:
        user = await self.get_user(user_id)
        if user.id == actor.id:
            raise BadRequestException("You cannot deactivate your own account")
        if not user.is_active:
            return user
        if is_admin(user) and await self._count_active_admins(exclude_user_id=user.id) == 0:
            raise BadRequestException(
                "Cannot deactivate the last remaining admin"
            )
        user.is_active = False
        await self.db.flush()
        await self.db.refresh(user)
        add_audit(
            self.db,
            actor.id,
            "DEACTIVATE",
            "User",
            user.id,
            description=f"Admin {actor.email} deactivated user {user.email}",
        )
        return user

    async def reactivate_user(self, user_id: int, actor: User) -> User:
        user = await self.get_user(user_id)
        if user.is_active:
            return user
        user.is_active = True
        await self.db.flush()
        await self.db.refresh(user)
        add_audit(
            self.db,
            actor.id,
            "REACTIVATE",
            "User",
            user.id,
            description=f"Admin {actor.email} reactivated user {user.email}",
        )
        return user


async def get_admin_user_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AdminUserService:
    return AdminUserService(db)


AdminUserServiceDep = Annotated[AdminUserService, Depends(get_admin_user_service)]
