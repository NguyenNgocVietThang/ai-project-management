"""Thêm cột tasks.archived_at (V3 rollback phiên bản).

Task không còn trong snapshot nhưng có dữ liệu phụ thuộc (worklog/comment/subtask/assignment)
được lưu trữ thay vì xóa cứng. Index (project_id, archived_at) phục vụ lọc task chưa lưu trữ.
"""

import sqlalchemy as sa

from alembic import op

revision = "20261013_task_archived_at"
down_revision = "20261013_generated_documents"
branch_labels = None
depends_on = None

INDEX_NAME = "ix_tasks_project_archived"


def upgrade() -> None:
    with op.batch_alter_table("tasks") as batch:
        batch.add_column(sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index(INDEX_NAME, "tasks", ["project_id", "archived_at"])


def downgrade() -> None:
    op.drop_index(INDEX_NAME, table_name="tasks")
    with op.batch_alter_table("tasks") as batch:
        batch.drop_column("archived_at")
