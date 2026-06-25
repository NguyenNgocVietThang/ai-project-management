import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class NotificationType(str, enum.Enum):
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_DUE_SOON = "TASK_DUE_SOON"
    TASK_OVERDUE = "TASK_OVERDUE"
    CR_SUBMITTED = "CR_SUBMITTED"
    CR_APPROVED = "CR_APPROVED"
    CR_REJECTED = "CR_REJECTED"
    CR_NEEDS_REVIEW = "CR_NEEDS_REVIEW"
    CRITICAL_PATH_CHANGED = "CRITICAL_PATH_CHANGED"
    RESOURCE_OVERLOADED = "RESOURCE_OVERLOADED"
    AI_JOB_COMPLETED = "AI_JOB_COMPLETED"
    RISK_HIGH = "RISK_HIGH"
    MENTION = "MENTION"
    SYSTEM = "SYSTEM"


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (
        Index("ix_notifications_user_read", "user_id", "is_read"),
        Index("ix_notifications_user_created", "user_id", "created_at"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[NotificationType] = mapped_column(Enum(NotificationType), nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    link: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Frontend route VD: "/projects/5"

    # Liên kết đến entity gây ra notification
    related_entity_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # VD: "Task", "ChangeRequest"
    related_entity_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="notifications")

    def __repr__(self) -> str:
        return f"<Notification id={self.id} user={self.user_id} type={self.notification_type} read={self.is_read}>"
