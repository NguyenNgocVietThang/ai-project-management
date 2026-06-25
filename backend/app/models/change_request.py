import enum
from datetime import datetime
from typing import List, Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, Text
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


class ChangeRequest(Base):
    __tablename__ = "change_requests"
    __table_args__ = (
        Index("ix_cr_project_status", "project_id", "status"),
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    impact_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[CRStatus] = mapped_column(Enum(CRStatus), default=CRStatus.DRAFT, nullable=False)

    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    applied_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requested_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="change_requests")
    requested_by: Mapped["User"] = relationship("User", foreign_keys=[requested_by_id])
    applied_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[applied_by_id])
    approvals: Mapped[List["Approval"]] = relationship("Approval", back_populates="change_request", cascade="all, delete-orphan")
    impact_report: Mapped[Optional["ImpactReport"]] = relationship("ImpactReport", back_populates="change_request", uselist=False)

    def __repr__(self) -> str:
        return f"<ChangeRequest id={self.id} title={self.title} status={self.status}>"
