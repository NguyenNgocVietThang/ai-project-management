
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Role(Base):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    users: Mapped[list["User"]] = relationship(
        "User", secondary="user_roles", back_populates="roles"
    )
    permissions: Mapped[list["Permission"]] = relationship(
        "Permission", secondary="role_permissions", back_populates="roles", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Role id={self.id} name={self.name}>"
