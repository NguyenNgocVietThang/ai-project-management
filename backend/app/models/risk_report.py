import enum
from typing import Optional
from sqlalchemy import Enum, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class RiskReport(Base):
    __tablename__ = "risk_reports"

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-10
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), nullable=False)
    risk_factors_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    mitigation_suggestions_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    project: Mapped["Project"] = relationship("Project")

    def __repr__(self) -> str:
        return f"<RiskReport id={self.id} project={self.project_id} risk={self.risk_level}>"
