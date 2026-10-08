"""Gỡ đăng nhập Facebook: xoá cột users.facebook_id.

Tài khoản từng đăng nhập bằng Facebook được chuyển `auth_provider` về phương thức còn
lại (mật khẩu hoặc Google) để dữ liệu không trỏ tới một provider không còn tồn tại.
Tài khoản chỉ có Facebook (không mật khẩu, không Google) vẫn giữ nguyên hàng; người
dùng khôi phục quyền truy cập bằng luồng quên mật khẩu nếu email của họ là email thật.

Downgrade chỉ dựng lại cột và index; giá trị `facebook_id` đã xoá không khôi phục được.

Revision ID: 20261008_drop_facebook_login
Revises: 20260904_perf_indexes
Create Date: 2026-10-08
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "20261008_drop_facebook_login"
down_revision: Union[str, None] = "20260904_perf_indexes"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE users
        SET auth_provider = CASE
            WHEN hashed_password IS NOT NULL THEN 'local'
            WHEN google_id IS NOT NULL THEN 'google'
            ELSE auth_provider
        END
        WHERE auth_provider = 'facebook'
        """
    )
    op.drop_index(op.f("ix_users_facebook_id"), table_name="users")
    op.drop_column("users", "facebook_id")


def downgrade() -> None:
    op.add_column("users", sa.Column("facebook_id", sa.String(length=255), nullable=True))
    op.create_index(op.f("ix_users_facebook_id"), "users", ["facebook_id"], unique=True)
