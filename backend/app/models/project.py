import enum
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.change_request import ChangeRequest
    from app.models.document import Document
    from app.models.epic import Epic
    from app.models.milestone import Milestone
    from app.models.phase import Phase
    from app.models.portfolio import Portfolio
    from app.models.project_version import ProjectVersion
    from app.models.sprint import Sprint
    from app.models.task import Task
    from app.models.user import User


class ProjectStatus(str, enum.Enum):
    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class ProjectMethodology(str, enum.Enum):
    AGILE = "agile"
    WATERFALL = "waterfall"
    HYBRID = "hybrid"


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        Index("ix_projects_pm_status", "pm_id", "status"),
        Index("ix_projects_pm_deleted", "pm_id", "deleted_at"),
        Index("ix_projects_portfolio_deleted", "portfolio_id", "deleted_at"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus), default=ProjectStatus.PLANNING, nullable=False
    )
    methodology: Mapped[ProjectMethodology] = mapped_column(
        Enum(
            ProjectMethodology,
            values_callable=lambda enum_class: [item.value for item in enum_class],
        ),
        default=ProjectMethodology.AGILE,
        nullable=False,
    )
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="VND", nullable=False)

    portfolio_id: Mapped[int | None] = mapped_column(
        ForeignKey("portfolios.id", ondelete="SET NULL"), nullable=True
    )
    pm_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    portfolio: Mapped[Optional["Portfolio"]] = relationship("Portfolio", back_populates="projects")
    pm: Mapped["User"] = relationship(
        "User", foreign_keys=[pm_id], back_populates="projects_managed"
    )
    members: Mapped[list["User"]] = relationship(
        "User", secondary="project_members", back_populates="projects_member"
    )
    phases: Mapped[list["Phase"]] = relationship(
        "Phase", back_populates="project", cascade="all, delete-orphan"
    )
    sprints: Mapped[list["Sprint"]] = relationship(
        "Sprint", back_populates="project", cascade="all, delete-orphan"
    )
    epics: Mapped[list["Epic"]] = relationship(
        "Epic", back_populates="project", cascade="all, delete-orphan"
    )
    milestones: Mapped[list["Milestone"]] = relationship(
        "Milestone", back_populates="project", cascade="all, delete-orphan"
    )
    tasks: Mapped[list["Task"]] = relationship(
        "Task", back_populates="project", cascade="all, delete-orphan"
    )
    documents: Mapped[list["Document"]] = relationship("Document", back_populates="project")
    change_requests: Mapped[list["ChangeRequest"]] = relationship(
        "ChangeRequest", back_populates="project"
    )
    versions: Mapped[list["ProjectVersion"]] = relationship(
        "ProjectVersion", back_populates="project"
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name} status={self.status}>"
