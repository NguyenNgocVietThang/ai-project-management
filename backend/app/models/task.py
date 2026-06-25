import enum
from datetime import date
from typing import List, Optional
from sqlalchemy import (
    Boolean, CheckConstraint, Date, Enum, Float, ForeignKey,
    Index, Integer, String, Text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    IN_REVIEW = "IN_REVIEW"
    DONE = "DONE"
    BLOCKED = "BLOCKED"


class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (
        Index("ix_tasks_project_status", "project_id", "status"),
        Index("ix_tasks_sprint_status", "sprint_id", "status"),
        Index("ix_tasks_assignee", "assignee_id"),
    )

    # ─── Basic info ──────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    story_points: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-100%

    # ─── Time tracking ───────────────────────────────────────────────────────
    estimated_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    actual_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)   # Ngày dự kiến bắt đầu
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)     # Ngày dự kiến kết thúc
    actual_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True) # Ngày thực tế bắt đầu
    actual_end: Mapped[Optional[date]] = mapped_column(Date, nullable=True)   # Ngày thực tế kết thúc

    # ─── CPM fields (tính toán bởi CPM engine) ───────────────────────────────
    early_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)  # ES
    early_finish: Mapped[Optional[date]] = mapped_column(Date, nullable=True) # EF
    late_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)   # LS
    late_finish: Mapped[Optional[date]] = mapped_column(Date, nullable=True)  # LF
    float_days: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # Slack = LS - ES
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # ─── Foreign Keys ────────────────────────────────────────────────────────
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    phase_id: Mapped[Optional[int]] = mapped_column(ForeignKey("phases.id", ondelete="SET NULL"), nullable=True)
    sprint_id: Mapped[Optional[int]] = mapped_column(ForeignKey("sprints.id", ondelete="SET NULL"), nullable=True)
    epic_id: Mapped[Optional[int]] = mapped_column(ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    assignee_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # ─── Relationships ────────────────────────────────────────────────────────
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
    phase: Mapped[Optional["Phase"]] = relationship("Phase", back_populates="tasks")
    sprint: Mapped[Optional["Sprint"]] = relationship("Sprint", back_populates="tasks")
    epic: Mapped[Optional["Epic"]] = relationship("Epic", back_populates="tasks")
    assignee: Mapped[Optional["User"]] = relationship("User", back_populates=None, foreign_keys=[assignee_id])
    subtasks: Mapped[List["Subtask"]] = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")
    worklogs: Mapped[List["Worklog"]] = relationship("Worklog", back_populates="task", cascade="all, delete-orphan")
    assignments: Mapped[List["Assignment"]] = relationship("Assignment", back_populates="task", cascade="all, delete-orphan")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="task", cascade="all, delete-orphan")
    # Predecessors và successors đến qua Dependency
    predecessor_links: Mapped[List["Dependency"]] = relationship(
        "Dependency", foreign_keys="Dependency.successor_id", back_populates="successor"
    )
    successor_links: Mapped[List["Dependency"]] = relationship(
        "Dependency", foreign_keys="Dependency.predecessor_id", back_populates="predecessor"
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} name={self.name} status={self.status}>"
