import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REVISIONS_REQUESTED = "REVISIONS_REQUESTED"


class Approval(Base):
    __tablename__ = "approvals"
    __table_args__ = (
        Index("ix_approvals_cr_approver", "change_request_id", "approver_id"),
    )

    change_request_id: Mapped[int] = mapped_column(
        ForeignKey("change_requests.id", ondelete="CASCADE"), nullable=False
    )
    approver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    step_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)  # Thứ tự bước duyệt: 1=BA, 2=PO, 3=PM
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    change_request: Mapped["ChangeRequest"] = relationship("ChangeRequest", back_populates="approvals")
    approver: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<Approval id={self.id} step={self.step_order} status={self.status}>"
