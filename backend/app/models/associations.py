"""
Association / Junction tables cho các quan hệ Many-to-Many.
Tất cả dùng Table() thay vì class để tránh conflict với Base.id.
"""

from sqlalchemy import Column, ForeignKey, Integer, String, Table, UniqueConstraint

from app.models.base import Base

# ─── User ↔ Role ─────────────────────────────────────────────────────────────
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

# ─── Role ↔ Permission ────────────────────────────────────────────────────────
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "permission_id",
        Integer,
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# ─── User ↔ Skill (với level) ────────────────────────────────────────────────
user_skills = Table(
    "user_skills",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
    Column("level", String(50), nullable=True),  # Beginner / Intermediate / Expert
)

# ─── Project ↔ User (Members) ────────────────────────────────────────────────
project_members = Table(
    "project_members",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_in_project", String(100), nullable=True),  # VD: "Lead Dev", "QA"
)
