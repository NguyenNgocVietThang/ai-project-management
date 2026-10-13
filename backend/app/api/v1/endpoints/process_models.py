"""B2: API quy trình nghiệp vụ (BPMN rút gọn) do AI sinh từ hồ sơ yêu cầu.

- POST sinh quy trình: 202 kèm job_id; 200 khi hồ sơ thiếu dữ liệu (needs_clarification).
- GET quy trình mới nhất: mọi thành viên dự án; 404 khi chưa có.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.db.session import get_db
from app.schemas.process_model import (
    ProcessModelGenerateRequest,
    ProcessModelGenerateResponse,
    ProcessModelResponse,
)
from app.services import process_model_service as svc

router = APIRouter()
DB = Annotated[AsyncSession, Depends(get_db)]


@router.post(
    "/projects/{project_id}/process-model",
    response_model=ProcessModelGenerateResponse,
    status_code=status.HTTP_202_ACCEPTED,
    responses={200: {"model": ProcessModelGenerateResponse, "description": "Hồ sơ thiếu dữ liệu, cần làm rõ"}},
)
async def generate_process_model(
    project_id: int, db: DB, user: CurrentVerifiedUser, body: ProcessModelGenerateRequest | None = None,
):
    outcome = await svc.request_process_model(db, project_id, user, (body or ProcessModelGenerateRequest()).language)
    payload = ProcessModelGenerateResponse(
        status=outcome.status, job_id=outcome.job_id, ai_request_id=outcome.ai_request_id,
        missing_items=outcome.missing_items, skipped_items=outcome.skipped_items,
        brief_reopened=outcome.brief_reopened,
    )
    if outcome.job_id is None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=payload.model_dump(mode="json"))
    return payload


@router.get("/projects/{project_id}/process-model", response_model=ProcessModelResponse)
async def get_process_model(project_id: int, db: DB, user: CurrentUser):
    """Quy trình mới nhất kèm cảnh báo lint và bảng các bước."""
    return await svc.read_latest_for_user(db, project_id, user)
