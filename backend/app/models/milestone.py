import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class MilestoneStatus(str, enum.Enum):
    PENDING = "PENDING"
    AT_RISK = "AT_RISK"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"


class Milestone(Base):
    __tablename__ = "milestones"
    __table_args__ = (
        # Postgres KHÔNG tự tạo index cho khoá ngoại. Nếu không có các dòng
        # dưới đây, mọi truy vấn lọc theo dự án ở wbs_service và
        # scheduling_service đều là seq scan toàn bảng.
        Index("ix_milestones_project_due", "project_id", "due_date"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[MilestoneStatus] = mapped_column(Enum(MilestoneStatus), default=MilestoneStatus.PENDING)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="milestones")

    def __repr__(self) -> str:
        return f"<Milestone id={self.id} name={self.name} status={self.status}>"
