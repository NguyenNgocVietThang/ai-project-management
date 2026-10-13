"""Schema API tài liệu SRS/BRD do AI sinh (D3)."""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class DocumentGenerateRequest(BaseModel):
    doc_type: Literal["SRS", "BRD"]
    language: Literal["vi", "en"] = "vi"


class DocumentProgress(BaseModel):
    # Số nhóm mục đã sinh xong / tổng số nhóm.
    completed_groups: int
    total_groups: int


class GeneratedDocumentResponse(BaseModel):
    id: int
    project_id: int
    brief_id: int | None
    doc_type: str
    language: str
    version: int
    # queued | generating | needs_clarification | ready | failed
    status: str
    progress: DocumentProgress
    missing_items: list[str]
    warnings: list
    error_code: str | None
    file_size: int | None
    job_id: int | None
    job_status: str | None
    created_by_id: int | None
    created_at: datetime
    completed_at: datetime | None


class DocumentGenerateResponse(BaseModel):
    document: GeneratedDocumentResponse
    job_id: int | None
