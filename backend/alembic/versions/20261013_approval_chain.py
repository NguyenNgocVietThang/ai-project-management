"""Chuỗi duyệt CR theo vai trò: required_role, approver_id nullable, CANCELLED, unique bước.

Chuẩn bị đủ cho A1 (tạo chuỗi khi submit) và A2 (quyết định bước, hủy bước sau khi từ chối).
- `approver_id` thành nullable: chỉ ghi người quyết định, null khi bước chưa quyết.
- `required_role` (BA/PO/PM): backfill dữ liệu cũ từ `step_order` (1=BA, 2=PO, còn lại=PM).
- Giá trị enum `CANCELLED` cho `approvalstatus` (chỉ PostgreSQL có kiểu native).
- Unique `(change_request_id, step_order)`: trước khi tạo, xóa các dòng trùng cũ và giữ
  dòng có id nhỏ nhất của mỗi cặp (dữ liệu cũ không có luồng nào tạo approvals nên thường rỗng).
"""

import sqlalchemy as sa

from alembic import op

revision = "20261013_approval_chain"
down_revision = "20261013_ai_request_types_phase4"
branch_labels = None
depends_on = None

OLD_STATUS_VALUES = ("PENDING", "APPROVED", "REJECTED", "REVISIONS_REQUESTED")
UNIQUE_NAME = "uq_approvals_cr_step"


def upgrade() -> None:
    is_postgres = op.get_bind().dialect.name == "postgresql"
    if is_postgres:
        # Giá trị enum mới không được dùng trong cùng transaction nên ADD VALUE là an toàn.
        op.execute("ALTER TYPE approvalstatus ADD VALUE IF NOT EXISTS 'CANCELLED'")

    with op.batch_alter_table("approvals") as batch:
        batch.add_column(sa.Column("required_role", sa.String(length=16), nullable=True))
    op.execute(
        "UPDATE approvals SET required_role = CASE step_order "
        "WHEN 1 THEN 'BA' WHEN 2 THEN 'PO' ELSE 'PM' END"
    )
    # Bỏ dòng trùng (change_request_id, step_order), giữ dòng cũ nhất, để tạo được unique.
    op.execute(
        "DELETE FROM approvals WHERE id NOT IN ("
        "SELECT keep_id FROM (SELECT MIN(id) AS keep_id FROM approvals "
        "GROUP BY change_request_id, step_order) AS kept)"
    )
    with op.batch_alter_table("approvals") as batch:
        batch.alter_column("required_role", existing_type=sa.String(length=16), nullable=False)
        batch.alter_column("approver_id", existing_type=sa.Integer(), nullable=True)
        batch.create_unique_constraint(UNIQUE_NAME, ["change_request_id", "step_order"])


def downgrade() -> None:
    is_postgres = op.get_bind().dialect.name == "postgresql"
    # Lược đồ cũ bắt buộc approver_id và không có CANCELLED: các bước chưa quyết hoặc đã hủy
    # không biểu diễn được nên bị xóa (mất dữ liệu có chủ đích khi hạ cấp).
    op.execute("DELETE FROM approvals WHERE approver_id IS NULL OR status = 'CANCELLED'")
    with op.batch_alter_table("approvals") as batch:
        batch.drop_constraint(UNIQUE_NAME, type_="unique")
        batch.alter_column("approver_id", existing_type=sa.Integer(), nullable=False)
        batch.drop_column("required_role")

    if not is_postgres:
        return
    # PostgreSQL không xóa được giá trị enum: dựng lại kiểu cũ.
    op.execute("ALTER TYPE approvalstatus RENAME TO approvalstatus_old")
    old = ", ".join(f"'{v}'" for v in OLD_STATUS_VALUES)
    op.execute(f"CREATE TYPE approvalstatus AS ENUM ({old})")
    op.execute(
        "ALTER TABLE approvals ALTER COLUMN status TYPE approvalstatus "
        "USING status::text::approvalstatus"
    )
    op.execute("DROP TYPE approvalstatus_old")
