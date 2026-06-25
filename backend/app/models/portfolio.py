import enum
from typing import List, Optional
from sqlalchemy import Enum, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class PortfolioStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"
    PLANNING = "PLANNING"


class Portfolio(Base):
    __tablename__ = "portfolios"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[PortfolioStatus] = mapped_column(Enum(PortfolioStatus), default=PortfolioStatus.PLANNING)
    budget: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="VND", nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    owner: Mapped["User"] = relationship("User", back_populates="portfolios")
    projects: Mapped[List["Project"]] = relationship("Project", back_populates="portfolio")

    def __repr__(self) -> str:
        return f"<Portfolio id={self.id} name={self.name}>"
