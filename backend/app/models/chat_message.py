from sqlalchemy import ForeignKey, Index, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ChatMessage(Base):
    """Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có
    một kênh, mở cho `project_members` của project đó."""

    __tablename__ = "chat_messages"
    __table_args__ = (
        # ChatService.history lọc theo project_id + id < before_id và ORDER BY id
        # DESC. Index trên created_at không phục vụ được thứ tự đó, nên Postgres
        # vẫn phải sort toàn bộ lịch sử của dự án ở mỗi lần cuộn.
        Index("ix_chat_messages_project_id_desc", "project_id", text("id DESC")),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    project: Mapped["Project"] = relationship("Project")
    user: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<ChatMessage id={self.id} project={self.project_id} user={self.user_id}>"
