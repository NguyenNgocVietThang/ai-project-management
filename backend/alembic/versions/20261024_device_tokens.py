"""Bảng device_tokens cho push notification tới app di động.

Revision ID: 20261024_device_tokens
Revises: 20261016_investor_portal
"""

import sqlalchemy as sa

from alembic import op

revision = "20261024_device_tokens"
down_revision = "20261016_investor_portal"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "device_tokens",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token", sa.String(512), nullable=False),
        sa.Column("platform", sa.String(16), nullable=False),
        sa.Column("app_version", sa.String(32)),
        sa.Column("locale", sa.String(8), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("platform IN ('android', 'ios')", name="ck_device_tokens_platform"),
        sa.CheckConstraint("locale IN ('vi', 'en')", name="ck_device_tokens_locale"),
        sa.UniqueConstraint("token", name="uq_device_tokens_token"),
    )
    op.create_index("ix_device_tokens_id", "device_tokens", ["id"])
    op.create_index("ix_device_tokens_user_active", "device_tokens", ["user_id", "revoked_at"])


def downgrade() -> None:
    op.drop_index("ix_device_tokens_user_active", table_name="device_tokens")
    op.drop_index("ix_device_tokens_id", table_name="device_tokens")
    op.drop_table("device_tokens")
