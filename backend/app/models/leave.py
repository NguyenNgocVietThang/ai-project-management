import enum
from datetime import date, datetime
from typing import Optional
from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class LeaveStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class LeaveType(str, enum.Enum):
    ANNUAL = "ANNUAL"
    SICK = "SICK"
    UNPAID = "UNPAID"
    MATERNITY = "MATERNITY"
    OTHER = "OTHER"


class Leave(Base):
    __tablename__ = "leaves"
    __table_args__ = (
        Index("ix_leaves_user_dates", "user_id", "start_date", "end_date"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    leave_type: Mapped[LeaveType] = mapped_column(Enum(LeaveType), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[LeaveStatus] = mapped_column(Enum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)
    approved_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id], back_populates="leaves")
    approved_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[approved_by_id])

    def __repr__(self) -> str:
        return f"<Leave id={self.id} user_id={self.user_id} {self.start_date}~{self.end_date}>"
