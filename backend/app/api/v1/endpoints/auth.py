from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.auth_cookies import (
    clear_session_cookies,
    read_refresh_token,
    set_session_cookies,
)
from app.core.dependencies import CurrentUser
from app.core.exceptions import ServiceUnavailableException, UnauthorizedException
from app.core.oauth_exchange import redeem as redeem_exchange_code
from app.core.rate_limit import (
    EMAIL_VERIFY_LIMIT,
    LOGIN_LIMIT,
    PASSWORD_RESET_LIMIT,
    REFRESH_LIMIT,
    REGISTER_LIMIT,
    RESET_CONSUME_LIMIT,
    WS_TICKET_LIMIT,
    limiter,
)
from app.core.ws_tickets import issue as issue_ws_ticket
from app.schemas.auth import (
    AccessTokenResponse,
    ForgotPasswordRequest,
    LogoutRequest,
    OAuthExchangeRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    WebSocketTicketResponse,
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


@router.post("/login", response_model=AccessTokenResponse)
@limiter.limit(LOGIN_LIMIT)
async def login(
    request: Request,
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: AuthServiceDep,
):
    """Đăng nhập bằng email và mật khẩu.

    Refresh token đi vào một cookie httpOnly, không nằm trong body: nó là credential
    tồn tại lâu nhất ở đây, nên nó là thứ phải nằm ngoài tầm với của JavaScript.
    """
    user = await auth_service.authenticate(form_data.username, form_data.password)
    tokens = auth_service.issue_tokens(user)
    set_session_cookies(response, tokens.refresh_token, tokens.access_token)
    return AccessTokenResponse(access_token=tokens.access_token)


@router.post("/refresh", response_model=AccessTokenResponse)
@limiter.limit(REFRESH_LIMIT)
async def refresh_token(
    request: Request,
    response: Response,
    auth_service: AuthServiceDep,
    body: RefreshRequest | None = None,
):
    """Làm mới access token.

    Trình duyệt không gửi gì cả — refresh token tới từ cookie httpOnly. Body vẫn
    được chấp nhận cho client không phải trình duyệt, vốn không có kho cookie.
    """
    presented = read_refresh_token(request, body.refresh_token if body else None)
    if not presented:
        raise UnauthorizedException("Could not validate credentials")
    tokens = await auth_service.refresh(presented)
    set_session_cookies(response, tokens.refresh_token, tokens.access_token)
    return AccessTokenResponse(access_token=tokens.access_token)


@router.post("/oauth/exchange", response_model=AccessTokenResponse)
@limiter.limit(LOGIN_LIMIT)
async def exchange_oauth_code(
    request: Request, response: Response, body: OAuthExchangeRequest
):
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
    set_session_cookies(response, refresh_token, access_token)
    return AccessTokenResponse(access_token=access_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: Request,
    response: Response,
    auth_service: AuthServiceDep,
    body: LogoutRequest | None = None,
):
    """Thu hồi cả refresh token lẫn access token của người gọi.

    Access token được lấy từ header Authorization chứ không yêu cầu client gửi lại
    trong body — client nào cũng đã đính kèm nó sẵn, và việc thu hồi nó là điều
    khiến đăng xuất có hiệu lực ngay thay vì sau khi token tự hết hạn.

    Body là tùy chọn để các client cũ không gửi body vẫn nhận mã 200
    và đăng xuất sạch phía client, chỉ là không thu hồi refresh token trên server.
    """
    authorization = request.headers.get("authorization", "")
    access_token = (
        authorization[7:].strip() if authorization.lower().startswith("bearer ") else None
    )
    await auth_service.logout(
        read_refresh_token(request, body.refresh_token if body else None), access_token
    )
    clear_session_cookies(response)
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


@router.post("/ws-ticket", response_model=WebSocketTicketResponse)
@limiter.limit(WS_TICKET_LIMIT)
async def create_websocket_ticket(request: Request, current_user: CurrentUser):
    """Cấp một vé dùng một lần, hạn 60 giây, cho WebSocket handshake.

    Trình duyệt không đặt được header trên handshake, nên trước đây access token
    được truyền trên query string và rơi vào access log của mọi proxy ở giữa. Client
    gọi endpoint này (bằng header Authorization như mọi request khác) ngay trước
    mỗi lần kết nối, kể cả khi kết nối lại — nhờ đó socket không bao giờ mang một
    token đã chết.
    """
    try:
        ticket = await issue_ws_ticket(current_user.id, current_user.auth_version or 0)
    except Exception as exc:
        raise ServiceUnavailableException(
            "Real-time updates are temporarily unavailable"
        ) from exc
    return WebSocketTicketResponse(ticket=ticket)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUser):
    """Lấy thông tin hồ sơ của người dùng hiện đang đăng nhập."""
    return current_user
