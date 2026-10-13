"""B2: yêu cầu sinh quy trình nghiệp vụ (BPMN rút gọn) và lưu kết quả job AI bền.

Luồng:
1. `request_process_model` (trong transaction của request, không commit): kiểm tra vai trò
   PM/BA/PO (hoặc admin), hồ sơ yêu cầu của dự án, dữ liệu đủ để vẽ, job đang chờ và quota;
   rồi tạo AIRequest `BPMN_GENERATE` + Job `ai.bpmn_generate`.
2. Worker (`durable_jobs.run_ai`) gọi `run_process_generation` NGOÀI transaction: dựng prompt
   từ hồ sơ + tóm tắt dự án, gọi provider một lần, kiểm tra chặt bằng `ProcessModel`.
   Sai schema => `PermanentJobError("invalid_provider_response")`, không ghi gì.
3. `persist_process_model` chạy trong transaction có fence của job: idempotent theo
   `ai_request_id` (unique), tạo phiên bản mới cho dự án.

Thiếu dữ liệu (không gọi AI, không xếp job):
- dự án không có hồ sơ: `needs_clarification`, missing_items = ["no_brief"];
- mục chặn ở trạng thái `missing`: `needs_clarification`, hồ sơ `ready`/`consumed` được đưa
  về `clarifying` để mở lại vòng hỏi (như D2);
- mục chặn chỉ ở trạng thái `skipped`: `needs_clarification` với `skipped_items`, KHÔNG mở
  lại hồ sơ (người dùng chủ động bỏ qua; họ phải tự bổ sung mục đó).
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import func, select

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    TooManyRequestsException,
)
from app.core.job_runner import PermanentJobError
from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
from app.models.process_model import PROCESS_MODEL_LANGUAGES, ProcessModelRecord
from app.models.project import Project
from app.models.requirement_brief import RequirementBrief
from app.models.user import User
from app.schemas.bpmn import ProcessModel, lint_process_model, process_steps_table
from app.services.phase2_common import get_project_context, require_project_roles

JOB_KIND = f"ai.{AIRequestType.BPMN_GENERATE.value.lower()}"
# Vai trò dự án được yêu cầu sinh quy trình (Admin hệ thống luôn được phép).
PROCESS_ROLES: tuple[str, ...] = ("PM", "BA", "PO")
NO_BRIEF = "no_brief"
ACTIVE_REQUEST_STATUSES = (AIRequestStatus.PENDING, AIRequestStatus.PROCESSING)


@dataclass
class ProcessRequestOutcome:
    """Kết quả yêu cầu sinh: `queued` (có job) hoặc `needs_clarification`."""

    status: str
    job_id: int | None = None
    ai_request_id: int | None = None
    missing_items: list[str] = field(default_factory=list)
    skipped_items: list[str] = field(default_factory=list)
    brief_reopened: bool = False


async def find_project_brief(db, project_id: int) -> RequirementBrief | None:
    """Hồ sơ mới nhất đã gắn với dự án (dự án sinh từ hồ sơ ở C4)."""
    return await db.scalar(
        select(RequirementBrief)
        .where(RequirementBrief.project_id == project_id)
        .order_by(RequirementBrief.id.desc())
        .limit(1)
    )


async def _pending_request(db, project_id: int) -> bool:
    """Có yêu cầu BPMN chưa kết thúc cho dự án hay không.

    Trạng thái AIRequest được `mirror_ai_status` đồng bộ theo mỗi chuyển trạng thái job,
    nên PENDING/PROCESSING nghĩa là job còn sống.
    """
    found = await db.scalar(
        select(AIRequest.id).where(
            AIRequest.project_id == project_id,
            AIRequest.request_type == AIRequestType.BPMN_GENERATE,
            AIRequest.status.in_(ACTIVE_REQUEST_STATUSES),
        ).limit(1)
    )
    return found is not None


async def _lock_project(db, project_id: int) -> Project | None:
    statement = select(Project).where(Project.id == project_id).execution_options(populate_existing=True)
    if db.get_bind().dialect.name == "postgresql":
        statement = statement.with_for_update()
    return await db.scalar(statement)


async def request_process_model(db, project_id: int, user: User, language: str = "vi") -> ProcessRequestOutcome:
    """Yêu cầu sinh quy trình trong transaction của bên gọi (không commit).

    Ngoại lệ:
    - BadRequestException("invalid_language")
    - NotFound/Forbidden: không phải thành viên, hoặc vai trò không thuộc PM/BA/PO.
    - ConflictException("process_generation_pending"): đang có job sinh quy trình.
    - TooManyRequestsException("ai_quota_exceeded"): hết quota AI trong ngày.
    """
    from app.services.ai.process_modeler import insufficient_items
    from app.services.ai.requirement_clarifier import _quota_exhausted
    from app.services.job_service import enqueue

    if language not in PROCESS_MODEL_LANGUAGES:
        raise BadRequestException("invalid_language")
    await require_project_roles(db, project_id, user, *PROCESS_ROLES)
    # Khóa hàng dự án để hai yêu cầu đồng thời không cùng tạo job.
    await _lock_project(db, project_id)
    if await _pending_request(db, project_id):
        raise ConflictException("process_generation_pending")

    brief = await find_project_brief(db, project_id)
    if brief is None:
        return ProcessRequestOutcome(status="needs_clarification", missing_items=[NO_BRIEF])
    missing, skipped = insufficient_items(brief)
    if missing or skipped:
        reopened = False
        if missing and brief.status in ("ready", "consumed") and brief.pending_job_id is None:
            # Mở lại vòng hỏi làm rõ; project_id giữ nguyên nên không sinh được dự án thứ hai.
            brief.status = "clarifying"
            reopened = True
            await db.flush()
        return ProcessRequestOutcome(
            status="needs_clarification", missing_items=missing, skipped_items=skipped, brief_reopened=reopened,
        )
    if await _quota_exhausted(db):
        raise TooManyRequestsException("ai_quota_exceeded")

    request = AIRequest(
        project_id=project_id, user_id=user.id, request_type=AIRequestType.BPMN_GENERATE,
        status=AIRequestStatus.PENDING,
        input_data_json={"project_id": project_id, "brief_id": brief.id, "language": language},
    )
    db.add(request)
    await db.flush()
    job = await enqueue(
        db, kind=JOB_KIND, payload={"ai_request_id": request.id},
        dedupe_key=f"ai:{user.id}:{AIRequestType.BPMN_GENERATE.value}:{project_id}:{uuid.uuid4().hex}",
        owner_id=user.id, project_id=project_id, ambiguous_on_lease_loss=True,
    )
    await db.flush()
    return ProcessRequestOutcome(status="queued", job_id=job.id, ai_request_id=request.id)


# ---------------------------------------------------------------------------
# Job AI bền (gọi từ durable_jobs.run_ai)
# ---------------------------------------------------------------------------


async def _authorize_roles(db, request: AIRequest) -> User:
    user = await db.get(User, request.user_id)
    if user is None or not user.is_active:
        raise PermanentJobError("project_unavailable")
    try:
        await require_project_roles(db, request.project_id, user, *PROCESS_ROLES)
    except (ForbiddenException, NotFoundException) as exc:
        raise PermanentJobError("project_unavailable") from exc
    return user


async def run_process_generation(db, request: AIRequest, input_data: dict[str, Any]) -> dict[str, Any]:
    """Phần chạy ngoài transaction: đọc ảnh chụp dữ liệu, gọi provider, kiểm tra schema."""
    from app.services.ai.document_writer import build_brief_context, build_project_context
    from app.services.ai.parsing import AIResponseError
    from app.services.ai.process_modeler import generate_process_model, insufficient_items

    project_id = input_data.get("project_id")
    language = input_data.get("language", "vi")
    if project_id != request.project_id or language not in PROCESS_MODEL_LANGUAGES:
        raise PermanentJobError("invalid_payload")
    existing = await db.scalar(select(ProcessModelRecord.id).where(ProcessModelRecord.ai_request_id == request.id))
    if existing is not None:
        # Đã lưu (restart sau khi áp): không gọi provider lần nữa; apply sẽ bỏ qua.
        return {"process_model_id": existing}
    await _authorize_roles(db, request)
    brief = await db.get(RequirementBrief, input_data.get("brief_id"))
    if brief is None or brief.project_id != project_id:
        raise PermanentJobError("invalid_payload")
    missing, skipped = insufficient_items(brief)
    if missing or skipped:
        # Hồ sơ bị đổi sau khi xếp job: không đủ dữ liệu, không gọi AI.
        raise PermanentJobError("needs_clarification")
    brief_context = build_brief_context(brief)
    project_context = await build_project_context(db, project_id)
    await db.commit()
    try:
        model = await generate_process_model(
            language=language, brief_context=brief_context, project_context=project_context
        )
    except AIResponseError as exc:
        # Output sai schema: lỗi provider, không ghi gì.
        raise PermanentJobError("invalid_provider_response") from exc
    return model.model_dump(mode="json")


async def persist_process_model(
    db, *, request: AIRequest, input_data: dict[str, Any], result: dict[str, Any]
) -> ProcessModelRecord | None:
    """Lưu nguyên tử trong transaction có fence; None nếu yêu cầu này đã được lưu."""
    existing = await db.scalar(select(ProcessModelRecord).where(ProcessModelRecord.ai_request_id == request.id))
    if existing is not None:
        return None
    user = await _authorize_roles(db, request)
    try:
        model = ProcessModel.model_validate(result)
    except ValueError as exc:
        raise PermanentJobError("invalid_provider_response") from exc
    project_id = request.project_id
    # Khóa dự án để số phiên bản không đụng nhau khi hai job áp cùng lúc.
    await _lock_project(db, project_id)
    latest = await db.scalar(
        select(func.max(ProcessModelRecord.version)).where(ProcessModelRecord.project_id == project_id)
    )
    record = ProcessModelRecord(
        project_id=project_id, brief_id=input_data.get("brief_id"), version=(latest or 0) + 1,
        language=input_data.get("language", "vi"), model=model.model_dump(mode="json"),
        warnings=lint_process_model(model), created_by_id=user.id, ai_request_id=request.id,
    )
    db.add(record)
    await db.flush()
    return record


# ---------------------------------------------------------------------------
# Đọc
# ---------------------------------------------------------------------------


async def get_latest_process_model(db, project_id: int) -> ProcessModelRecord | None:
    """Bản ghi quy trình mới nhất của dự án, KHÔNG kiểm tra quyền.

    Dành cho mã nội bộ đã kiểm tra quyền (ví dụ B4 chèn PNG vào DOCX trong job tài liệu).
    """
    return await db.scalar(
        select(ProcessModelRecord)
        .where(ProcessModelRecord.project_id == project_id)
        .order_by(ProcessModelRecord.version.desc())
        .limit(1)
    )


async def get_latest_process(db, project_id: int) -> ProcessModel | None:
    """`ProcessModel` mới nhất của dự án (đã kiểm tra lại schema) hoặc None; không kiểm tra quyền."""
    record = await get_latest_process_model(db, project_id)
    return ProcessModel.model_validate(record.model) if record is not None else None


async def read_latest_for_user(db, project_id: int, user: User) -> dict[str, Any]:
    """Quy trình mới nhất cho mọi thành viên dự án; 404 khi chưa có."""
    await get_project_context(db, project_id, user)
    record = await get_latest_process_model(db, project_id)
    if record is None:
        raise NotFoundException("process_model_not_found")
    model = ProcessModel.model_validate(record.model)
    return {
        "id": record.id,
        "project_id": record.project_id,
        "brief_id": record.brief_id,
        "version": record.version,
        "language": record.language,
        "model": model.model_dump(mode="json"),
        "warnings": lint_process_model(model),
        "steps": process_steps_table(model),
        "created_by_id": record.created_by_id,
        "created_at": record.created_at,
    }
