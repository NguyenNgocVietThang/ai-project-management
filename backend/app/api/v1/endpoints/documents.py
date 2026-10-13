"""D3: API tài liệu SRS/BRD do AI sinh.

- POST yêu cầu sinh: 202 kèm job_id; 200 khi hồ sơ còn thiếu (needs_clarification).
- GET danh sách / chi tiết: mọi thành viên dự án.
- GET download: proxy đọc tệp từ bucket private sau khi kiểm tra quyền dự án,
  không lộ URL storage.
"""

from typing import Annotated
from urllib.parse import quote

from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.models.generated_document import GeneratedDocument
from app.models.job import Job
from app.schemas.document import (
    DocumentGenerateRequest,
    DocumentGenerateResponse,
    DocumentProgress,
    GeneratedDocumentResponse,
)
from app.services import document_service as svc

router = APIRouter()
DB = Annotated[AsyncSession, Depends(get_db)]
ACTIVE = ("queued", "generating")


async def _job_statuses(db, documents: list[GeneratedDocument]) -> dict[int, str]:
    ids = {doc.job_id for doc in documents if doc.job_id}
    if not ids:
        return {}
    rows = await db.execute(select(Job.id, Job.status).where(Job.id.in_(ids)))
    return {row.id: row.status for row in rows}


def _to_response(document: GeneratedDocument, job_status: str | None) -> GeneratedDocumentResponse:
    groups = document.section_groups or []
    done = sum(1 for index in range(len(groups)) if str(index) in (document.sections or {}))
    state = document.status
    error_code = document.error_code
    # Worker chết giữa chừng: job đã failed nhưng bản ghi còn queued/generating -> hiển thị failed.
    if state in ACTIVE and job_status == "failed":
        state = "failed"
        error_code = error_code or "job_failed"
    return GeneratedDocumentResponse(
        id=document.id, project_id=document.project_id, brief_id=document.brief_id,
        doc_type=document.doc_type, language=document.language, version=document.version,
        status=state, progress=DocumentProgress(completed_groups=done, total_groups=len(groups)),
        missing_items=list(document.missing_items or []), warnings=list(document.warnings or []),
        error_code=error_code, file_size=document.file_size, job_id=document.job_id,
        job_status=job_status, created_by_id=document.created_by_id,
        created_at=document.created_at, completed_at=document.completed_at,
    )


async def _one(db, document: GeneratedDocument) -> GeneratedDocumentResponse:
    statuses = await _job_statuses(db, [document])
    return _to_response(document, statuses.get(document.job_id))


async def _in_project(db, project_id: int, document_id: int, user) -> GeneratedDocument:
    # Kiểm tra quyền thành viên trước (người ngoài: 403/404), rồi chặn tài liệu của dự án khác.
    document = await svc.get_document(db, document_id, user)
    if document.project_id != project_id:
        raise NotFoundException("Document not found")
    return document


@router.post(
    "/projects/{project_id}/documents",
    response_model=DocumentGenerateResponse,
    status_code=status.HTTP_202_ACCEPTED,
    responses={200: {"model": DocumentGenerateResponse, "description": "Hồ sơ còn thiếu, cần làm rõ"}},
)
async def generate_document(project_id: int, body: DocumentGenerateRequest, db: DB, user: CurrentVerifiedUser):
    document, job = await svc.request_document(db, project_id, user, body.doc_type, body.language)
    await db.refresh(document)
    payload = DocumentGenerateResponse(
        document=_to_response(document, job.status if job else None), job_id=job.id if job else None,
    )
    if job is None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=payload.model_dump(mode="json"))
    return payload


@router.get("/projects/{project_id}/documents", response_model=list[GeneratedDocumentResponse])
async def list_documents(project_id: int, db: DB, user: CurrentUser):
    """Tài liệu của dự án, mới nhất trước, kèm tiến độ nhóm và trạng thái job."""
    documents = await svc.list_documents(db, project_id, user)
    statuses = await _job_statuses(db, documents)
    return [_to_response(doc, statuses.get(doc.job_id)) for doc in documents]


@router.get("/projects/{project_id}/documents/{document_id}", response_model=GeneratedDocumentResponse)
async def get_document(project_id: int, document_id: int, db: DB, user: CurrentUser):
    return await _one(db, await _in_project(db, project_id, document_id, user))


@router.get("/projects/{project_id}/documents/{document_id}/download")
async def download_document(project_id: int, document_id: int, db: DB, user: CurrentUser):
    await _in_project(db, project_id, document_id, user)
    data, content_type, filename = await svc.read_document_file(db, document_id, user)
    # Tên tệp do server dựng (chỉ ký tự an toàn); vẫn mã hóa RFC 5987 để chắc chắn.
    safe = "".join(ch for ch in filename if ch.isalnum() or ch in "-_.") or "document.docx"
    headers = {
        "Content-Disposition": f"attachment; filename=\"{safe}\"; filename*=UTF-8''{quote(safe)}",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
    }
    return Response(content=data, media_type=content_type, headers=headers)
