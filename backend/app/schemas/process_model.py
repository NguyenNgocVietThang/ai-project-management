"""Schema API quy trình nghiệp vụ do AI sinh (B2)."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict


class ProcessModelGenerateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    language: Literal["vi", "en"] = "vi"


class ProcessModelGenerateResponse(BaseModel):
    """202: `status=queued`, có `job_id` (poll qua GET /jobs/{job_id}).
    200: `status=needs_clarification`, có `missing_items`/`skipped_items`."""

    status: Literal["queued", "needs_clarification"]
    job_id: int | None = None
    ai_request_id: int | None = None
    missing_items: list[str] = []
    skipped_items: list[str] = []
    brief_reopened: bool = False


class ProcessStepRow(BaseModel):
    order: int
    node_id: str
    lane: str
    step: str
    type: str
    type_label: str
    next: str


class ProcessModelResponse(BaseModel):
    id: int
    project_id: int
    brief_id: int | None
    version: int
    language: str
    # Cấu trúc ProcessModel: {name, lanes, nodes, flows}.
    model: dict[str, Any]
    warnings: list[str]
    steps: list[ProcessStepRow]
    created_by_id: int | None
    created_at: datetime | None
