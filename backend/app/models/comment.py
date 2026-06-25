from sqlalchemy import ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = (
        Index("ix_comments_task_created", "task_id", "created_at"),
    )

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    task: Mapped["Task"] = relationship("Task", back_populates="comments")
    user: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<Comment id={self.id} task={self.task_id} user={self.user_id}>"
