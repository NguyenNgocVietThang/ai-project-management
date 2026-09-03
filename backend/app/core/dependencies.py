from typing import Annotated, Optional

from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def _user_from_token(token: str, db: AsyncSession) -> User:
    """Phân giải và xác thực một bearer token thành một User đang tồn tại và active."""
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

    # Import tại đây để tránh circular import
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


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Dependency: Lấy user đã xác thực hiện tại từ Authorization header."""
    return await _user_from_token(token, db)


async def get_current_user_media(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>).

    Các request đó không mang Authorization header, nên hàm này cũng chấp nhận
    cookie `auth-token` mà frontend đã sao chép access token vào (xem
    frontend/src/store/authStore.ts). Nó mở rộng nơi token có thể đến từ đâu, chứ không
    thay đổi điều gì được coi là hợp lệ — vẫn áp dụng các kiểm tra decode + auth_version + is_active
    như nhau. Xác thực bằng cookie ở đây là an toàn vì các route này là
    GET chỉ đọc, nên không có thay đổi trạng thái nào có thể bị CSRF.
    """
    token: Optional[str] = None
    authorization = request.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
    if not token:
        token = request.cookies.get("auth-token")
    if not token:
        raise UnauthorizedException("Could not validate credentials")
    return await _user_from_token(token, db)


async def get_current_verified_user(current_user: "CurrentUser") -> User:
    """Yêu cầu địa chỉ email đã được xác nhận.

    Việc đăng ký gửi một link xác minh, nhưng trước đây không có gì kiểm tra kết quả,
    nên toàn bộ luồng chỉ mang tính trang trí: bất kỳ ai cũng có thể đăng ký bằng một địa chỉ họ
    không kiểm soát và ngay lập tức tạo project, mời thành viên và đăng trong chat —
    mỗi việc đó đều gửi mail trông như đến từ hệ thống này.

    Các route chỉ đọc và bản thân các endpoint xác minh vẫn mở cho
    người dùng chưa xác minh để họ vẫn xem được hồ sơ và yêu cầu gửi lại email.
    """
    if not current_user.email_verified:
        raise ForbiddenException(
            "Please verify your email address before performing this action"
        )
    return current_user


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentMediaUser = Annotated[User, Depends(get_current_user_media)]
CurrentVerifiedUser = Annotated[User, Depends(get_current_verified_user)]


async def get_current_active_superuser(current_user: CurrentUser) -> User:
    """Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)."""
    if not current_user.is_superuser:
        raise ForbiddenException("Superuser privileges required")
    return current_user


def require_roles(*roles: str):
    """Dependency factory: Yêu cầu user có một trong các role được chỉ định.

    Superuser luôn vượt qua, bất kể role được gán là gì.
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
    """Dependency factory: Yêu cầu user nắm giữ một trong các permission "resource:action"
    đã cho (qua bất kỳ role nào của họ). Superuser luôn vượt qua.

    Ví dụ: Depends(require_permissions("project:create", "project:update"))
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
