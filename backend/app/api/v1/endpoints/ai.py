from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.dependencies import CurrentUser, require_permissions
from app.models.user import User
from app.schemas.ai import AIGenerateProjectRequest, AIJobResponse, AIResultResponse
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
    return await service.request_project_generation(body.prompt, body.ai_provider, current_user)


@router.get("/jobs/{job_id}", response_model=AIResultResponse)
async def get_ai_job(job_id: int, service: AIServiceDep, current_user: CurrentUser):
    return await service.get_job(job_id, current_user)
