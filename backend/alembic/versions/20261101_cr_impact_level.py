"""Mức tác động Change Request và xác nhận đọc báo cáo tác động (KH-CR, bước B1).

- change_requests: impact_level (MINOR/MODERATE/MAJOR), PM chốt mức, lý do đổi mức.
- impact_reports: revision, nguồn (AI/MANUAL), mức AI gợi ý và lý do, người tạo.
- approvals: mức tại thời điểm quyết định, revision báo cáo người duyệt đã xác nhận đọc.

Dữ liệu cũ: mọi CR được gán MODERATE và coi như hệ thống đã chốt (confirmed_at = now,
confirmed_by = NULL) để các chuỗi duyệt đang dở không bị chặn; báo cáo cũ là revision 1, nguồn AI.

Revision ID: 20261101_cr_impact_level
Revises: 20261024_device_tokens
"""

import sqlalchemy as sa

from alembic import op

revision = "20261101_cr_impact_level"
down_revision = "20261024_device_tokens"
branch_labels = None
depends_on = None

LEVELS = "('MINOR', 'MODERATE', 'MAJOR')"


def upgrade() -> None:
    # batch_alter_table để chạy được cả trên SQLite (thêm CHECK/FK cần tạo lại bảng).
    with op.batch_alter_table("change_requests") as batch:
        batch.add_column(sa.Column("impact_level", sa.String(16), server_default="MODERATE", nullable=False))
        batch.add_column(sa.Column("impact_level_confirmed_by_id", sa.Integer(), nullable=True))
        batch.add_column(sa.Column("impact_level_confirmed_at", sa.DateTime(timezone=True), nullable=True))
        batch.add_column(sa.Column("impact_level_change_reason", sa.Text(), nullable=True))
        batch.create_foreign_key(
            "fk_change_requests_impact_level_confirmed_by", "users",
            ["impact_level_confirmed_by_id"], ["id"],
        )
        batch.create_check_constraint("ck_change_requests_impact_level", f"impact_level IN {LEVELS}")

    # CR có sẵn: hệ thống chốt mức MODERATE.
    op.execute("UPDATE change_requests SET impact_level_confirmed_at = CURRENT_TIMESTAMP")

    with op.batch_alter_table("impact_reports") as batch:
        batch.add_column(sa.Column("revision", sa.Integer(), server_default="1", nullable=False))
        batch.add_column(sa.Column("source", sa.String(8), server_default="AI", nullable=False))
        batch.add_column(sa.Column("suggested_impact_level", sa.String(16), nullable=True))
        batch.add_column(sa.Column("impact_level_rationale", sa.Text(), nullable=True))
        batch.add_column(sa.Column("created_by_id", sa.Integer(), nullable=True))
        batch.create_foreign_key("fk_impact_reports_created_by", "users", ["created_by_id"], ["id"])
        batch.create_check_constraint("ck_impact_reports_source", "source IN ('AI', 'MANUAL')")
        batch.create_check_constraint(
            "ck_impact_reports_suggested_level",
            f"suggested_impact_level IS NULL OR suggested_impact_level IN {LEVELS}",
        )

    with op.batch_alter_table("approvals") as batch:
        batch.add_column(sa.Column("impact_level_at_decision", sa.String(16), nullable=True))
        batch.add_column(sa.Column("acknowledged_report_revision", sa.Integer(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("approvals") as batch:
        batch.drop_column("acknowledged_report_revision")
        batch.drop_column("impact_level_at_decision")

    with op.batch_alter_table("impact_reports") as batch:
        batch.drop_constraint("ck_impact_reports_suggested_level", type_="check")
        batch.drop_constraint("ck_impact_reports_source", type_="check")
        batch.drop_constraint("fk_impact_reports_created_by", type_="foreignkey")
        batch.drop_column("created_by_id")
        batch.drop_column("impact_level_rationale")
        batch.drop_column("suggested_impact_level")
        batch.drop_column("source")
        batch.drop_column("revision")

    with op.batch_alter_table("change_requests") as batch:
        batch.drop_constraint("ck_change_requests_impact_level", type_="check")
        batch.drop_constraint("fk_change_requests_impact_level_confirmed_by", type_="foreignkey")
        batch.drop_column("impact_level_change_reason")
        batch.drop_column("impact_level_confirmed_at")
        batch.drop_column("impact_level_confirmed_by_id")
        batch.drop_column("impact_level")
