import asyncio
import logging
import secrets
from io import BytesIO
from typing import Annotated
from uuid import uuid4

from fastapi import Depends, UploadFile
from minio.error import S3Error
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
)
from app.core.security import hash_password, verify_password
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.project import UserSearchResult
from app.schemas.user import ChangePasswordRequest, DeleteAccountRequest, UserUpdate
from app.services.storage_service import StorageService, StorageServiceDep

logger = logging.getLogger(__name__)

MAX_AVATAR_BYTES = 5 * 1024 * 1024
AVATAR_SIZE = (512, 512)
ALLOWED_AVATAR_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_AVATAR_FORMATS = {"JPEG", "PNG", "WEBP"}


class UserService:
    def __init__(self, db: AsyncSession, storage: StorageService):
        self.db = db
        self.users = UserRepository(db)
        self.storage = storage

    def _audit(
        self,
        user_id: int,
        action: str,
        *,
        old_values: dict | None = None,
        new_values: dict | None = None,
        description: str | None = None,
    ) -> None:
        self.db.add(
            AuditLog(
                user_id=user_id,
                action=action,
                entity_type="User",
                entity_id=user_id,
                old_values=old_values,
                new_values=new_values,
                description=description,
            )
        )

    async def update_profile(self, current_user: User, data: UserUpdate) -> User:
        changes = data.model_dump(exclude_unset=True)
        if not changes:
            return current_user

        username = changes.get("username")
        if username and username != current_user.username:
            existing = await self.users.get_by_username(username)
            if existing and existing.id != current_user.id:
                raise ConflictException("Username already taken")

        old_values = {field: getattr(current_user, field) for field in changes}
        for field, value in changes.items():
            setattr(current_user, field, value)
        await self.db.flush()
        await self.db.refresh(current_user)
        self._audit(
            current_user.id,
            "UPDATE_PROFILE",
            old_values=old_values,
            new_values=changes,
        )
        return current_user

    async def search_active_users(
        self, query: str, limit: int = 20
    ) -> list[UserSearchResult]:
        users = await self.users.search_active(query, limit)
        return [
            UserSearchResult(
                id=user.id,
                full_name=user.full_name,
                username=user.username,
                email_hint=_mask_email(user.email),
                avatar_url=user.avatar_url,
            )
            for user in users
        ]

    async def change_password(self, current_user: User, data: ChangePasswordRequest) -> None:
        user = await self.users.get_by_id_for_update(current_user.id)
        if user is None or not user.is_active:
            raise UnauthorizedException("Could not validate credentials")

        if user.hashed_password:
            if not data.current_password or not verify_password(
                data.current_password,
                user.hashed_password,
            ):
                raise BadRequestException("Current password is incorrect")
            if verify_password(data.new_password, user.hashed_password):
                raise BadRequestException("New password must be different from current password")

        user.hashed_password = hash_password(data.new_password)
        user.auth_version += 1
        user.password_reset_token_hash = None
        user.password_reset_expires_at = None
        await self.db.flush()
        self._audit(
            user.id,
            "CHANGE_PASSWORD",
            description="Local password changed and all existing sessions revoked",
        )

    @staticmethod
    def _normalize_avatar(raw: bytes) -> bytes:
        try:
            with Image.open(BytesIO(raw)) as image:
                if image.format not in ALLOWED_AVATAR_FORMATS:
                    raise BadRequestException("Avatar must be a JPEG, PNG, or WebP image")
                if image.width * image.height > 25_000_000:
                    raise BadRequestException("Avatar image dimensions are too large")
                image.load()
                normalized = ImageOps.exif_transpose(image)
                normalized = ImageOps.fit(
                    normalized.convert("RGB"),
                    AVATAR_SIZE,
                    method=Image.Resampling.LANCZOS,
                )
                output = BytesIO()
                normalized.save(output, format="WEBP", quality=85, method=6)
                return output.getvalue()
        except BadRequestException:
            raise
        except (Image.DecompressionBombError, UnidentifiedImageError, OSError, ValueError) as exc:
            raise BadRequestException("Avatar file is not a valid image") from exc

    async def upload_avatar(self, current_user: User, file: UploadFile) -> User:
        if file.content_type not in ALLOWED_AVATAR_CONTENT_TYPES:
            raise BadRequestException("Avatar must be a JPEG, PNG, or WebP image")

        raw = await file.read(MAX_AVATAR_BYTES + 1)
        if len(raw) > MAX_AVATAR_BYTES:
            raise BadRequestException("Avatar must not exceed 5 MiB")
        if not raw:
            raise BadRequestException("Avatar file is empty")

        normalized = await asyncio.to_thread(self._normalize_avatar, raw)
        version = uuid4().hex
        storage_key = f"avatars/{current_user.id}/{version}.webp"

        try:
            await self.storage.put_bytes(storage_key, normalized, "image/webp")
        except Exception as exc:
            logger.exception("Failed to upload avatar for user_id=%s", current_user.id)
            raise ServiceUnavailableException("Avatar storage is temporarily unavailable") from exc

        old_storage_key = current_user.avatar_storage_key
        old_avatar_url = current_user.avatar_url
        current_user.avatar_storage_key = storage_key
        current_user.avatar_url = (
            f"{settings.API_V1_PREFIX}/users/{current_user.id}/avatar?v={version[:12]}"
        )
        await self.db.flush()
        await self.db.refresh(current_user)

        if old_storage_key and old_storage_key != storage_key:
            try:
                await self.storage.delete(old_storage_key)
            except Exception:
                logger.exception(
                    "Failed to remove replaced avatar object for user_id=%s",
                    current_user.id,
                )

        self._audit(
            current_user.id,
            "UPDATE_AVATAR",
            old_values={"avatar_url": old_avatar_url},
            new_values={"avatar_url": current_user.avatar_url},
        )
        return current_user

    async def get_avatar(self, user_id: int) -> tuple[bytes, str, str]:
        user = await self.users.get_by_id(user_id)
        if user is None or not user.is_active or not user.avatar_storage_key:
            raise NotFoundException("Avatar not found")

        try:
            data, content_type = await self.storage.get_bytes(user.avatar_storage_key)
        except S3Error as exc:
            if exc.code in {"NoSuchKey", "NoSuchObject", "NoSuchBucket"}:
                raise NotFoundException("Avatar not found") from exc
            raise ServiceUnavailableException("Avatar storage is temporarily unavailable") from exc
        except Exception as exc:
            raise ServiceUnavailableException("Avatar storage is temporarily unavailable") from exc
        return data, content_type, user.avatar_storage_key

    async def disconnect_social_account(self, current_user: User, provider: str) -> User:
        user = await self.users.get_by_id_for_update(current_user.id)
        if user is None or not user.is_active:
            raise UnauthorizedException("Could not validate credentials")

        if provider == "google":
            if not user.google_id:
                raise BadRequestException("Google account is not connected")
            if not user.hashed_password and not user.facebook_id:
                raise BadRequestException("Cannot disconnect the last sign-in method")
            user.google_id = None
        elif provider == "facebook":
            if not user.facebook_id:
                raise BadRequestException("Facebook account is not connected")
            if not user.hashed_password and not user.google_id:
                raise BadRequestException("Cannot disconnect the last sign-in method")
            user.facebook_id = None
        else:
            raise BadRequestException("Unsupported OAuth provider")

        if user.auth_provider == provider:
            user.auth_provider = (
                "local"
                if user.hashed_password
                else "google"
                if user.google_id
                else "facebook"
            )
        await self.db.flush()
        await self.db.refresh(user)
        self._audit(
            user.id,
            "DISCONNECT_OAUTH",
            new_values={"provider": provider},
        )
        return user

    async def deactivate_account(
        self,
        current_user: User,
        data: DeleteAccountRequest,
    ) -> None:
        user = await self.users.get_by_id_for_update(current_user.id)
        if user is None or not user.is_active:
            raise UnauthorizedException("Could not validate credentials")
        if not secrets.compare_digest(data.username, user.username):
            raise BadRequestException("Username confirmation does not match")

        if user.avatar_storage_key:
            try:
                await self.storage.delete(user.avatar_storage_key)
            except Exception as exc:
                logger.exception("Failed to remove avatar for user_id=%s", user.id)
                raise ServiceUnavailableException(
                    "Unable to remove account data right now. Please try again."
                ) from exc

        self._audit(
            user.id,
            "DEACTIVATE_ACCOUNT",
            description="User requested account deactivation and profile anonymization",
        )
        suffix = secrets.token_hex(8)
        user.email = f"deleted_{user.id}_{suffix}@deleted.invalid"
        user.username = f"deleted_{user.id}_{suffix}"
        user.full_name = "Deleted User"
        user.phone = None
        user.position = None
        user.department = None
        user.hourly_rate = None
        user.avatar_url = None
        user.avatar_storage_key = None
        user.hashed_password = None
        user.google_id = None
        user.facebook_id = None
        user.auth_provider = "deleted"
        user.password_reset_token_hash = None
        user.password_reset_expires_at = None
        user.email_verification_token_hash = None
        user.email_verification_expires_at = None
        user.email_verified = False
        user.last_login = None
        user.auth_version += 1
        user.is_superuser = False
        user.is_active = False
        await self.db.flush()


async def get_user_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    storage: StorageServiceDep,
) -> UserService:
    return UserService(db, storage)


UserServiceDep = Annotated[UserService, Depends(get_user_service)]


def _mask_email(email: str) -> str:
    """"nguyen.van.a@company.com" -> "ng***@company.com".

    Giữ đủ để chủ tài khoản nhận ra chính mình và để phân biệt hai người trùng tên,
    nhưng không đủ để gửi thư tới.
    """
    local, _, domain = (email or "").partition("@")
    if not domain:
        return "***"
    visible = local[:2] if len(local) > 2 else local[:1]
    return f"{visible}***@{domain}"
