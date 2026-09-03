"""Thêm các bảng chat_messages và chat_read_states (chat nhóm theo phạm vi project).

Revision ID: 20260821_chat_tables
Revises: 20260821_task_notify_columns
Create Date: 2026-08-21
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "20260821_chat_tables"
down_revision: Union[str, None] = "20260821_task_notify_columns"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "chat_messages",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(
        "ix_chat_messages_project_created", "chat_messages", ["project_id", "created_at"]
    )

    op.create_table(
        "chat_read_states",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column(
            "last_read_message_id",
            sa.Integer(),
            sa.ForeignKey("chat_messages.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("last_read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("project_id", "user_id", name="uq_chat_read_state_project_user"),
    )


def downgrade() -> None:
    op.drop_table("chat_read_states")
    op.drop_index("ix_chat_messages_project_created", table_name="chat_messages")
    op.drop_table("chat_messages")
