import enum

from sqlalchemy import Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class EpicStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    CLOSED = "CLOSED"


class Epic(Base):
    __tablename__ = "epics"
    __table_args__ = (
        # Postgres KHÔNG tự tạo index cho khoá ngoại. Nếu không có các dòng
        # dưới đây, mọi truy vấn lọc theo dự án ở wbs_service và
        # scheduling_service đều là seq scan toàn bảng.
        Index("ix_epics_project", "project_id"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[EpicStatus] = mapped_column(Enum(EpicStatus), default=EpicStatus.OPEN)
    story_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)  # mã màu hex VD: "#FF6B6B"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="epics")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="epic")

    def __repr__(self) -> str:
        return f"<Epic id={self.id} name={self.name}>"
