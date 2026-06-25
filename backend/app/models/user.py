from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    # ─── Core fields ─────────────────────────────────────────────────────────
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(Text, nullable=False)

    # ─── Profile ──────────────────────────────────────────────────────────────
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)   # VD: "Senior Dev"
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True) # VD: "Engineering"
    hourly_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)    # Chi phí/giờ

    # ─── Status ───────────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # ─── Relationships ────────────────────────────────────────────────────────
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary="user_roles", back_populates="users", lazy="selectin"
    )
    skills: Mapped[List["Skill"]] = relationship(
        "Skill", secondary="user_skills", back_populates="users", lazy="selectin"
    )
    leaves: Mapped[List["Leave"]] = relationship(
        "Leave", foreign_keys="Leave.user_id", back_populates="user"
    )
    portfolios: Mapped[List["Portfolio"]] = relationship(
        "Portfolio", back_populates="owner"
    )
    projects_managed: Mapped[List["Project"]] = relationship(
        "Project", foreign_keys="Project.pm_id", back_populates="pm"
    )
    projects_member: Mapped[List["Project"]] = relationship(
        "Project", secondary="project_members", back_populates="members"
    )
    assignments: Mapped[List["Assignment"]] = relationship(
        "Assignment", back_populates="user"
    )
    worklogs: Mapped[List["Worklog"]] = relationship(
        "Worklog", back_populates="user"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification", back_populates="user"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"
