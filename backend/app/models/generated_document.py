"""Bản ghi tài liệu SRS/BRD do AI sinh theo nhóm mục (D2).

Khác bảng `documents` (tệp người dùng tải lên MinIO), bảng này theo dõi vòng đời
sinh tài liệu: các phần nội dung đã sinh theo nhóm (lưu nguyên tử từng nhóm để
restart không gọi lại AI), danh sách mục hồ sơ còn thiếu, khóa tệp DOCX trong bucket
private và mã lỗi.
"""

from datetime import datetime

from sqlalchemy import (
    JSON,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

GENERATED_DOC_TYPES: tuple[str, ...] = ("SRS", "BRD")
GENERATED_DOC_LANGUAGES: tuple[str, ...] = ("vi", "en")
# Trạng thái:
# - queued: đã xếp job, chưa chạy
# - generating: đang sinh (đã có ít nhất một job chạy)
# - needs_clarification: hồ sơ còn mục bắt buộc thiếu, không xếp job
# - ready: đã dựng DOCX và lưu bucket private
# - failed: job lỗi vĩnh viễn; có thể yêu cầu lại, phần đã sinh được giữ
GENERATED_DOC_STATUSES: tuple[str, ...] = (
    "queued",
    "generating",
    "needs_clarification",
    "ready",
    "failed",
)


def _in(values: tuple[str, ...]) -> str:
    return ", ".join(f"'{value}'" for value in values)


class GeneratedDocument(Base):
    __tablename__ = "generated_documents"
    __table_args__ = (
        CheckConstraint(f"doc_type IN ({_in(GENERATED_DOC_TYPES)})", name="ck_generated_documents_doc_type"),
        CheckConstraint(f"language IN ({_in(GENERATED_DOC_LANGUAGES)})", name="ck_generated_documents_language"),
        CheckConstraint(f"status IN ({_in(GENERATED_DOC_STATUSES)})", name="ck_generated_documents_status"),
        CheckConstraint("version >= 1", name="ck_generated_documents_version"),
        UniqueConstraint("project_id", "doc_type", "language", "version", name="uq_generated_documents_version"),
        Index("ix_generated_documents_project", "project_id", "created_at"),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    brief_id: Mapped[int | None] = mapped_column(ForeignKey("requirement_briefs.id", ondelete="SET NULL"))
    doc_type: Mapped[str] = mapped_column(String(8), nullable=False)
    language: Mapped[str] = mapped_column(String(2), nullable=False, default="vi", server_default="vi")
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")
    status: Mapped[str] = mapped_column(String(24), nullable=False, default="queued", server_default="queued")
    # Danh sách nhóm key mục (list[list[str]]) cố định khi tạo bản ghi, để restart dùng đúng nhóm cũ.
    section_groups: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # Dict "chỉ số nhóm" (chuỗi) -> {key mục: nội dung đã chuẩn hóa}. Nhóm có mặt nghĩa
    # là đã sinh xong; mỗi nhóm được ghi nguyên tử trong một transaction.
    sections: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # Key hồ sơ còn thiếu khi status = needs_clarification (hoặc lý do "no_brief").
    missing_items: Mapped[list | None] = mapped_column(JSON)
    warnings: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    storage_key: Mapped[str | None] = mapped_column(Text)
    file_size: Mapped[int | None] = mapped_column(Integer)
    error_code: Mapped[str | None] = mapped_column(String(64))
    # Job gần nhất của chuỗi sinh (để API đọc trạng thái job và chặn yêu cầu trùng).
    job_id: Mapped[int | None] = mapped_column(ForeignKey("jobs.id", ondelete="SET NULL"))
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    def __repr__(self) -> str:
        return f"<GeneratedDocument id={self.id} project={self.project_id} type={self.doc_type} status={self.status}>"
