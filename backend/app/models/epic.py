import enum
from typing import List, Optional
from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class EpicStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    CLOSED = "CLOSED"


class Epic(Base):
    __tablename__ = "epics"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[EpicStatus] = mapped_column(Enum(EpicStatus), default=EpicStatus.OPEN)
    story_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # hex color VD: "#FF6B6B"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="epics")
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="epic")

    def __repr__(self) -> str:
        return f"<Epic id={self.id} name={self.name}>"
