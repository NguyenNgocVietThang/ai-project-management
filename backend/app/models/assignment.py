from datetime import date
from typing import Optional
from sqlalchemy import Date, Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Assignment(Base):
    __tablename__ = "assignments"
    __table_args__ = (
        UniqueConstraint("task_id", "user_id", name="uq_assignment_task_user"),
    )

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # VD: "Lead Developer"
    allocated_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    allocation_percentage: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)  # % thời gian
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    task: Mapped["Task"] = relationship("Task", back_populates="assignments")
    user: Mapped["User"] = relationship("User", back_populates="assignments")

    def __repr__(self) -> str:
        return f"<Assignment task={self.task_id} user={self.user_id} {self.allocation_percentage}%>"
