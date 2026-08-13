from typing import Annotated, Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Dependency: Get current authenticated user from JWT token."""
    credentials_exception = UnauthorizedException("Could not validate credentials")

    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise credentials_exception

    # Import here to avoid circular imports
    from app.repositories.user_repository import UserRepository
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id_int)
    if user is None:
        raise credentials_exception
    if payload.get("ver", 0) != (user.auth_version or 0):
        raise credentials_exception
    if not user.is_active:
        raise ForbiddenException("Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_active_superuser(current_user: CurrentUser) -> User:
    """Dependency: Require the current user to be a superuser (bypasses all RBAC checks)."""
    if not current_user.is_superuser:
        raise ForbiddenException("Superuser privileges required")
    return current_user


def require_roles(*roles: str):
    """Dependency factory: Require user to have one of the specified roles.

    Superusers always pass, regardless of assigned roles.
    """
    async def role_checker(current_user: CurrentUser) -> User:
        if current_user.is_superuser:
            return current_user
        user_roles = {r.name for r in current_user.roles}
        if not user_roles.intersection(roles):
            raise ForbiddenException(f"Required roles: {list(roles)}")
        return current_user
    return role_checker


def require_permissions(*permissions: str):
    """Dependency factory: Require user to hold one of the given "resource:action"
    permissions (via any of their roles). Superusers always pass.

    Example: Depends(require_permissions("project:create", "project:update"))
    """
    async def permission_checker(current_user: CurrentUser) -> User:
        if current_user.is_superuser:
            return current_user
        user_permissions = {
            f"{p.resource}:{p.action}"
            for role in current_user.roles
            for p in role.permissions
        }
        if not user_permissions.intersection(permissions):
            raise ForbiddenException(f"Required permissions: {list(permissions)}")
        return current_user
    return permission_checker
