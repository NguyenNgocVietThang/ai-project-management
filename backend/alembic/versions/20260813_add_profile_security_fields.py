"""add profile storage and auth version fields

Revision ID: 20260813_profile_security
Revises: 20260812_email_verification
Create Date: 2026-08-13 09:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "20260813_profile_security"
down_revision: Union[str, None] = "20260812_email_verification"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("auth_version", sa.Integer(), server_default="0", nullable=False),
    )
    op.add_column(
        "users",
        sa.Column("avatar_storage_key", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "avatar_storage_key")
    op.drop_column("users", "auth_version")
