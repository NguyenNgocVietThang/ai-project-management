import enum
from datetime import date
from typing import Optional

from sqlalchemy import Date, Enum, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class SprintStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Sprint(Base):
    __tablename__ = "sprints"
    __table_args__ = (
        # Postgres KHÔNG tự tạo index cho khoá ngoại. Nếu không có các dòng
        # dưới đây, mọi truy vấn lọc theo dự án ở wbs_service và
        # scheduling_service đều là seq scan toàn bảng.
        Index("ix_sprints_project", "project_id"),
        Index("ix_sprints_phase", "phase_id"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[SprintStatus] = mapped_column(Enum(SprintStatus), default=SprintStatus.PLANNED)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Các chỉ số velocity
    story_points_committed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    story_points_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    velocity: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    phase_id: Mapped[int | None] = mapped_column(ForeignKey("phases.id", ondelete="SET NULL"), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    phase: Mapped[Optional["Phase"]] = relationship("Phase", back_populates="sprints")
    project: Mapped["Project"] = relationship("Project", back_populates="sprints")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="sprint")

    def __repr__(self) -> str:
        return f"<Sprint id={self.id} name={self.name} status={self.status}>"
