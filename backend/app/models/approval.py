import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REVISIONS_REQUESTED = "REVISIONS_REQUESTED"
    # Bước bị hủy vì một bước trước đó đã từ chối CR.
    CANCELLED = "CANCELLED"


# Vai trò dự án chịu trách nhiệm từng bước duyệt, theo thứ tự step_order.
APPROVAL_STEP_ROLES: tuple[str, ...] = ("BA", "PO", "PM")


class Approval(Base):
    __tablename__ = "approvals"
    __table_args__ = (
        Index("ix_approvals_cr_approver", "change_request_id", "approver_id"),
        # Mỗi CR chỉ có một bước cho mỗi thứ tự: chặn tạo chuỗi duyệt trùng.
        UniqueConstraint("change_request_id", "step_order", name="uq_approvals_cr_step"),
    )

    change_request_id: Mapped[int] = mapped_column(
        ForeignKey("change_requests.id", ondelete="CASCADE"), nullable=False
    )
    # Người đã quyết định bước này; null khi bước chưa được quyết định.
    approver_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    step_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)  # Thứ tự bước duyệt: 1=BA, 2=PO, 3=PM
    # Vai trò dự án được quyền quyết định bước này (BA, PO hoặc PM).
    required_role: Mapped[str] = mapped_column(String(16), nullable=False)
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    change_request: Mapped["ChangeRequest"] = relationship("ChangeRequest", back_populates="approvals")
    approver: Mapped["User | None"] = relationship("User")

    def __repr__(self) -> str:
        return f"<Approval id={self.id} step={self.step_order} status={self.status}>"
