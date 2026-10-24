"""Đăng ký và thu hồi token thiết bị cho push.

Mọi thao tác chỉ trên token của chính người gọi.
"""
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.device_token import DeviceToken
from app.schemas.device import DeviceRegisterRequest

# Giới hạn số thiết bị hoạt động mỗi người: tránh phình bảng trên Supabase Free và
# tránh nhân số job push lên vô hạn.
MAX_ACTIVE_DEVICES_PER_USER = 10


def _utcnow() -> datetime:
    return datetime.now(UTC)


class DeviceService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, user_id: int, data: DeviceRegisterRequest) -> DeviceToken:
        """Upsert theo token. Token đang thuộc người khác (đổi tài khoản trên cùng máy)
        được chuyển cho người gọi."""
        now = _utcnow()
        device = await self.db.scalar(
            select(DeviceToken).where(DeviceToken.token == data.token).with_for_update()
        )
        if device is None:
            device = DeviceToken(token=data.token, user_id=user_id, last_seen_at=now)
            self.db.add(device)
        device.user_id = user_id
        device.platform = data.platform
        device.app_version = data.app_version
        device.locale = data.locale
        device.last_seen_at = now
        device.revoked_at = None
        await self.db.flush()
        await self._trim(user_id, keep_id=device.id, now=now)
        return device

    async def _trim(self, user_id: int, *, keep_id: int, now: datetime) -> None:
        """Vượt giới hạn thì thu hồi thiết bị ít hoạt động nhất (không bao giờ là thiết bị vừa đăng ký)."""
        active = (
            await self.db.scalars(
                select(DeviceToken)
                .where(DeviceToken.user_id == user_id, DeviceToken.revoked_at.is_(None))
                .order_by(DeviceToken.last_seen_at.desc(), DeviceToken.id.desc())
            )
        ).all()
        for stale in active[MAX_ACTIVE_DEVICES_PER_USER:]:
            if stale.id != keep_id:
                stale.revoked_at = now
        await self.db.flush()

    async def unregister(self, user_id: int, token: str) -> None:
        """Thu hồi token của chính người gọi. Token không tồn tại hoặc của người khác
        được xử lý như nhau (không lộ sự tồn tại)."""
        device = await self.db.scalar(
            select(DeviceToken).where(
                DeviceToken.token == token,
                DeviceToken.user_id == user_id,
                DeviceToken.revoked_at.is_(None),
            )
        )
        if device is not None:
            device.revoked_at = _utcnow()
            await self.db.flush()


async def get_device_service(db: Annotated[AsyncSession, Depends(get_db)]) -> DeviceService:
    return DeviceService(db)


DeviceServiceDep = Annotated[DeviceService, Depends(get_device_service)]
