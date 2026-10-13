"""Thêm loại AIRequest cho Phase 4: hỏi làm rõ, sinh tài liệu, sinh quy trình BPMN."""

from alembic import op

revision = "20261013_ai_request_types_phase4"
down_revision = "20261012_requirement_briefs"
branch_labels = None
depends_on = None

NEW_VALUES = ("REQUIREMENT_CLARIFY", "DOCUMENT_GENERATE", "BPMN_GENERATE")
OLD_VALUES = (
    "PROJECT_GENERATE", "IMPACT_ANALYSIS", "SCHEDULE_OPTIMIZE",
    "RESOURCE_RECOMMEND", "RISK_ANALYSIS", "DOCUMENT_PARSE",
)


def upgrade() -> None:
    # SQLite lưu enum dạng VARCHAR không ràng buộc native nên chỉ PostgreSQL cần đổi kiểu.
    if op.get_bind().dialect.name != "postgresql":
        return
    for value in NEW_VALUES:
        op.execute(f"ALTER TYPE airequesttype ADD VALUE IF NOT EXISTS '{value}'")


def downgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    # PostgreSQL không xóa được giá trị enum: dựng lại kiểu cũ sau khi bỏ các request loại mới.
    quoted = ", ".join(f"'{v}'" for v in NEW_VALUES)
    op.execute(f"DELETE FROM ai_requests WHERE request_type::text IN ({quoted})")
    op.execute("ALTER TYPE airequesttype RENAME TO airequesttype_old")
    old = ", ".join(f"'{v}'" for v in OLD_VALUES)
    op.execute(f"CREATE TYPE airequesttype AS ENUM ({old})")
    op.execute(
        "ALTER TABLE ai_requests ALTER COLUMN request_type TYPE airequesttype "
        "USING request_type::text::airequesttype"
    )
    op.execute("DROP TYPE airequesttype_old")
