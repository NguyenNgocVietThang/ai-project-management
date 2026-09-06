from typing import Any

from pydantic import BaseModel


class AIGenerateProjectRequest(BaseModel):
    prompt: str
    ai_provider: str | None = None  # Ghi đè provider mặc định


class AIImpactAnalysisRequest(BaseModel):
    change_request_id: int


class AIScheduleOptimizeRequest(BaseModel):
    project_id: int
    constraints: dict[str, Any] | None = None


class AIRiskAnalysisRequest(BaseModel):
    project_id: int


class AIJobResponse(BaseModel):
    job_id: str
    status: str
    message: str


class AIResultResponse(BaseModel):
    job_id: str
    status: str
    result: dict[str, Any] | None = None
    error: str | None = None
