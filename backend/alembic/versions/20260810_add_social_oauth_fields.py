"""add_social_oauth_fields

Revision ID: 20260810_social_oauth
Revises: 13e3544bef02
Create Date: 2026-08-10 23:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# định danh revision, được Alembic sử dụng.
revision: str = '20260810_social_oauth'
down_revision: Union[str, None] = '13e3544bef02'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('google_id', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)
    
    op.add_column('users', sa.Column('facebook_id', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_users_facebook_id'), 'users', ['facebook_id'], unique=True)
    
    op.add_column('users', sa.Column('auth_provider', sa.String(length=50), server_default='local', nullable=False))
    
    op.alter_column('users', 'hashed_password', existing_type=sa.Text(), nullable=True)


def downgrade() -> None:
    op.alter_column('users', 'hashed_password', existing_type=sa.Text(), nullable=False)
    
    op.drop_column('users', 'auth_provider')
    
    op.drop_index(op.f('ix_users_facebook_id'), table_name='users')
    op.drop_column('users', 'facebook_id')
    
    op.drop_index(op.f('ix_users_google_id'), table_name='users')
    op.drop_column('users', 'google_id')
