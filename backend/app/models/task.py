import enum
from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
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
        Index("ix_tasks_due_date", "due_date"),
        # Được tạo trong migration 20260814 nhưng chưa từng được khai báo ở đây,
        # nên lần `alembic revision --autogenerate` kế tiếp sẽ sinh lệnh DROP nó.
        Index("ix_tasks_labels", "labels", postgresql_using="gin"),
        # Bộ lọc phase/epic trên bảng Kanban, và các đường quét theo ngày mà
        # Celery Beat dùng mỗi sáng.
        Index("ix_tasks_phase", "phase_id"),
        Index("ix_tasks_epic", "epic_id"),
        Index("ix_tasks_start_notify", "start_date", "last_start_notified_at"),
        Index("ix_tasks_due_notify", "due_date", "last_due_soon_notified_at"),
    )

    # ─── Thông tin cơ bản ───────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    story_points: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # JSONB, không phải JSON: cột trong DB là JSONB (migration 20260814), và chỉ
    # comparator của JSONB mới sinh ra toán tử containment `@>`. Với JSON generic,
    # `Task.labels.contains([...])` âm thầm rơi về so khớp chuỗi — nên bộ lọc
    # `?labels=` không hoạt động và GIN index không bao giờ được dùng tới.
    labels: Mapped[list[str]] = mapped_column(
        # with_variant: JSONB la kieu that trong Postgres (va la thu khien
        # `.contains()` sinh ra toan tu `@>`), nhung SQLite khong biet no. Bien the
        # nay cho phep bo test integration chay tren SQLite ma khong doi gi o
        # hanh vi production.
        JSONB().with_variant(JSON(), "sqlite"),
        default=list,
        nullable=False,
    )
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-100%

    # ─── Theo dõi thời gian ─────────────────────────────────────────────────
    estimated_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)   # Ngày dự kiến bắt đầu
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)     # Ngày dự kiến kết thúc
    actual_start: Mapped[date | None] = mapped_column(Date, nullable=True) # Ngày thực tế bắt đầu
    actual_end: Mapped[date | None] = mapped_column(Date, nullable=True)   # Ngày thực tế kết thúc

    # ─── Idempotency cho thông báo theo lịch (đặt bởi lượt quét Celery Beat hằng ngày) ─
    last_start_notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_due_soon_notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # ─── Các trường CPM (tính toán bởi CPM engine) ──────────────────────────
    early_start: Mapped[date | None] = mapped_column(Date, nullable=True)  # ES
    early_finish: Mapped[date | None] = mapped_column(Date, nullable=True) # EF
    late_start: Mapped[date | None] = mapped_column(Date, nullable=True)   # LS
    late_finish: Mapped[date | None] = mapped_column(Date, nullable=True)  # LF
    float_days: Mapped[float | None] = mapped_column(Float, nullable=True) # Slack = LS - ES
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # ─── Khóa ngoại ─────────────────────────────────────────────────────────
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    phase_id: Mapped[int | None] = mapped_column(ForeignKey("phases.id", ondelete="SET NULL"), nullable=True)
    sprint_id: Mapped[int | None] = mapped_column(ForeignKey("sprints.id", ondelete="SET NULL"), nullable=True)
    epic_id: Mapped[int | None] = mapped_column(ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # ─── Quan hệ ──────────────────────────────────────────────────────────────
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
    phase: Mapped[Optional["Phase"]] = relationship("Phase", back_populates="tasks")
    sprint: Mapped[Optional["Sprint"]] = relationship("Sprint", back_populates="tasks")
    epic: Mapped[Optional["Epic"]] = relationship("Epic", back_populates="tasks")
    assignee: Mapped[Optional["User"]] = relationship("User", back_populates=None, foreign_keys=[assignee_id])
    subtasks: Mapped[list["Subtask"]] = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")
    worklogs: Mapped[list["Worklog"]] = relationship("Worklog", back_populates="task", cascade="all, delete-orphan")
    assignments: Mapped[list["Assignment"]] = relationship("Assignment", back_populates="task", cascade="all, delete-orphan")
    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="task", cascade="all, delete-orphan")
    # Predecessors và successors đến qua Dependency
    predecessor_links: Mapped[list["Dependency"]] = relationship(
        "Dependency", foreign_keys="Dependency.successor_id", back_populates="successor"
    )
    successor_links: Mapped[list["Dependency"]] = relationship(
        "Dependency", foreign_keys="Dependency.predecessor_id", back_populates="predecessor"
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} name={self.name} status={self.status}>"
