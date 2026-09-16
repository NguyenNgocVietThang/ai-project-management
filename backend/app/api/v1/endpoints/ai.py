from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser, require_permissions
from app.models.user import User
from app.schemas.ai import (
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
):
    """SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.

    Trả về ngay một `job_id` — việc gọi AI và ghi dữ liệu chạy nền trong Celery.
    Theo dõi kết quả bằng GET /ai/jobs/{job_id}.
    """
    return await service.request_project_generation(body.prompt, current_user)


@router.post(
    "/impact-analysis", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_impact_analysis(
    body: AIImpactAnalysisRequest, service: AIServiceDep, current_user: CurrentVerifiedUser
):
    """SOP-AI-002: Xếp hàng phân tích tác động cho một change request đã có."""
    return await service.request_impact_analysis(body.change_request_id, current_user)


@router.post(
    "/optimize-schedule", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_schedule_optimization(
    body: AIScheduleOptimizeRequest, service: AIServiceDep, current_user: CurrentVerifiedUser
):
    """SOP-AI-003: Xếp hàng đề xuất tối ưu lịch trình (chỉ đề xuất, không tự ghi đè)."""
    return await service.request_schedule_optimization(
        body.project_id, body.constraints, current_user
    )


@router.post(
    "/resource-recommendation", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_resource_recommendation(
    body: AIResourceRecommendationRequest, service: AIServiceDep, current_user: CurrentVerifiedUser
):
    """SOP-AI-004 / SOP-RM-001: Xếp hàng đề xuất nhân sự phù hợp cho một task."""
    return await service.request_resource_recommendation(body.task_id, current_user)


@router.post(
    "/risk-analysis", response_model=AIJobResponse, status_code=status.HTTP_202_ACCEPTED
)
async def request_risk_analysis(
    body: AIRiskAnalysisRequest, service: AIServiceDep, current_user: CurrentVerifiedUser
):
    """SOP-AI-005: Xếp hàng quét rủi ro thủ công cho một project."""
    return await service.request_risk_analysis(body.project_id, current_user)


@router.get("/jobs/{job_id}", response_model=AIResultResponse)
async def get_ai_job(job_id: int, service: AIServiceDep, current_user: CurrentUser):
    return await service.get_job(job_id, current_user)
