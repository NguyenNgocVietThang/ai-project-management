from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Query, Request, Response, UploadFile, status

from app.core.dependencies import CurrentMediaUser, CurrentUser, require_permissions
from app.core.rate_limit import AVATAR_UPLOAD_LIMIT, USER_SEARCH_LIMIT, limiter
from app.models.user import User
from app.schemas.admin import AdminUserCreate, AdminUserResponse, AdminUserUpdate
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.project import UserSummary
from app.schemas.user import (
    ChangePasswordRequest,
    DeleteAccountRequest,
    OAuthConnectResponse,
    OAuthProvider,
    UserResponse,
    UserUpdate,
)
from app.services.admin_service import AdminUserServiceDep
from app.services.oauth_service import OAuthServiceDep
from app.services.user_service import UserServiceDep

router = APIRouter()


# ─── Admin: quản lý người dùng ─────────────────────────────────────────────────
# NOTE: các route này dùng path converter tường minh "{user_id:int}" (không phải
# "{user_id}" thường) để các route cố định như "/me" và "/search" bên dưới không bao giờ bị
# các route admin nuốt mất — str converter mặc định của Starlette sẽ
# khớp cả "me"/"search" và làm Pydantic ép kiểu int thất bại (422)
# trước khi kịp rơi xuống route cố định.


@router.get("/", response_model=PaginatedResponse[AdminUserResponse])
async def list_users(
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:read"))],
    q: Optional[str] = Query(default=None, max_length=200),
    role_id: Optional[int] = Query(default=None),
    is_active: Optional[bool] = Query(default=None),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
):
    return await admin_service.list_users(
        q=q, role_id=role_id, is_active=is_active, page=page, page_size=page_size
    )


@router.post("/", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: AdminUserCreate,
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:create"))],
):
    return await admin_service.create_user(body, current_user)


@router.get("/search", response_model=list[UserSummary])
@limiter.limit(USER_SEARCH_LIMIT)
async def search_users(
    request: Request,
    current_user: CurrentUser,
    user_service: UserServiceDep,
    # min_length=3: đây là bộ chọn thành viên, không phải nơi trút toàn bộ danh bạ. Một
    # ký tự đơn ("a", "@") khớp gần như mọi tài khoản và cho phép bất kỳ người dùng đã đăng nhập
    # nào thu thập toàn bộ danh sách nhân sự, bao gồm cả email.
    q: Annotated[str, Query(min_length=3, max_length=200)],
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
):
    return await user_service.search_active_users(q, limit)


@router.get("/{user_id:int}", response_model=AdminUserResponse)
async def get_user(
    user_id: int,
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:read"))],
):
    return await admin_service.get_user(user_id)


@router.patch("/{user_id:int}", response_model=AdminUserResponse)
async def update_user(
    user_id: int,
    body: AdminUserUpdate,
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:update"))],
):
    return await admin_service.update_user(user_id, body, current_user)


@router.delete("/{user_id:int}", response_model=AdminUserResponse)
async def deactivate_user(
    user_id: int,
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:delete"))],
):
    return await admin_service.deactivate_user(user_id, current_user)


@router.post("/{user_id:int}/reactivate", response_model=AdminUserResponse)
async def reactivate_user(
    user_id: int,
    admin_service: AdminUserServiceDep,
    current_user: Annotated[User, Depends(require_permissions("user:update"))],
):
    return await admin_service.reactivate_user(user_id, current_user)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UserUpdate,
    current_user: CurrentUser,
    user_service: UserServiceDep,
):
    return await user_service.update_profile(current_user, body)


@router.post("/me/change-password", response_model=MessageResponse)
async def change_password(
    body: ChangePasswordRequest,
    current_user: CurrentUser,
    user_service: UserServiceDep,
):
    await user_service.change_password(current_user, body)
    return MessageResponse(message="Password updated. Please sign in again.")


@router.post("/me/avatar", response_model=UserResponse)
@limiter.limit(AVATAR_UPLOAD_LIMIT)
async def upload_avatar(
    request: Request,
    current_user: CurrentUser,
    user_service: UserServiceDep,
    file: UploadFile = File(...),
):
    return await user_service.upload_avatar(current_user, file)


@router.get("/{user_id}/avatar")
async def get_avatar(
    user_id: int, current_user: CurrentMediaUser, user_service: UserServiceDep
):
    data, content_type, storage_key = await user_service.get_avatar(user_id)
    return Response(
        content=data,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",
            "ETag": f'"{storage_key}"',
        },
    )


@router.post(
    "/me/linked-accounts/{provider}/connect",
    response_model=OAuthConnectResponse,
)
async def connect_social_account(
    provider: OAuthProvider,
    current_user: CurrentUser,
    oauth_service: OAuthServiceDep,
):
    state = oauth_service.generate_state(
        provider,
        mode="link",
        user_id=current_user.id,
    )
    return OAuthConnectResponse(
        authorization_url=oauth_service.get_authorization_url(provider, state)
    )


@router.delete(
    "/me/linked-accounts/{provider}",
    response_model=UserResponse,
)
async def disconnect_social_account(
    provider: OAuthProvider,
    current_user: CurrentUser,
    user_service: UserServiceDep,
):
    return await user_service.disconnect_social_account(current_user, provider)


@router.delete("/me", response_model=MessageResponse)
async def deactivate_account(
    body: DeleteAccountRequest,
    current_user: CurrentUser,
    user_service: UserServiceDep,
):
    await user_service.deactivate_account(current_user, body)
    return MessageResponse(message="Account deactivated successfully")
