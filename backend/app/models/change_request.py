import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class CRStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    IMPLEMENTED = "IMPLEMENTED"
    CANCELLED = "CANCELLED"


class ImpactLevel(str, enum.Enum):
    """Mức tác động của CR. Người tạo đề xuất, AI chỉ gợi ý, PM là người chốt."""

    MINOR = "MINOR"
    MODERATE = "MODERATE"
    MAJOR = "MAJOR"


# Thứ bậc để so sánh nâng/hạ mức.
IMPACT_LEVEL_RANK: dict[str, int] = {"MINOR": 0, "MODERATE": 1, "MAJOR": 2}
IMPACT_LEVEL_CHECK = "IN ('MINOR', 'MODERATE', 'MAJOR')"


class ChangeRequest(Base):
    __tablename__ = "change_requests"
    __table_args__ = (
        Index("ix_cr_project_status", "project_id", "status"),
        CheckConstraint(f"impact_level {IMPACT_LEVEL_CHECK}", name="ck_change_requests_impact_level"),
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    impact_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[CRStatus] = mapped_column(Enum(CRStatus), default=CRStatus.DRAFT, nullable=False)
    # Mức tác động hiện hành (giá trị của ImpactLevel). Hệ thống không bao giờ tự đổi theo gợi ý AI.
    impact_level: Mapped[str] = mapped_column(
        String(16), default=ImpactLevel.MODERATE.value, server_default=ImpactLevel.MODERATE.value, nullable=False
    )
    # PM đã chốt mức khi confirmed_at khác null; confirmed_by null nghĩa là hệ thống chốt (dữ liệu cũ).
    impact_level_confirmed_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    impact_level_confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Lý do của lần đổi mức gần nhất; lịch sử đầy đủ nằm trong audit log.
    impact_level_change_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    applied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    applied_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requested_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="change_requests")
    requested_by: Mapped["User"] = relationship("User", foreign_keys=[requested_by_id])
    impact_level_confirmed_by: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[impact_level_confirmed_by_id]
    )
    applied_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[applied_by_id])
    approvals: Mapped[list["Approval"]] = relationship("Approval", back_populates="change_request", cascade="all, delete-orphan")
    impact_report: Mapped[Optional["ImpactReport"]] = relationship("ImpactReport", back_populates="change_request", uselist=False)

    def __repr__(self) -> str:
        return f"<ChangeRequest id={self.id} title={self.title} status={self.status}>"
