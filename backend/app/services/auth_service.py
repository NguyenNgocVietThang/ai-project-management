import hashlib
import logging
import math
import secrets
from datetime import datetime, timedelta, timezone
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
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
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
            # Registration still succeeds. Do not log the recipient or link/token.
            logger.exception(
                "Failed to enqueue email verification for newly registered user_id=%s",
                user.id,
            )
        return user

    async def authenticate(self, email: str, password: str) -> User:
        user = await self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Incorrect email or password")
        if not user.is_active:
            raise ForbiddenException("Inactive user")

        user.last_login = datetime.now(timezone.utc)
        await self.db.flush()
        return user

    async def request_password_reset(self, email: str) -> None:
        """Create a one-time token and enqueue its email without revealing account state."""
        user = await self.users.get_by_email(email)
        if user is None:
            return

        raw_token = secrets.token_urlsafe(32)
        user.password_reset_token_hash = self._hash_reset_token(raw_token)
        user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(
            hours=PASSWORD_RESET_EXPIRES_HOURS
        )
        await self.db.flush()

        query = urlencode({"token": raw_token})
        reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?{query}"

        try:
            send_password_reset_email_task.delay(user.email, reset_link)
        except Exception:
            # The endpoint deliberately remains email-agnostic. Operational details stay
            # in server logs and must not expose the reset token or recipient address.
            logger.exception("Failed to enqueue password reset email for user_id=%s", user.id)

    async def reset_password(self, data: ResetPasswordRequest) -> None:
        token_hash = self._hash_reset_token(data.token)
        user = await self.users.get_by_password_reset_token_hash_for_update(token_hash)
        if user is None or user.password_reset_expires_at is None:
            raise BadRequestException(INVALID_RESET_TOKEN_MESSAGE)

        expires_at = user.password_reset_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at <= datetime.now(timezone.utc):
            raise BadRequestException(INVALID_RESET_TOKEN_MESSAGE)

        user.hashed_password = hash_password(data.new_password)
        user.auth_version = (getattr(user, "auth_version", 0) or 0) + 1
        user.password_reset_token_hash = None
        user.password_reset_expires_at = None
        await self.db.flush()

    async def verify_email(self, token: str | None) -> None:
        if not token:
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        token_hash = self._hash_email_verification_token(token)
        user = await self.users.get_by_email_verification_token_hash_for_update(token_hash)
        if user is None or user.email_verification_expires_at is None:
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        expires_at = self._as_utc(user.email_verification_expires_at)
        if expires_at <= datetime.now(timezone.utc):
            raise BadRequestException(INVALID_EMAIL_VERIFICATION_TOKEN_MESSAGE)

        user.email_verified = True
        user.email_verification_token_hash = None
        user.email_verification_expires_at = None
        await self.db.flush()

    async def resend_email_verification(self, user_id: int) -> bool:
        """Queue a fresh token, enforcing cooldown under a row lock.

        Returns False when the account is already verified. A queueing failure raises
        so the request transaction rolls back and the previous token remains usable.
        """
        user = await self.users.get_by_id_for_update(user_id)
        if user is None:
            raise UnauthorizedException("Could not validate credentials")
        if user.email_verified:
            return False

        now = datetime.now(timezone.utc)
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
        user.email_verification_expires_at = (now or datetime.now(timezone.utc)) + timedelta(
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
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

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

        return self.issue_tokens(user)


async def get_auth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuthService:
    return AuthService(db)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
