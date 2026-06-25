import enum
from sqlalchemy import CheckConstraint, Enum, Float, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class DependencyType(str, enum.Enum):
    FS = "FS"  # Finish-to-Start (default — phổ biến nhất)
    SS = "SS"  # Start-to-Start
    FF = "FF"  # Finish-to-Finish
    SF = "SF"  # Start-to-Finish


class Dependency(Base):
    __tablename__ = "dependencies"
    __table_args__ = (
        UniqueConstraint("predecessor_id", "successor_id", name="uq_dependency_pair"),
        CheckConstraint("predecessor_id != successor_id", name="chk_no_self_dependency"),
    )

    predecessor_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True
    )
    successor_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True
    )
    dependency_type: Mapped[DependencyType] = mapped_column(
        Enum(DependencyType), default=DependencyType.FS, nullable=False
    )
    lag_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # Có thể âm (lead time)

    predecessor: Mapped["Task"] = relationship("Task", foreign_keys=[predecessor_id], back_populates="successor_links")
    successor: Mapped["Task"] = relationship("Task", foreign_keys=[successor_id], back_populates="predecessor_links")

    def __repr__(self) -> str:
        return f"<Dependency {self.predecessor_id} -{self.dependency_type}-> {self.successor_id} lag={self.lag_days}>"
