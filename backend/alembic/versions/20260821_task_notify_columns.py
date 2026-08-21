"""Add task notification idempotency columns.

Revision ID: 20260821_task_notify_columns
Revises: 20260814_phase2_task_wbs
Create Date: 2026-08-21
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "20260821_task_notify_columns"
down_revision: Union[str, None] = "20260814_phase2_task_wbs"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column("last_start_notified_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "tasks",
        sa.Column("last_due_soon_notified_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("tasks", "last_due_soon_notified_at")
    op.drop_column("tasks", "last_start_notified_at")
