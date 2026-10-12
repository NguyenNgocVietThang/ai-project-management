"""C3: nghiệp vụ hồ sơ yêu cầu cho API (chỉ chủ sở hữu truy cập).

Quy ước lỗi:
- Hồ sơ không tồn tại hoặc của người khác => 404 `brief_not_found` (không lộ tồn tại).
- Hồ sơ đã `ready`/`consumed` mà vẫn sửa/trả lời => 409 `brief_not_clarifying`.
- Đang có lượt AI chưa kết thúc mà trả lời tiếp => 409 `clarify_turn_pending`.
Mọi hàm chạy trong transaction của request (get_db commit/rollback), không tự commit.
"""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableException,
)
from app.models.ai_request import AIRequest
from app.models.job import Job
from app.models.requirement_brief import RequirementBrief
from app.models.user import User
from app.schemas.requirement_brief import (
    REQUIREMENT_ITEM_KEYS,
    ItemCounts,
    PendingTurn,
    RequirementBriefDetail,
    RequirementBriefRead,
    RequirementBriefSummary,
    RequirementItemPatch,
    apply_item_updates,
    empty_items,
    validate_items,
    validate_qa_history,
)
from app.services.ai.requirement_clarifier import (
    CLARIFY_MAX_TURNS,
    TERMINAL_JOB_STATUSES,
    _lock_brief,
    _quota_exhausted,
    enqueue_clarify_turn,
)

LIST_LIMIT_MAX = 50


def _counts(items: Any) -> ItemCounts:
    parsed = validate_items(items)
    counts = {status: len(parsed.keys_with_status(status)) for status in ("clear", "missing", "assumed", "skipped")}
    total = len(REQUIREMENT_ITEM_KEYS)
    return ItemCounts(**counts, total=total, resolved=total - counts["missing"])


async def _pending_turn(db: AsyncSession, brief: RequirementBrief) -> PendingTurn | None:
    if brief.pending_job_id is None:
        return None
    job = await db.get(Job, brief.pending_job_id)
    if job is None:
        return None
    return PendingTurn(job_id=job.id, status=job.status)


def _open_question(brief: RequirementBrief) -> str | None:
    history = brief.qa_history or []
    if history and history[-1].get("answer") is None:
        return history[-1]["question"]
    return None


async def to_detail(db: AsyncSession, brief: RequirementBrief) -> RequirementBriefDetail:
    # Nạp lại sau flush: cột như updated_at bị expire, truy cập đồng bộ sẽ lazy-load lỗi.
    await db.refresh(brief)
    base = RequirementBriefRead.model_validate(brief).model_dump()
    counts = _counts(brief.items)
    turn_count = brief.turn_count or 0
    return RequirementBriefDetail(
        **base,
        pending_turn=await _pending_turn(db, brief),
        max_turns=CLARIFY_MAX_TURNS,
        turns_remaining=max(0, CLARIFY_MAX_TURNS - turn_count),
        item_counts=counts,
        open_question=_open_question(brief),
        can_finalize=brief.status == "clarifying" and counts.missing == 0,
    )


def to_summary(brief: RequirementBrief) -> RequirementBriefSummary:
    return RequirementBriefSummary(
        id=brief.id, idea=brief.idea, status=brief.status, turn_count=brief.turn_count or 0,
        project_id=brief.project_id, item_counts=_counts(brief.items),
        created_at=brief.created_at, updated_at=brief.updated_at,
    )


async def get_owned(db: AsyncSession, brief_id: int, user: User, *, lock: bool = False) -> RequirementBrief:
    """Đọc hồ sơ của chính người dùng; người khác nhận 404 như không tồn tại."""
    if lock:
        brief = await _lock_brief(db, brief_id)
    else:
        brief = await db.get(RequirementBrief, brief_id)
    if brief is None or brief.owner_id != user.id:
        raise NotFoundException("brief_not_found")
    return brief


def _require_clarifying(brief: RequirementBrief) -> None:
    if brief.status != "clarifying":
        raise ConflictException("brief_not_clarifying")


async def _has_running_turn(db: AsyncSession, brief: RequirementBrief) -> bool:
    if brief.pending_job_id is None:
        return False
    job = await db.get(Job, brief.pending_job_id)
    return job is not None and job.status not in TERMINAL_JOB_STATUSES


def _apply_user_updates(brief: RequirementBrief, updates: list[dict[str, Any]], source: str = "user") -> None:
    try:
        outcome = apply_item_updates(brief.items, updates, source=source)
    except ValueError as exc:
        # Lỗi nghiệp vụ/validate của C1: không mục nào được áp.
        raise UnprocessableException("invalid_item_update") from exc
    brief.items = outcome.items.to_json()


async def create_brief(db: AsyncSession, idea: str, user: User) -> tuple[RequirementBrief, AIRequest, Job]:
    """Tạo hồ sơ và enqueue lượt đầu trong cùng transaction.

    Kiểm tra quota TRƯỚC khi tạo hồ sơ để lỗi 429 không để lại hồ sơ rác (get_db cũng
    rollback khi có ngoại lệ, đây là lớp bảo vệ thứ hai).
    """
    if await _quota_exhausted(db):
        raise TooManyRequestsException("ai_quota_exceeded")
    brief = RequirementBrief(
        owner_id=user.id, idea=idea, items=empty_items().to_json(), qa_history=[], turn_count=0, status="clarifying",
    )
    db.add(brief)
    await db.flush()
    request, job = await enqueue_clarify_turn(db, brief, user)
    await db.refresh(brief)
    return brief, request, job


async def list_briefs(db: AsyncSession, user: User, limit: int) -> list[RequirementBrief]:
    statement = (
        select(RequirementBrief).where(RequirementBrief.owner_id == user.id)
        .order_by(RequirementBrief.created_at.desc(), RequirementBrief.id.desc()).limit(min(limit, LIST_LIMIT_MAX))
    )
    return list((await db.scalars(statement)).all())


async def answer(
    db: AsyncSession, brief_id: int, user: User, answer_text: str | None, item_updates: list[RequirementItemPatch],
) -> tuple[RequirementBrief, AIRequest, Job]:
    """Ghi câu trả lời cho câu hỏi mở mới nhất, áp sửa mục của người dùng, enqueue lượt kế.

    Khóa hàng hồ sơ trước khi kiểm tra lượt đang chạy, nên hai request đồng thời không
    thể cùng tạo job (request sau thấy `pending_job_id` và nhận 409).
    """
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    if await _has_running_turn(db, brief):
        raise ConflictException("clarify_turn_pending")
    text = (answer_text or "").strip() or None
    if text is not None:
        history = validate_qa_history(brief.qa_history or [])
        if not history or history[-1].answer is not None:
            raise ConflictException("no_open_question")
        history[-1].answer = text
        history[-1].answered_at = datetime.now(UTC)
        brief.qa_history = [entry.model_dump(mode="json") for entry in history]
    if item_updates:
        if any(update.key is None for update in item_updates):
            raise UnprocessableException("item_key_required")
        _apply_user_updates(brief, [update.model_dump() for update in item_updates])
    await db.flush()
    request, job = await enqueue_clarify_turn(db, brief, user)
    return brief, request, job


async def accept_assumption(db: AsyncSession, brief_id: int, key: str, user: User, value: str | None) -> RequirementBrief:
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    item = validate_items(brief.items).get(key)
    if item.status != "missing" or (item.proposed_assumption is None and not (value or "").strip()):
        raise ConflictException("no_proposed_assumption")
    _apply_user_updates(brief, [{"key": key, "status": "assumed", "value": value}], source="ai_assumption_confirmed")
    await db.flush()
    return brief


async def reject_assumption(db: AsyncSession, brief_id: int, key: str, user: User) -> RequirementBrief:
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    items = validate_items(brief.items).model_copy(deep=True)
    item = items.get(key)
    if item.status != "missing" or item.proposed_assumption is None:
        raise ConflictException("no_proposed_assumption")
    # Giữ `missing`, chỉ xóa đề xuất (C1 giữ đề xuất khi nguồn user đưa về missing nên gán trực tiếp).
    item.proposed_assumption = None
    brief.items = items.to_json()
    await db.flush()
    return brief


async def patch_item(db: AsyncSession, brief_id: int, key: str, user: User, patch: RequirementItemPatch) -> RequirementBrief:
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    _apply_user_updates(brief, [{"key": key, "status": patch.status, "value": patch.value}])
    await db.flush()
    return brief


async def skip_and_finish(db: AsyncSession, brief_id: int, user: User) -> RequirementBrief:
    """"Bỏ qua, tạo luôn": mục `missing` thành `skipped`, hồ sơ chuyển `ready`.

    Lượt AI đang chạy (nếu có) sẽ thất bại khi áp vì hồ sơ không còn `clarifying`.
    """
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    missing = validate_items(brief.items).keys_with_status("missing")
    if missing:
        _apply_user_updates(brief, [{"key": key, "status": "skipped"} for key in missing])
    brief.status = "ready"
    brief.pending_job_id = None
    await db.flush()
    return brief


async def finalize(db: AsyncSession, brief_id: int, user: User) -> RequirementBrief:
    brief = await get_owned(db, brief_id, user, lock=True)
    _require_clarifying(brief)
    if validate_items(brief.items).keys_with_status("missing"):
        raise ConflictException("brief_items_missing")
    brief.status = "ready"
    brief.pending_job_id = None
    await db.flush()
    return brief
