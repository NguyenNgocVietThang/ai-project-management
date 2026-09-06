
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Skill(Base):
    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)  # VD: "Backend", "Design"

    users: Mapped[list["User"]] = relationship(
        "User", secondary="user_skills", back_populates="skills"
    )

    def __repr__(self) -> str:
        return f"<Skill id={self.id} name={self.name}>"
