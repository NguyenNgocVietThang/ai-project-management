from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.models.change_request import ImpactLevel
from app.models.impact_report import RiskLevel


class ImpactReportResponse(BaseModel):
    id: int
    change_request_id: int
    risk_level: str
    risk_score: float
    schedule_impact_days: int
    cost_impact: float
    affected_tasks_json: list[int] | None
    summary: str | None
    # Revision tăng mỗi lần báo cáo bị ghi đè; người duyệt CR MAJOR xác nhận theo revision này.
    revision: int = 1
    # AI: do AI sinh; MANUAL: PM nhập thủ công khi AI lỗi/hết quota.
    source: str = "AI"
    # Mức AI gợi ý (chỉ tham khảo, hệ thống không tự áp dụng).
    suggested_impact_level: str | None = None
    impact_level_rationale: str | None = None
    created_by_id: int | None = None
    # Báo cáo luôn mang tính khuyến nghị, không có giá trị quyết định.
    advisory: Literal[True] = True
    created_at: datetime
    model_config = {"from_attributes": True}


class ManualImpactReportRequest(BaseModel):
    """PM nhập đánh giá tác động thủ công (dự phòng khi AI lỗi hoặc hết quota)."""

    risk_level: RiskLevel
    schedule_impact_days: int = Field(ge=-3650, le=3650)
    cost_impact: float = Field(ge=-1e13, le=1e13)
    summary: str = Field(min_length=1, max_length=5000)
    suggested_impact_level: ImpactLevel | None = None

    @field_validator("summary")
    @classmethod
    def strip_summary(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("summary must not be blank")
        return value
