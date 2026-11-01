import enum

from sqlalchemy import JSON, CheckConstraint, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ReportSource(str, enum.Enum):
    """Nguồn của báo cáo tác động: AI sinh hoặc PM nhập thủ công (dự phòng khi AI lỗi)."""

    AI = "AI"
    MANUAL = "MANUAL"


class ImpactReport(Base):
    """Báo cáo tác động của một CR. Chỉ mang tính tư vấn, không có giá trị quyết định."""

    __tablename__ = "impact_reports"
    __table_args__ = (
        CheckConstraint("source IN ('AI', 'MANUAL')", name="ck_impact_reports_source"),
        CheckConstraint(
            "suggested_impact_level IS NULL OR suggested_impact_level IN ('MINOR', 'MODERATE', 'MAJOR')",
            name="ck_impact_reports_suggested_level",
        ),
    )

    change_request_id: Mapped[int] = mapped_column(
        ForeignKey("change_requests.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0-10
    schedule_impact_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cost_impact: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    affected_tasks_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    ai_analysis_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Tăng mỗi lần báo cáo bị ghi đè (chạy lại AI hoặc nhập thủ công); người duyệt xác nhận theo revision.
    revision: Mapped[int] = mapped_column(Integer, default=1, server_default="1", nullable=False)
    source: Mapped[str] = mapped_column(
        String(8), default=ReportSource.AI.value, server_default=ReportSource.AI.value, nullable=False
    )
    # Mức tác động AI (hoặc quy tắc dự phòng) gợi ý; chỉ để tham khảo.
    suggested_impact_level: Mapped[str | None] = mapped_column(String(16), nullable=True)
    impact_level_rationale: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Người yêu cầu chạy AI hoặc PM nhập thủ công.
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    change_request: Mapped["ChangeRequest"] = relationship("ChangeRequest", back_populates="impact_report")

    def __repr__(self) -> str:
        return f"<ImpactReport id={self.id} cr={self.change_request_id} risk={self.risk_level}>"
