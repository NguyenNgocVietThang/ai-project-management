from typing import Annotated

from fastapi import APIRouter, Depends, Header, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser, require_permissions
from app.models.user import User
from app.schemas.ai import (
    AIGenerateProjectFromBriefRequest,
    AIGenerateProjectRequest,
    AIImpactAnalysisRequest,
    AIJobResponse,
    AIResourceRecommendationRequest,
    AIResultResponse,
    AIRiskAnalysisRequest,
    AIScheduleOptimizeRequest,
)
from app.services.ai_service import AIServiceDep

router = APIRouter()


@router.post(
    "/generate-project", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def generate_project(
    body: AIGenerateProjectRequest,
    service: AIServiceDep,
    current_user: Annotated[User, Depends(require_permissions("project:create"))],
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.

    Trả về ngay một `job_id` — Postgres lưu tác vụ, backend runner xử lý có giới hạn.
    Theo dõi kết quả bằng GET /ai/jobs/{job_id}.
    """
    return await service.request_project_generation(body.prompt, current_user, request_key=idempotency_key)


@router.post(
    "/generate-project-from-brief", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def generate_project_from_brief(
    body: AIGenerateProjectFromBriefRequest,
    service: AIServiceDep,
    current_user: Annotated[User, Depends(require_permissions("project:create"))],
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """C4: Xếp hàng sinh dự án từ hồ sơ `ready`; hồ sơ chuyển `consumed` khi dự án được tạo.

    404 brief_not_found, 409 brief_not_ready / brief_generation_pending, 429 ai_quota_exceeded.
    Theo dõi kết quả bằng GET /ai/jobs/{job_id} (`project_id` có khi hoàn tất).
    """
    return await service.request_project_generation_from_brief(
        body.brief_id, current_user, methodology=body.methodology, request_key=idempotency_key
    )


@router.post(
    "/impact-analysis", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_impact_analysis(
    body: AIImpactAnalysisRequest, service: AIServiceDep, current_user: CurrentVerifiedUser,
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """SOP-AI-002: Xếp hàng phân tích tác động cho một change request đã có."""
    return await service.request_impact_analysis(body.change_request_id, current_user, request_key=idempotency_key)


@router.post(
    "/optimize-schedule", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_schedule_optimization(
    body: AIScheduleOptimizeRequest, service: AIServiceDep, current_user: CurrentVerifiedUser,
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """SOP-AI-003: Xếp hàng đề xuất tối ưu lịch trình (chỉ đề xuất, không tự ghi đè)."""
    return await service.request_schedule_optimization(
        body.project_id, body.constraints, current_user, request_key=idempotency_key
    )


@router.post(
    "/resource-recommendation", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_resource_recommendation(
    body: AIResourceRecommendationRequest, service: AIServiceDep, current_user: CurrentVerifiedUser,
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """SOP-AI-004 / SOP-RM-001: Xếp hàng đề xuất nhân sự phù hợp cho một task."""
    return await service.request_resource_recommendation(body.task_id, current_user, request_key=idempotency_key)


@router.post(
    "/risk-analysis", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_risk_analysis(
    body: AIRiskAnalysisRequest, service: AIServiceDep, current_user: CurrentVerifiedUser,
    idempotency_key: Annotated[str | None, Header(max_length=100)] = None,
):
    """SOP-AI-005: Xếp hàng quét rủi ro thủ công cho một project."""
    return await service.request_risk_analysis(body.project_id, current_user, request_key=idempotency_key)


@router.get("/jobs", response_model=list[AIResultResponse])
async def list_ai_jobs(service: AIServiceDep, current_user: CurrentUser):
    return await service.list_jobs(current_user)


@router.get("/jobs/{job_id}", response_model=AIResultResponse)
async def get_ai_job(job_id: int, service: AIServiceDep, current_user: CurrentUser):
    return await service.get_job(job_id, current_user)
