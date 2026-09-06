import enum
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class PhaseStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ON_HOLD = "ON_HOLD"


class Phase(Base):
    __tablename__ = "phases"
    __table_args__ = (
        # Postgres KHÔNG tự tạo index cho khoá ngoại. Nếu không có các dòng
        # dưới đây, mọi truy vấn lọc theo dự án ở wbs_service và
        # scheduling_service đều là seq scan toàn bảng.
        Index("ix_phases_project_order", "project_id", "order_index"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[PhaseStatus] = mapped_column(Enum(PhaseStatus), default=PhaseStatus.PLANNED)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="phases")
    sprints: Mapped[list["Sprint"]] = relationship("Sprint", back_populates="phase")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="phase")

    def __repr__(self) -> str:
        return f"<Phase id={self.id} name={self.name}>"
