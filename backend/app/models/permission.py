from typing import List
from sqlalchemy import String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Permission(Base):
    __tablename__ = "permissions"
    __table_args__ = (
        UniqueConstraint("resource", "action", name="uq_permission_resource_action"),
    )

    resource: Mapped[str] = mapped_column(String(100), nullable=False)  # VD: "project", "task"
    action: Mapped[str] = mapped_column(String(50), nullable=False)     # VD: "create", "read"
    description: Mapped[str] = mapped_column(Text, nullable=True)

    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary="role_permissions", back_populates="permissions"
    )

    def __repr__(self) -> str:
        return f"<Permission {self.resource}:{self.action}>"
