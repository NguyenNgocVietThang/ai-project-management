from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.project import ProjectMethodology


class AIGenerateProjectRequest(BaseModel):
    prompt: str


class AIGenerateProjectFromBriefRequest(BaseModel):
    """The confirmed methodology is separate from the seven requirement items."""

    model_config = ConfigDict(extra="forbid")

    brief_id: int = Field(gt=0)
    methodology: ProjectMethodology | None = None


class AIProjectPlanMethodology(BaseModel):
    """Legacy plans may omit the choice; supplied values must be canonical."""

    methodology: ProjectMethodology = ProjectMethodology.AGILE


def validated_project_methodology(
    plan: dict, confirmed: ProjectMethodology | None = None,
) -> ProjectMethodology:
    # Validate the model response before applying the authoritative user choice.
    supplied = AIProjectPlanMethodology.model_validate(plan).methodology
    return ProjectMethodology(confirmed) if confirmed is not None else supplied


class AIImpactAnalysisRequest(BaseModel):
    change_request_id: int


class AIScheduleOptimizeRequest(BaseModel):
    project_id: int
    constraints: dict[str, Any] | None = None


class AIRiskAnalysisRequest(BaseModel):
    project_id: int


class AIResourceRecommendationRequest(BaseModel):
    task_id: int


class AIJobResponse(BaseModel):
    job_id: str
    status: str
    message: str


class AIResultResponse(BaseModel):
    job_id: str
    status: str
    result: dict[str, Any] | None = None
    error: str | None = None
    project_id: int | None = None
