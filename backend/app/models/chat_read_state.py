from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ChatReadState(Base):
    """Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —
    dùng để tính số tin chưa đọc cho kênh chat của project."""

    __tablename__ = "chat_read_states"
    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_chat_read_state_project_user"),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    last_read_message_id: Mapped[int | None] = mapped_column(
        ForeignKey("chat_messages.id", ondelete="SET NULL"), nullable=True
    )
    last_read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["Project"] = relationship("Project")
    user: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<ChatReadState project={self.project_id} user={self.user_id} last_read={self.last_read_message_id}>"
