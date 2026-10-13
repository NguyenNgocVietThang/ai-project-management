"""D2: yêu cầu sinh tài liệu SRS/BRD và job bền `document.generate`.

Thiết kế chuỗi job: mỗi job `document.generate` làm ĐÚNG MỘT bước rồi xếp job kế tiếp
trong cùng transaction có fence:
- còn nhóm mục chưa sinh: gọi provider một lần cho nhóm kế tiếp (ngoài transaction),
  rồi ghi nguyên tử nội dung nhóm vào `sections[<chỉ số nhóm>]` và xếp job tiếp theo;
- đủ mọi nhóm: dựng DOCX (assumptions sinh từ hồ sơ, không từ AI), lưu bucket private
  qua storage adapter với key không đoán được, đặt bản ghi `ready`.
Vì mỗi job chỉ một lượt provider nên cơ chế checkpoint/quota sẵn có (mark_dispatched +
reserve_ai_call, staged_result) áp dụng nguyên vẹn cho từng lượt. Restart giữa chừng
chạy tiếp từ nhóm chưa lưu; nhóm đã lưu không bao giờ được gọi lại.

Lỗi vĩnh viễn (provider, storage...) đặt bản ghi `failed` kèm `error_code`; gọi lại
`request_document` sẽ dùng lại bản ghi đó, giữ các nhóm đã sinh.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    TooManyRequestsException,
)
from app.core.job_runner import JobError, JobResult, PermanentJobError
from app.models.generated_document import (
    GENERATED_DOC_LANGUAGES,
    GENERATED_DOC_TYPES,
    GeneratedDocument,
)
from app.models.job import Job
from app.models.project import Project
from app.models.requirement_brief import RequirementBrief
from app.models.user import User
from app.schemas.requirement_brief import validate_items
from app.services.documents.templates import get_template, missing_brief_items
from app.services.job_service import enqueue
from app.services.phase2_common import get_project_context, require_project_roles
from app.services.storage_service import StorageError, get_storage_service

JOB_KIND = "document.generate"
# Vai trò dự án được yêu cầu sinh tài liệu (Admin hệ thống luôn được phép).
DOCUMENT_ROLES: tuple[str, ...] = ("PM", "BA", "PO")
DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
# Lý do khi dự án không có hồ sơ yêu cầu (tạo thủ công).
NO_BRIEF = "no_brief"
TERMINAL_JOB_STATUSES = ("succeeded", "failed")
ACTIVE_STATUSES = ("queued", "generating")
REUSABLE_STATUSES = ("failed", "needs_clarification")
MAX_WARNINGS = 100


async def _lock_document(db, document_id: int) -> GeneratedDocument | None:
    statement = (
        select(GeneratedDocument)
        .where(GeneratedDocument.id == document_id)
        .execution_options(populate_existing=True)
    )
    if db.get_bind().dialect.name == "postgresql":
        statement = statement.with_for_update()
    return await db.scalar(statement)


async def find_project_brief(db, project_id: int) -> RequirementBrief | None:
    """Hồ sơ mới nhất đã gắn với dự án (dự án sinh từ hồ sơ ở C4)."""
    return await db.scalar(
        select(RequirementBrief)
        .where(RequirementBrief.project_id == project_id)
        .order_by(RequirementBrief.id.desc())
        .limit(1)
    )


def blocking_missing_items(doc_type: str, brief: RequirementBrief) -> list[str]:
    """Mục hồ sơ bắt buộc còn `missing`.

    Mục `skipped` được coi là đã xử lý (người dùng chủ động bỏ qua): không chặn sinh
    tài liệu, chỉ xuất hiện ở "Giả định và vấn đề mở" như vấn đề mở.
    """
    items = validate_items(brief.items)
    skipped = set(items.keys_with_status("skipped"))
    return [key for key in missing_brief_items(get_template(doc_type), items.to_json()) if key not in skipped]


async def _job_active(db, job_id: int | None) -> bool:
    if job_id is None:
        return False
    job = await db.get(Job, job_id)
    return job is not None and job.status not in TERMINAL_JOB_STATUSES


async def _quota_exhausted(db) -> bool:
    from app.services.ai.requirement_clarifier import _quota_exhausted as check

    return await check(db)


async def _enqueue_step(db, document: GeneratedDocument, owner_id: int | None) -> Job:
    job = await enqueue(
        db, kind=JOB_KIND, payload={"document_id": document.id},
        dedupe_key=f"doc:{document.id}:{uuid.uuid4().hex}",
        owner_id=owner_id, project_id=document.project_id, ambiguous_on_lease_loss=True,
    )
    document.job_id = job.id
    return job


async def request_document(
    db, project_id: int, user: User, doc_type: str, language: str = "vi"
) -> tuple[GeneratedDocument, Job | None]:
    """Yêu cầu sinh tài liệu trong transaction của bên gọi (không commit).

    Trả (bản ghi, job). Job là None khi bản ghi ở `needs_clarification`.
    Ngoại lệ:
    - BadRequestException("invalid_doc_type" | "invalid_language")
    - NotFound/Forbidden: không phải thành viên, hoặc vai trò không thuộc PM/BA/PO.
    - ConflictException("document_generation_pending"): đang có job sinh cùng loại/ngôn ngữ.
    - TooManyRequestsException("ai_quota_exceeded"): hết quota AI trong ngày.
    Hành vi khi thiếu dữ liệu (không gọi AI, không xếp job):
    - dự án không có hồ sơ: `needs_clarification`, missing_items = ["no_brief"];
    - hồ sơ còn mục bắt buộc `missing`: `needs_clarification` với danh sách mục; hồ sơ
      đang `ready`/`consumed` được đưa về `clarifying` để mở lại vòng hỏi (project_id
      giữ nguyên nên không thể sinh dự án thứ hai từ hồ sơ này).
    """
    doc_type = doc_type.upper() if isinstance(doc_type, str) else ""
    if doc_type not in GENERATED_DOC_TYPES:
        raise BadRequestException("invalid_doc_type")
    if language not in GENERATED_DOC_LANGUAGES:
        raise BadRequestException("invalid_language")
    await require_project_roles(db, project_id, user, *DOCUMENT_ROLES)

    latest = await db.scalar(
        select(GeneratedDocument)
        .where(
            GeneratedDocument.project_id == project_id,
            GeneratedDocument.doc_type == doc_type,
            GeneratedDocument.language == language,
        )
        .order_by(GeneratedDocument.version.desc())
        .limit(1)
    )
    if latest is not None:
        latest = await _lock_document(db, latest.id)
        if latest.status in ACTIVE_STATUSES and await _job_active(db, latest.job_id):
            raise ConflictException("document_generation_pending")

    brief = await find_project_brief(db, project_id)
    missing = [NO_BRIEF] if brief is None else blocking_missing_items(doc_type, brief)
    if not missing and await _quota_exhausted(db):
        raise TooManyRequestsException("ai_quota_exceeded")

    # Dùng lại bản ghi lỗi/cần làm rõ/bị kẹt (job đã kết thúc) để giữ các nhóm đã sinh.
    if latest is not None and latest.status != "ready":
        document = latest
        if document.brief_id != (brief.id if brief else None):
            # Hồ sơ nguồn đổi: nội dung cũ không còn đúng nguồn, sinh lại từ đầu.
            document.sections = {}
        document.brief_id = brief.id if brief else None
    else:
        template = get_template(doc_type)
        from app.services.ai.document_writer import plan_section_groups

        document = GeneratedDocument(
            project_id=project_id, brief_id=brief.id if brief else None, doc_type=doc_type,
            language=language, version=(latest.version + 1) if latest else 1,
            section_groups=plan_section_groups(template), sections={}, warnings=[],
            created_by_id=user.id,
        )
        db.add(document)
    document.created_by_id = user.id
    document.error_code = None
    document.storage_key = None
    document.file_size = None
    document.completed_at = None

    if missing:
        document.status = "needs_clarification"
        document.missing_items = missing
        document.job_id = None
        if brief is not None and brief.status in ("ready", "consumed") and brief.pending_job_id is None:
            brief.status = "clarifying"
        await db.flush()
        return document, None

    document.status = "queued"
    document.missing_items = None
    document.warnings = []
    await db.flush()
    job = await _enqueue_step(db, document, user.id)
    await db.flush()
    return document, job


async def get_document(db, document_id: int, user: User) -> GeneratedDocument:
    """Đọc bản ghi sau khi kiểm tra quyền thành viên dự án (mọi vai trò được xem)."""
    document = await db.get(GeneratedDocument, document_id)
    if document is None:
        raise NotFoundException("Document not found")
    await get_project_context(db, document.project_id, user)
    return document


async def list_documents(db, project_id: int, user: User) -> list[GeneratedDocument]:
    await get_project_context(db, project_id, user)
    return list((await db.scalars(
        select(GeneratedDocument)
        .where(GeneratedDocument.project_id == project_id)
        .order_by(GeneratedDocument.created_at.desc(), GeneratedDocument.id.desc())
    )).all())


async def read_document_file(db, document_id: int, user: User, storage=None) -> tuple[bytes, str, str]:
    """Đọc bytes DOCX để endpoint proxy tải về: (data, content_type, tên tệp gợi ý).

    Chỉ dùng sau khi người dùng là thành viên dự án; ném ConflictException khi chưa ready.
    """
    document = await get_document(db, document_id, user)
    if document.status != "ready" or not document.storage_key:
        raise ConflictException("document_not_ready")
    storage = storage or get_storage_service()
    data, _content_type = await storage.get_bytes(document.storage_key)
    filename = f"{document.doc_type}-v{document.version}-{document.language}.docx"
    return data, DOCX_CONTENT_TYPE, filename


def merged_content(document: GeneratedDocument) -> dict[str, Any]:
    """Ghép nội dung các nhóm theo thứ tự nhóm."""
    content: dict[str, Any] = {}
    for index in range(len(document.section_groups or [])):
        content.update((document.sections or {}).get(str(index), {}))
    return content


def next_group_index(document: GeneratedDocument) -> int | None:
    done = document.sections or {}
    for index in range(len(document.section_groups or [])):
        if str(index) not in done:
            return index
    return None


# ---------------------------------------------------------------------------
# Job bền
# ---------------------------------------------------------------------------


async def _mark_failed(ctx, document_id: int, code: str) -> None:
    """Ghi trạng thái failed cho bản ghi (transaction riêng, chỉ khi job này còn quản lý)."""
    async with ctx.session_factory() as db, db.begin():
        document = await _lock_document(db, document_id)
        if document is not None and document.job_id == ctx.job_id and document.status != "ready":
            document.status = "failed"
            document.error_code = code


async def _authorize(db, document: GeneratedDocument) -> tuple[User, Project]:
    user = await db.get(User, document.created_by_id) if document.created_by_id else None
    if user is None or not user.is_active:
        raise PermanentJobError("project_unavailable")
    project = await db.get(Project, document.project_id)
    if project is None or project.deleted_at is not None:
        raise PermanentJobError("project_unavailable")
    try:
        await require_project_roles(db, document.project_id, user, *DOCUMENT_ROLES)
    except (ForbiddenException, NotFoundException) as exc:
        raise PermanentJobError("project_unavailable") from exc
    return user, project


async def run_document_job(ctx) -> JobResult:
    document_id = (ctx.job.payload or {}).get("document_id")
    if not isinstance(document_id, int):
        raise PermanentJobError("invalid_payload")
    try:
        return await _run_step(ctx, document_id)
    except JobError as exc:
        if not exc.retryable:
            await _mark_failed(ctx, document_id, exc.code)
        raise


async def _run_step(ctx, document_id: int) -> JobResult:
    from app.services.ai.document_writer import (
        build_assumption_items,
        build_brief_context,
        build_process_steps,
        build_project_context,
    )

    async with ctx.session_factory() as db:
        document = await db.get(GeneratedDocument, document_id)
        if document is None:
            raise PermanentJobError("invalid_payload")
        if document.job_id != ctx.job_id or document.status == "ready":
            # Job cũ bị thay thế, hoặc đã xong (retry/restart): kết thúc không làm gì.
            await db.rollback()
            return JobResult(result={"document_id": document_id, "skipped": True})
        _, project = await _authorize(db, document)
        template = get_template(document.doc_type)
        brief = await db.get(RequirementBrief, document.brief_id) if document.brief_id else None
        if brief is None:
            raise PermanentJobError("invalid_payload")
        index = next_group_index(document)
        language = document.language
        groups = [list(group) for group in document.section_groups]
        brief_context = build_brief_context(brief)
        project_context = await build_project_context(db, document.project_id)
        assumptions = build_assumption_items(brief, language)
        content = merged_content(document)
        project_name = project.name
        doc_type, version, project_id = document.doc_type, document.version, document.project_id
        owner_id = ctx.job.owner_id
        if document.status == "queued":
            document.status = "generating"
        await db.commit()

    if index is not None:
        return await _generate_group(
            ctx, document_id, index, template, groups[index], language, brief_context, project_context, owner_id
        )
    return await _render_and_store(
        ctx, document_id, template, content, assumptions, language, project_name,
        build_process_steps(project_context), doc_type, version, project_id,
    )


async def _generate_group(ctx, document_id, index, template, group, language, brief_context, project_context, owner_id):
    from app.services.ai.document_writer import write_section_group
    from app.services.ai.job_context import active_ai_context
    from app.services.ai.parsing import AIResponseError

    token = active_ai_context.set(ctx)
    try:
        content, warnings = await write_section_group(
            template, group, language=language, brief_context=brief_context, project_context=project_context
        )
    except AIResponseError as exc:
        # Output sai schema/kiểu: lỗi provider, không lưu gì cho nhóm này.
        raise PermanentJobError("invalid_provider_response") from exc
    finally:
        active_ai_context.reset(token)

    async def apply(db, job):
        document = await _lock_document(db, document_id)
        if document is None or document.job_id != job.id:
            return
        sections = dict(document.sections or {})
        if str(index) not in sections:
            # Gán đối tượng mới để SQLAlchemy nhận thay đổi cột JSON.
            sections[str(index)] = content
            document.sections = sections
            document.warnings = (list(document.warnings or []) + warnings)[:MAX_WARNINGS]
        document.status = "generating"
        await db.flush()
        await _enqueue_step(db, document, owner_id)

    return JobResult(result={"document_id": document_id, "group": index}, apply=apply)


async def _render_and_store(
    ctx, document_id, template, content, assumptions, language, project_name, process_steps,
    doc_type, version, project_id,
):
    from app.services.documents.docx_renderer import render_docx_report

    generated_at = datetime.now(UTC)
    rendered = render_docx_report(
        template, content, assumptions, language=language,
        title=f"{template.title(language)} - v{version}", project_name=project_name,
        generated_at=generated_at, process_steps=process_steps,
    )
    # Key không đoán được; bucket private, chỉ tải qua endpoint đã kiểm tra quyền.
    key = f"documents/{project_id}/{uuid.uuid4().hex}.docx"
    await ctx.assert_lease()
    try:
        await get_storage_service().put_bytes(key, rendered.data, DOCX_CONTENT_TYPE)
    except (StorageError, ValueError) as exc:
        raise PermanentJobError("storage_error") from exc

    async def apply(db, job):
        document = await _lock_document(db, document_id)
        if document is None or document.job_id != job.id:
            return
        document.storage_key = key
        document.file_size = len(rendered.data)
        document.warnings = (list(document.warnings or []) + rendered.warnings)[:MAX_WARNINGS]
        document.status = "ready"
        document.error_code = None
        document.completed_at = generated_at

    return JobResult(result={"document_id": document_id, "ready": True, "doc_type": doc_type}, apply=apply)

