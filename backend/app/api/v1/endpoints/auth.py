from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.dependencies import CurrentUser
from app.core.exceptions import UnauthorizedException
from app.core.oauth_exchange import redeem as redeem_exchange_code
from app.core.rate_limit import (
    EMAIL_VERIFY_LIMIT,
    LOGIN_LIMIT,
    PASSWORD_RESET_LIMIT,
    REFRESH_LIMIT,
    REGISTER_LIMIT,
    RESET_CONSUME_LIMIT,
    limiter,
)
from app.schemas.auth import (
    ForgotPasswordRequest,
    LogoutRequest,
    OAuthExchangeRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.schemas.common import MessageResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthServiceDep

router = APIRouter()

FORGOT_PASSWORD_MESSAGE = "If the email exists, a reset link has been sent"
EMAIL_VERIFIED_MESSAGE = "Email verified successfully"
VERIFICATION_SENT_MESSAGE = "Verification email sent"
ALREADY_VERIFIED_MESSAGE = "Email is already verified"


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit(REGISTER_LIMIT)
async def register(request: Request, body: RegisterRequest, auth_service: AuthServiceDep):
    """Đăng ký tài khoản người dùng mới."""
    user = await auth_service.register(body)
    return user


@router.post("/login", response_model=TokenResponse)
@limiter.limit(LOGIN_LIMIT)
async def login(
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: AuthServiceDep,
):
    """Đăng nhập bằng email và mật khẩu, trả về cặp JWT token."""
    user = await auth_service.authenticate(form_data.username, form_data.password)
    return auth_service.issue_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit(REFRESH_LIMIT)
async def refresh_token(request: Request, body: RefreshRequest, auth_service: AuthServiceDep):
    """Làm mới access token bằng refresh token."""
    return await auth_service.refresh(body.refresh_token)


@router.post("/oauth/exchange", response_model=TokenResponse)
@limiter.limit(LOGIN_LIMIT)
async def exchange_oauth_code(request: Request, body: OAuthExchangeRequest):
    """Đổi mã one-time code từ OAuth redirect lấy cặp token thực tế.

    Dùng một lần: lần gọi thứ hai với cùng mã sẽ thất bại, do đó mã bị lưu
    trong lịch sử duyệt web hoặc log proxy sau khi SPA đã dùng sẽ vô hiệu.
    """
    try:
        tokens = await redeem_exchange_code(body.code)
    except Exception as exc:
        raise UnauthorizedException("Sign-in link is no longer valid") from exc
    if tokens is None:
        raise UnauthorizedException("Sign-in link is no longer valid")
    access_token, refresh_token = tokens
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(auth_service: AuthServiceDep, body: LogoutRequest | None = None):
    """Thu hồi refresh token của người gọi để việc đăng xuất an toàn trước rủi ro token bị đánh cắp.

    Body là tùy chọn để các client cũ không gửi body vẫn nhận mã 200
    và đăng xuất sạch phía client, chỉ là không thu hồi trên server.
    """
    await auth_service.logout(body.refresh_token if body else None)
    return MessageResponse(message="Logged out successfully")


@router.post("/forgot-password", response_model=MessageResponse)
@limiter.limit(PASSWORD_RESET_LIMIT)
async def forgot_password(
    request: Request, body: ForgotPasswordRequest, auth_service: AuthServiceDep
):
    """Đưa email đặt lại mật khẩu vào hàng đợi đồng thời ngăn chặn kỹ thuật dò quét email."""
    await auth_service.request_password_reset(body.email)
    return MessageResponse(message=FORGOT_PASSWORD_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
@limiter.limit(RESET_CONSUME_LIMIT)
async def reset_password(
    request: Request, body: ResetPasswordRequest, auth_service: AuthServiceDep
):
    """Xác thực token one-time hợp lệ và đặt mật khẩu cục bộ mới."""
    await auth_service.reset_password(body)
    return MessageResponse(message="Password reset successful")


@router.get("/verify-email", response_model=MessageResponse)
@limiter.limit(EMAIL_VERIFY_LIMIT)
async def verify_email(
    request: Request,
    auth_service: AuthServiceDep,
    token: str | None = Query(default=None),
):
    """Xác thực token xác minh email one-time hợp lệ."""
    await auth_service.verify_email(token)
    return MessageResponse(message=EMAIL_VERIFIED_MESSAGE)


@router.post("/resend-verification", response_model=MessageResponse)
@limiter.limit(EMAIL_VERIFY_LIMIT)
async def resend_verification(
    request: Request, current_user: CurrentUser, auth_service: AuthServiceDep
):
    """Đưa vào hàng đợi email xác minh mới cho người dùng đã đăng nhập."""
    sent = await auth_service.resend_email_verification(current_user.id)
    message = VERIFICATION_SENT_MESSAGE if sent else ALREADY_VERIFIED_MESSAGE
    return MessageResponse(message=message)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUser):
    """Lấy thông tin hồ sơ của người dùng hiện đang đăng nhập."""
    return current_user
