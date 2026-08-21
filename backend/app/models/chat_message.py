from sqlalchemy import ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class ChatMessage(Base):
    """A single message in a project-scoped team chat channel. One channel
    per Project, open to that project's `project_members`."""

    __tablename__ = "chat_messages"
    __table_args__ = (
        Index("ix_chat_messages_project_created", "project_id", "created_at"),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    project: Mapped["Project"] = relationship("Project")
    user: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<ChatMessage id={self.id} project={self.project_id} user={self.user_id}>"
