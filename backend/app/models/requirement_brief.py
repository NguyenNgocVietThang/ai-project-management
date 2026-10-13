"""Hồ sơ yêu cầu: ý tưởng gốc được AI hỏi làm rõ từng mục trước khi sinh dự án.

Cấu trúc JSON của cột `items` và `qa_history` được kiểm soát bởi
`app.schemas.requirement_brief`; model chỉ lưu trữ, không tự kiểm tra nội dung.
"""

from sqlalchemy import JSON, CheckConstraint, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

# Trạng thái vòng đời của hồ sơ:
# - clarifying: đang hỏi làm rõ
# - ready: đã chốt, sẵn sàng sinh dự án
# - consumed: đã dùng để sinh dự án (project_id được gắn)
BRIEF_STATUSES: tuple[str, ...] = ("clarifying", "ready", "consumed")


class RequirementBrief(Base):
    __tablename__ = "requirement_briefs"
    __table_args__ = (
        CheckConstraint(
            "status IN ('clarifying', 'ready', 'consumed')", name="ck_requirement_briefs_status"
        ),
        CheckConstraint("turn_count >= 0", name="ck_requirement_briefs_turn_count"),
        Index("ix_requirement_briefs_owner", "owner_id", "created_at"),
        Index("ix_requirement_briefs_project", "project_id"),
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    # Gắn sau khi dự án được sinh từ hồ sơ; dự án bị xóa thì hồ sơ vẫn giữ lại.
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    idea: Mapped[str] = mapped_column(Text, nullable=False)
    # Dict cố định theo REQUIREMENT_ITEM_KEYS, mỗi giá trị là một RequirementItem.
    items: Mapped[dict] = mapped_column(JSON, nullable=False)
    # Danh sách QAEntry theo thứ tự thời gian.
    qa_history: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    turn_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="clarifying", server_default="clarifying"
    )
    # Lượt AI gần nhất đã được áp vào hồ sơ: dùng để chống áp một lượt hai lần (C2).
    last_ai_request_id: Mapped[int | None] = mapped_column(
        ForeignKey("ai_requests.id", ondelete="SET NULL")
    )
    # Job hỏi làm rõ đang chờ chạy; khác null nghĩa là đang có lượt AI (C3 trả 409).
    pending_job_id: Mapped[int | None] = mapped_column(ForeignKey("jobs.id", ondelete="SET NULL"))

    def __repr__(self) -> str:
        return f"<RequirementBrief id={self.id} owner={self.owner_id} status={self.status}>"
