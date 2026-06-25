from datetime import date, datetime
from typing import Optional
from sqlalchemy import Date, DateTime, Float, ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Worklog(Base):
    __tablename__ = "worklogs"
    __table_args__ = (
        Index("ix_worklogs_task_date", "task_id", "log_date"),
        Index("ix_worklogs_user_date", "user_id", "log_date"),
    )

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hours: Mapped[float] = mapped_column(Float, nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)  # Timestamp thực tế
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    task: Mapped["Task"] = relationship("Task", back_populates="worklogs")
    user: Mapped["User"] = relationship("User", back_populates="worklogs")

    def __repr__(self) -> str:
        return f"<Worklog task={self.task_id} user={self.user_id} hours={self.hours} date={self.log_date}>"
