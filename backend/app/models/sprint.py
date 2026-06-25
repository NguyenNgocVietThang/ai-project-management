import enum
from datetime import date
from typing import List, Optional
from sqlalchemy import Date, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class SprintStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Sprint(Base):
    __tablename__ = "sprints"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    goal: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[SprintStatus] = mapped_column(Enum(SprintStatus), default=SprintStatus.PLANNED)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Velocity metrics
    story_points_committed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    story_points_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    velocity: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    phase_id: Mapped[Optional[int]] = mapped_column(ForeignKey("phases.id", ondelete="SET NULL"), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    phase: Mapped[Optional["Phase"]] = relationship("Phase", back_populates="sprints")
    project: Mapped["Project"] = relationship("Project", back_populates="sprints")
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="sprint")

    def __repr__(self) -> str:
        return f"<Sprint id={self.id} name={self.name} status={self.status}>"
