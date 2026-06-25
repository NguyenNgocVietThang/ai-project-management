from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AIGenerateProjectRequest(BaseModel):
    prompt: str
    ai_provider: Optional[str] = None  # Override default provider


class AIImpactAnalysisRequest(BaseModel):
    change_request_id: int


class AIScheduleOptimizeRequest(BaseModel):
    project_id: int
    constraints: Optional[Dict[str, Any]] = None


class AIRiskAnalysisRequest(BaseModel):
    project_id: int


class AIJobResponse(BaseModel):
    job_id: str
    status: str
    message: str


class AIResultResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
