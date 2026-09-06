import hashlib
import logging
import math
import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated
from urllib.parse import urlencode

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
)
from app.core.login_throttle import (
    clear as clear_login_failures,
)
from app.core.login_throttle import (
    record_failure as record_login_failure,
)
from app.core.login_throttle import (
    seconds_until_unlocked,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.token_revocation import is_revoked, revoke
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, ResetPasswordRequest, TokenResponse
from app.workers.email_tasks import (
    send_email_verification_task,
    send_password_reset_email_task,
)

logger = logging.getLogger(__name__)

PASSWORD_RESET_EXPIRES_HOURS = 1
INVALID_RESET_TOKEN_MESSAGE = "Invalid or expired reset token"
EMAIL_VERIFICATION_EXPIRES_HOURS = 24
EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS = 60
INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE = "Invalid or expired email verification token"


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.users = UserRepository(db)

    async def register(self, data: RegisterRequest) -> User:
        if await self.users.get_by_email(data.email):
            raise ConflictException("Email already registered")
        if await self.users.get_by_username(data.username):
            raise ConflictException("Username already taken")

        user = User(
            email=data.email,
            username=data.username,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            email_verified=False,
        )
        user = await self.users.create(user)
        raw_token = await self._replace_email_verification_token(user)
        verification_link = self._email_verification_link(raw_token)

        try:
            send_email_verification_task.delay(user.email, verification_link)
        except Exception:
            # Quá trình đăng ký vẫn thành công. Không ghi log địa chỉ người nhận hoặc đường link/token.
            logger.exception(
                "Failed to enqueue email verification for newly registered user_id=%s",
                user.id,
            )
        return user

    def _audit(
        self,
        action: str,
        *,
        user_id: int | None = None,
        description: str | None = None,
    ) -> None:
        """Ghi lại một sự kiện xác thực.

        ip_address được điền tự động từ ngữ cảnh request (xem
        app/models/audit_log.py). Không bao giờ ghi lại mật khẩu được gửi lên hoặc
        email của một tài khoản không xác định — nếu không, một bản ghi đăng nhập thất bại
        cho người dùng không tồn tại sẽ biến audit log thành một danh sách các địa chỉ phỏng đoán.
        """
        self.db.add(
            AuditLog(
                user_id=user_id,
                action=action,
                entity_type="Auth",
                entity_id=user_id,
                description=description,
            )
        )

    async def authenticate(self, email: str, password: str) -> User:
        # Kiểm tra khoá tài khoản trước cả khi tra cứu user: nếu không, mỗi lần thử
        # trong lúc đang bị khoá vẫn tốn một lần so khớp bcrypt, biến chính cơ chế
        # bảo vệ thành một kênh khuếch đại tải.
        locked_for = await seconds_until_unlocked(email)
        if locked_for:
            raise UnauthorizedException(
                "Too many failed sign-in attempts. Please try again later."
            )

        user = await self.users.get_by_email(email)
        if not user:
            # Vẫn tính là một lần thất bại. Nếu chỉ đếm khi tài khoản tồn tại thì
            # tốc độ phản hồi khác nhau giữa email có thật và không có thật sẽ tự nó
            # là một kênh liệt kê tài khoản.
            await record_login_failure(email)
            # Không ghi audit: không có tài khoản nào để quy trách nhiệm, và việc ghi lại
            # địa chỉ được thử sẽ tạo ra một danh bạ các phỏng đoán.
            raise UnauthorizedException("Incorrect email or password")
        if user.hashed_password is None:
            raise BadRequestException(
                "This account uses social login. Please sign in with Google or Facebook."
            )
        if not verify_password(password, user.hashed_password):
            self._audit(
                "LOGIN_FAILED",
                user_id=user.id,
                description="Failed password authentication",
            )
            # Commit trước khi raise: get_db() sẽ rollback session trên bất kỳ
            # exception nào, điều này sẽ loại bỏ đúng những bản ghi mà một cuộc
            # điều tra brute-force cần. Bản ghi audit là thay đổi đang chờ duy nhất ở đây
            # (mọi thứ phía trên nó đều là thao tác đọc), nên commit riêng nó là an toàn.
            await self.db.commit()
            await record_login_failure(email)
            raise UnauthorizedException("Incorrect email or password")
        if not user.is_active:
            self._audit(
                "LOGIN_BLOCKED",
                user_id=user.id,
                description="Sign-in attempt on an inactive account",
            )
            await self.db.commit()  # xem nhánh LOGIN_FAILED phía trên
            raise ForbiddenException("Inactive user")

        user.last_login = datetime.now(UTC)
        self._audit("LOGIN_SUCCESS", user_id=user.id, description="Password sign-in")
        await self.db.flush()
        await clear_login_failures(email)
        return user

    async def request_password_reset(self, email: str) -> None:
        """Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái tài khoản."""
        user = await self.users.get_by_email(email)
        if user is None:
            return

        raw_token = secrets.token_urlsafe(32)
        user.password_reset_token_hash = self._hash_reset_token(raw_token)
        user.password_reset_expires_at = datetime.now(UTC) + timedelta(
            hours=PASSWORD_RESET_EXPIRES_HOURS
        )
        await self.db.flush()

        query = urlencode({"token": raw_token})
        reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?{query}"

        try:
            send_password_reset_email_task.delay(user.email, reset_link)
        except Exception:
            # Endpoint cố tình không phụ thuộc vào email. Chi tiết vận hành chỉ nằm
            # trong log server và không được để lộ reset token hoặc địa chỉ người nhận.
            logger.exception("Failed to enqueue password reset email for user_id=%s", user.id)

    async def reset_password(self, data: ResetPasswordRequest) -> None:
        token_hash = self._hash_reset_token(data.token)
        user = await self.users.get_by_password_reset_token_hash_for_update(token_hash)
        if user is None or user.password_reset_expires_at is None:
            raise BadRequestException(INVALID_RESET_TOKEN_MESSAGE)

        expires_at = user.password_reset_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if expires_at <= datetime.now(UTC):
            raise BadRequestException(INVALID_RESET_TOKEN_MESSAGE)

        user.hashed_password = hash_password(data.new_password)
        user.auth_version = (getattr(user, "auth_version", 0) or 0) + 1
        user.password_reset_token_hash = None
        user.password_reset_expires_at = None
        self._audit(
            "PASSWORD_RESET_COMPLETED",
            user_id=user.id,
            description="Password reset via emailed token; all sessions revoked",
        )
        await self.db.flush()
        # Chủ tài khoản vừa chứng minh quyền kiểm soát email của họ; giữ nguyên
        # trạng thái khoá sẽ phạt chính nạn nhân của cuộc tấn công brute-force.
        await clear_login_failures(user.email)

    async def verify_email(self, token: str | None) -> None:
        if not token:
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        token_hash = self._hash_email_verification_token(token)
        user = await self.users.get_by_email_verification_token_hash_for_update(token_hash)
        if user is None or user.email_verification_expires_at is None:
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        expires_at = self._as_utc(user.email_verification_expires_at)
        if expires_at <= datetime.now(UTC):
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        user.email_verified = True
        user.email_verification_token_hash = None
        user.email_verification_expires_at = None
        await self.db.flush()

    async def resend_email_verification(self, user_id: int) -> bool:
        """Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock.

        Trả về False khi tài khoản đã được xác minh. Một lỗi khi đưa vào hàng đợi sẽ raise
        để transaction của request được rollback và token trước đó vẫn dùng được.
        """
        user = await self.users.get_by_id_for_update(user_id)
        if user is None:
            raise UnauthorizedException("Could not validate credentials")
        if user.email_verified:
            return False

        now = datetime.now(UTC)
        if user.email_verification_expires_at is not None:
            expires_at = self._as_utc(user.email_verification_expires_at)
            issued_at = expires_at - timedelta(hours=EMAIL_VERIFICATION_EXPIRES_HOURS)
            elapsed_seconds = (now - issued_at).total_seconds()
            if elapsed_seconds < EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS:
                retry_after = max(
                    1,
                    math.ceil(
                        EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS - elapsed_seconds
                    ),
                )
                raise TooManyRequestsException(
                    "Please wait "
                    f"{retry_after} seconds before requesting another verification email",
                    retry_after=retry_after,
                )

        raw_token = await self._replace_email_verification_token(user, now=now)
        verification_link = self._email_verification_link(raw_token)
        try:
            send_email_verification_task.delay(user.email, verification_link)
        except Exception as exc:
            logger.exception(
                "Failed to enqueue resent email verification for user_id=%s",
                user.id,
            )
            raise ServiceUnavailableException(
                "Unable to send a verification email right now. Please try again."
            ) from exc
        return True

    async def _replace_email_verification_token(
        self,
        user: User,
        *,
        now: datetime | None = None,
    ) -> str:
        raw_token = secrets.token_urlsafe(32)
        user.email_verification_token_hash = self._hash_email_verification_token(raw_token)
        user.email_verification_expires_at = (now or datetime.now(UTC)) + timedelta(
            hours=EMAIL_VERIFICATION_EXPIRES_HOURS
        )
        await self.db.flush()
        return raw_token

    @staticmethod
    def _email_verification_link(raw_token: str) -> str:
        query = urlencode({"token": raw_token})
        return f"{settings.FRONTEND_URL.rstrip('/')}/verify-email?{query}"

    @staticmethod
    def _as_utc(value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value.astimezone(UTC)

    @staticmethod
    def _hash_reset_token(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @staticmethod
    def _hash_email_verification_token(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    def issue_tokens(self, user: User) -> TokenResponse:
        token_data = {"sub": str(user.id), "ver": user.auth_version or 0}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        """Đổi một refresh token lấy một cặp token mới, xoay vòng token cũ ra.

        Mỗi refresh token chỉ dùng một lần: sau khi được đổi, `jti` của nó bị thu hồi,
        nên một bản sao bị đánh cắp trước đó sẽ ngừng hoạt động ngay khi client hợp lệ
        refresh. Thấy một `jti` đã bị thu hồi nghĩa là hai bên đang giữ cùng một token —
        token bị coi là đã bị đánh cắp và mọi session của người dùng đó bị hủy bằng cách
        tăng `auth_version`.
        """
        payload = decode_token(refresh_token)
        if payload is None or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token")

        user_id = payload.get("sub")
        try:
            user = await self.users.get_by_id(int(user_id))
        except (TypeError, ValueError):
            user = None
        if (
            user is None
            or not user.is_active
            or payload.get("ver", 0) != user.auth_version
        ):
            raise UnauthorizedException("Invalid refresh token")

        jti = payload.get("jti")
        if await is_revoked(jti):
            user.auth_version = (user.auth_version or 0) + 1
            self._audit(
                "REFRESH_TOKEN_REUSED",
                user_id=user.id,
                description=(
                    "A already-rotated refresh token was replayed; all sessions revoked"
                ),
            )
            await self.db.commit()  # lưu lại việc thu hồi dù chúng ta có raise
            raise UnauthorizedException("Invalid refresh token")

        await revoke(jti, payload.get("exp"))
        self._audit("TOKEN_REFRESH", user_id=user.id, description="Refresh token rotated")
        return self.issue_tokens(user)

    async def logout(
        self, refresh_token: str | None, access_token: str | None = None
    ) -> None:
        """Đăng xuất phía server theo kiểu best-effort.

        Thu hồi CẢ HAI token. Trước đây chỉ refresh token bị thu hồi, nên một access
        token bị đánh cắp vẫn dùng được tới 30 phút sau khi nạn nhân đã bấm đăng xuất
        — đúng khoảng thời gian mà việc đăng xuất lẽ ra phải chấm dứt. `jti` vốn đã
        có sẵn trên access token cho đúng mục đích này.

        Một token bị thiếu hoặc không parse được không phải là lỗi — dù sao thì
        người gọi cũng đang đăng xuất.
        """
        if access_token:
            access_payload = decode_token(access_token)
            if access_payload and access_payload.get("type") == "access":
                await revoke(access_payload.get("jti"), access_payload.get("exp"))
        if not refresh_token:
            return
        payload = decode_token(refresh_token)
        if payload is None or payload.get("type") != "refresh":
            return
        await revoke(payload.get("jti"), payload.get("exp"))
        user_id = payload.get("sub")
        try:
            self._audit("LOGOUT", user_id=int(user_id), description="Refresh token revoked")
        except (TypeError, ValueError):
            return


async def get_auth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuthService:
    return AuthService(db)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
