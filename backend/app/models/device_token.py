"""Token thiết bị (FCM) dùng để gửi push tới app di động."""
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class DeviceToken(Base):
    __tablename__ = "device_tokens"
    __table_args__ = (
        CheckConstraint("platform IN ('android', 'ios')", name="ck_device_tokens_platform"),
        CheckConstraint("locale IN ('vi', 'en')", name="ck_device_tokens_locale"),
        Index("ix_device_tokens_user_active", "user_id", "revoked_at"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Token FCM thường dài ~160 ký tự; chừa dư. Duy nhất toàn bảng: một thiết bị chỉ thuộc
    # một người tại một thời điểm (đổi tài khoản trên cùng máy thì token chuyển chủ).
    token: Mapped[str] = mapped_column(String(512), nullable=False, unique=True)
    platform: Mapped[str] = mapped_column(String(16), nullable=False, default="android")
    app_version: Mapped[str | None] = mapped_column(String(32))
    locale: Mapped[str] = mapped_column(String(8), nullable=False, default="vi")
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    # Có giá trị khi người dùng hủy đăng ký hoặc FCM báo token không còn hợp lệ.
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    def __repr__(self) -> str:
        return f"<DeviceToken id={self.id} user={self.user_id} platform={self.platform}>"
