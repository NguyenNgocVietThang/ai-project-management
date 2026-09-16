"""Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)."""
from datetime import datetime

from pydantic import BaseModel


class RiskReportResponse(BaseModel):
    id: int
    project_id: int
    risk_score: float
    risk_level: str
    # AI có thể trả list (đúng shape mong muốn) hoặc dict tuỳ model; giữ union
    # ở đây để khớp với những gì risk_analyzer.py thực sự lưu vào JSON column.
    risk_factors_json: dict | list | None
    mitigation_suggestions_json: dict | list | None
    summary: str | None
    created_at: datetime
    model_config = {"from_attributes": True}
