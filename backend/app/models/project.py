import enum
from datetime import date
from typing import List, Optional
from sqlalchemy import Date, Enum, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class ProjectStatus(str, enum.Enum):
    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        Index("ix_projects_pm_status", "pm_id", "status"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ProjectStatus] = mapped_column(Enum(ProjectStatus), default=ProjectStatus.PLANNING, nullable=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-100%

    # Budget & Cost
    budget: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    actual_cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="VND", nullable=False)

    # Foreign Keys
    portfolio_id: Mapped[Optional[int]] = mapped_column(ForeignKey("portfolios.id", ondelete="SET NULL"), nullable=True)
    pm_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # Relationships
    portfolio: Mapped[Optional["Portfolio"]] = relationship("Portfolio", back_populates="projects")
    pm: Mapped["User"] = relationship("User", foreign_keys=[pm_id], back_populates="projects_managed")
    members: Mapped[List["User"]] = relationship("User", secondary="project_members", back_populates="projects_member")
    phases: Mapped[List["Phase"]] = relationship("Phase", back_populates="project", cascade="all, delete-orphan")
    sprints: Mapped[List["Sprint"]] = relationship("Sprint", back_populates="project", cascade="all, delete-orphan")
    epics: Mapped[List["Epic"]] = relationship("Epic", back_populates="project", cascade="all, delete-orphan")
    milestones: Mapped[List["Milestone"]] = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="project")
    change_requests: Mapped[List["ChangeRequest"]] = relationship("ChangeRequest", back_populates="project")
    versions: Mapped[List["ProjectVersion"]] = relationship("ProjectVersion", back_populates="project")

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name} status={self.status}>"
