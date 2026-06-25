import enum
from typing import Optional
from sqlalchemy import Enum, Float, ForeignKey, Integer, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ImpactReport(Base):
    __tablename__ = "impact_reports"

    change_request_id: Mapped[int] = mapped_column(
        ForeignKey("change_requests.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-10
    schedule_impact_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cost_impact: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    affected_tasks_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    ai_analysis_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    change_request: Mapped["ChangeRequest"] = relationship("ChangeRequest", back_populates="impact_report")

    def __repr__(self) -> str:
        return f"<ImpactReport id={self.id} cr={self.change_request_id} risk={self.risk_level}>"
