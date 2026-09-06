"""Thêm audit_logs.project_id để feed hoạt động lọc được theo dự án.

Nếu không có cột này thì không có cách nào lọc dòng audit theo dự án, và
DashboardService._recent_activity buộc phải trả về các thay đổi mới nhất của
toàn hệ thống cho bất kỳ ai đã đăng nhập.

Các dòng có sẵn được backfill ở những chỗ suy ra được (Task -> project_id,
Project -> chính entity_id). Phần còn lại giữ NULL và bị loại khỏi feed, đó là
lựa chọn an toàn: thà giấu lịch sử cũ còn hơn lộ nó cho nhầm người.

Revision ID: 20260904_audit_project_scope
Revises: 20260821_chat_tables
Create Date: 2026-09-04
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "20260904_audit_project_scope"
down_revision: Union[str, None] = "20260821_chat_tables"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "audit_logs",
        sa.Column("project_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_audit_logs_project_id",
        "audit_logs",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index(
        "ix_audit_project_created",
        "audit_logs",
        ["project_id", "created_at"],
        unique=False,
    )

    # Backfill: dòng audit của Task suy ra được dự án qua chính bảng tasks.
    op.execute(
        """
        UPDATE audit_logs AS a
        SET project_id = t.project_id
        FROM tasks AS t
        WHERE a.entity_type = 'Task' AND a.entity_id = t.id
        """
    )
    # Dòng audit của Project thì entity_id chính là project id.
    op.execute(
        """
        UPDATE audit_logs AS a
        SET project_id = p.id
        FROM projects AS p
        WHERE a.entity_type = 'Project' AND a.entity_id = p.id
        """
    )
    # Phase / Sprint / Milestone / Epic cũng trỏ thẳng tới dự án.
    for entity, table in (
        ("Phase", "phases"),
        ("Sprint", "sprints"),
        ("Milestone", "milestones"),
        ("Epic", "epics"),
    ):
        op.execute(
            f"""
            UPDATE audit_logs AS a
            SET project_id = e.project_id
            FROM {table} AS e
            WHERE a.entity_type = '{entity}' AND a.entity_id = e.id
            """
        )


def downgrade() -> None:
    op.drop_index("ix_audit_project_created", table_name="audit_logs")
    op.drop_constraint("fk_audit_logs_project_id", "audit_logs", type_="foreignkey")
    op.drop_column("audit_logs", "project_id")
