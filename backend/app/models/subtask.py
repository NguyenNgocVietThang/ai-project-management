import enum
from typing import Optional

from sqlalchemy import Boolean, Enum, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class SubtaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class Subtask(Base):
    __tablename__ = "subtasks"
    __table_args__ = (
        # Postgres KHÔNG tự tạo index cho khoá ngoại. Nếu không có các dòng
        # dưới đây, mọi truy vấn lọc theo dự án ở wbs_service và
        # scheduling_service đều là seq scan toàn bảng.
        Index("ix_subtasks_task", "task_id"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[SubtaskStatus] = mapped_column(Enum(SubtaskStatus), default=SubtaskStatus.TODO, nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    estimated_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    task: Mapped["Task"] = relationship("Task", back_populates="subtasks")
    assignee: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<Subtask id={self.id} name={self.name} completed={self.is_completed}>"
