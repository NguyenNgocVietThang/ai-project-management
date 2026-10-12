"""C3: API hồ sơ yêu cầu (hỏi làm rõ ý tưởng trước khi sinh dự án).

Chỉ chủ sở hữu truy cập; hồ sơ của người khác trả 404. Lượt AI chạy nền: response
trả `job_id` để frontend poll qua `GET /jobs/{job_id}`, rồi đọc lại hồ sơ.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentVerifiedUser
from app.db.session import get_db
from app.schemas.requirement_brief import (
    AssumptionAcceptRequest,
    ItemKey,
    RequirementAnswerRequest,
    RequirementBriefCreate,
    RequirementBriefDetail,
    RequirementBriefSummary,
    RequirementBriefTurnResponse,
    RequirementItemPatch,
)
from app.services import requirement_brief_service as svc

router = APIRouter()
DB = Annotated[AsyncSession, Depends(get_db)]


async def _turn_response(db, brief, request, job) -> RequirementBriefTurnResponse:
    return RequirementBriefTurnResponse(brief=await svc.to_detail(db, brief), job_id=job.id, ai_request_id=request.id)


@router.post("", response_model=RequirementBriefTurnResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_brief(body: RequirementBriefCreate, db: DB, user: CurrentVerifiedUser):
    """Tạo hồ sơ từ ý tưởng và xếp hàng lượt hỏi làm rõ đầu tiên."""
    brief, request, job = await svc.create_brief(db, body.idea, user)
    return await _turn_response(db, brief, request, job)


@router.get("", response_model=list[RequirementBriefSummary])
async def list_briefs(db: DB, user: CurrentVerifiedUser, limit: Annotated[int, Query(ge=1, le=svc.LIST_LIMIT_MAX)] = 20):
    """Hồ sơ của tôi, mới nhất trước."""
    return [svc.to_summary(brief) for brief in await svc.list_briefs(db, user, limit)]


@router.get("/{brief_id}", response_model=RequirementBriefDetail)
async def get_brief(brief_id: int, db: DB, user: CurrentVerifiedUser):
    return await svc.to_detail(db, await svc.get_owned(db, brief_id, user))


@router.post("/{brief_id}/answer", response_model=RequirementBriefTurnResponse, status_code=status.HTTP_202_ACCEPTED)
async def answer_question(brief_id: int, body: RequirementAnswerRequest, db: DB, user: CurrentVerifiedUser):
    """Trả lời câu hỏi mở mới nhất (tùy chọn sửa mục) rồi xếp hàng lượt kế."""
    brief, request, job = await svc.answer(db, brief_id, user, body.answer, body.item_updates)
    return await _turn_response(db, brief, request, job)


@router.post("/{brief_id}/assumptions/{key}/accept", response_model=RequirementBriefDetail)
async def accept_assumption(
    brief_id: int, key: ItemKey, db: DB, user: CurrentVerifiedUser, body: AssumptionAcceptRequest | None = None,
):
    brief = await svc.accept_assumption(db, brief_id, key, user, body.value if body else None)
    return await svc.to_detail(db, brief)


@router.post("/{brief_id}/assumptions/{key}/reject", response_model=RequirementBriefDetail)
async def reject_assumption(brief_id: int, key: ItemKey, db: DB, user: CurrentVerifiedUser):
    return await svc.to_detail(db, await svc.reject_assumption(db, brief_id, key, user))


@router.patch("/{brief_id}/items/{key}", response_model=RequirementBriefDetail)
async def patch_item(brief_id: int, key: ItemKey, body: RequirementItemPatch, db: DB, user: CurrentVerifiedUser):
    return await svc.to_detail(db, await svc.patch_item(db, brief_id, key, user, body))


@router.post("/{brief_id}/skip", response_model=RequirementBriefDetail)
async def skip_and_finish(brief_id: int, db: DB, user: CurrentVerifiedUser):
    """Bỏ qua, tạo luôn: mục còn thiếu thành `skipped`, hồ sơ chuyển `ready`."""
    return await svc.to_detail(db, await svc.skip_and_finish(db, brief_id, user))


@router.post("/{brief_id}/finalize", response_model=RequirementBriefDetail)
async def finalize(brief_id: int, db: DB, user: CurrentVerifiedUser):
    """Chốt hồ sơ khi không còn mục `missing`."""
    return await svc.to_detail(db, await svc.finalize(db, brief_id, user))
