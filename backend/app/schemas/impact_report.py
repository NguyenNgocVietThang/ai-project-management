from datetime import datetime

from pydantic import BaseModel


class ImpactReportResponse(BaseModel):
    id: int
    change_request_id: int
    risk_level: str
    risk_score: float
    schedule_impact_days: int
    cost_impact: float
    affected_tasks_json: list[int] | None
    summary: str | None
    created_at: datetime
    model_config = {"from_attributes": True}
