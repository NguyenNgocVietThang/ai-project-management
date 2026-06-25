import enum
from datetime import date, datetime
from typing import Optional
from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class MilestoneStatus(str, enum.Enum):
    PENDING = "PENDING"
    AT_RISK = "AT_RISK"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"


class Milestone(Base):
    __tablename__ = "milestones"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[MilestoneStatus] = mapped_column(Enum(MilestoneStatus), default=MilestoneStatus.PENDING)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="milestones")

    def __repr__(self) -> str:
        return f"<Milestone id={self.id} name={self.name} status={self.status}>"
