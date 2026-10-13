"""Quy trình nghiệp vụ (BPMN rút gọn) do AI sinh từ hồ sơ yêu cầu (B2).

Mỗi lần sinh thành công tạo MỘT bản ghi phiên bản mới cho dự án. `ai_request_id`
duy nhất để việc áp kết quả job là idempotent: retry/restart không ghi hai lần.
`model` là JSON đã qua kiểm tra chặt `ProcessModel` (app/schemas/bpmn.py).
"""

from sqlalchemy import JSON, CheckConstraint, ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

PROCESS_MODEL_LANGUAGES: tuple[str, ...] = ("vi", "en")


class ProcessModelRecord(Base):
    __tablename__ = "process_models"
    __table_args__ = (
        CheckConstraint("language IN ('vi', 'en')", name="ck_process_models_language"),
        CheckConstraint("version >= 1", name="ck_process_models_version"),
        UniqueConstraint("project_id", "version", name="uq_process_models_version"),
        UniqueConstraint("ai_request_id", name="uq_process_models_ai_request"),
        Index("ix_process_models_project", "project_id", "version"),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    brief_id: Mapped[int | None] = mapped_column(ForeignKey("requirement_briefs.id", ondelete="SET NULL"))
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")
    language: Mapped[str] = mapped_column(String(2), nullable=False, default="vi", server_default="vi")
    # Cấu trúc quy trình đã kiểm tra (lanes, nodes, flows).
    model: Mapped[dict] = mapped_column(JSON, nullable=False)
    # Cảnh báo từ lint_process_model tại thời điểm lưu.
    warnings: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    ai_request_id: Mapped[int | None] = mapped_column(ForeignKey("ai_requests.id", ondelete="SET NULL"))

    def __repr__(self) -> str:
        return f"<ProcessModelRecord id={self.id} project={self.project_id} v={self.version}>"
