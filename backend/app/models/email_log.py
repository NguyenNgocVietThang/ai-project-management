import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class EmailStatus(str, enum.Enum):
    SENT = "SENT"
    FAILED = "FAILED"
    PENDING = "PENDING"


class EmailLog(Base):
    __tablename__ = "email_logs"
    __table_args__ = (
        Index("ix_email_logs_recipient_sent", "recipient_email", "sent_at"),
    )

    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    template_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[EmailStatus] = mapped_column(Enum(EmailStatus), default=EmailStatus.PENDING, nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<EmailLog id={self.id} to={self.recipient_email} status={self.status}>"
