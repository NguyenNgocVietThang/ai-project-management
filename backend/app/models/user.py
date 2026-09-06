from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.assignment import Assignment
    from app.models.leave import Leave
    from app.models.notification import Notification
    from app.models.portfolio import Portfolio
    from app.models.project import Project
    from app.models.role import Role
    from app.models.skill import Skill
    from app.models.worklog import Worklog


class User(Base):
    __tablename__ = "users"

    # ─── Các trường cốt lõi ─────────────────────────────────────────────────
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ─── Đăng nhập mạng xã hội / Auth Provider ──────────────────────────────
    google_id: Mapped[str | None] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )
    facebook_id: Mapped[str | None] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )
    auth_provider: Mapped[str] = mapped_column(String(50), default="local", nullable=False)
    auth_version: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Khôi phục mật khẩu ─────────────────────────────────────────────────
    password_reset_token_hash: Mapped[str | None] = mapped_column(
        String(64), unique=True, index=True, nullable=True
    )
    password_reset_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Xác minh email
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_verification_token_hash: Mapped[str | None] = mapped_column(
        String(64), unique=True, index=True, nullable=True
    )
    email_verification_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ─── Hồ sơ ────────────────────────────────────────────────────────────────
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_storage_key: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    position: Mapped[str | None] = mapped_column(String(100), nullable=True)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    hourly_rate: Mapped[float | None] = mapped_column(Float, nullable=True)

    # ─── Trạng thái ───────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # ─── Quan hệ ──────────────────────────────────────────────────────────────
    roles: Mapped[list["Role"]] = relationship(
        "Role", secondary="user_roles", back_populates="users", lazy="selectin"
    )
    skills: Mapped[list["Skill"]] = relationship(
        "Skill", secondary="user_skills", back_populates="users", lazy="selectin"
    )
    leaves: Mapped[list["Leave"]] = relationship(
        "Leave", foreign_keys="Leave.user_id", back_populates="user"
    )
    portfolios: Mapped[list["Portfolio"]] = relationship(
        "Portfolio", back_populates="owner"
    )
    projects_managed: Mapped[list["Project"]] = relationship(
        "Project", foreign_keys="Project.pm_id", back_populates="pm"
    )
    projects_member: Mapped[list["Project"]] = relationship(
        "Project", secondary="project_members", back_populates="members"
    )
    assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment", back_populates="user"
    )
    worklogs: Mapped[list["Worklog"]] = relationship(
        "Worklog", back_populates="user"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification", back_populates="user"
    )

    @property
    def has_password(self) -> bool:
        return bool(self.hashed_password)

    @property
    def google_connected(self) -> bool:
        return bool(self.google_id)

    @property
    def facebook_connected(self) -> bool:
        return bool(self.facebook_id)

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"
