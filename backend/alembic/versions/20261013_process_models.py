"""Thêm bảng process_models lưu quy trình nghiệp vụ do AI sinh (B2).

Revision ID: 20261013_process_models
Revises: 20261013_task_archived_at
"""

import sqlalchemy as sa

from alembic import op

revision = "20261013_process_models"
down_revision = "20261013_task_archived_at"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "process_models",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("brief_id", sa.Integer(), sa.ForeignKey("requirement_briefs.id", ondelete="SET NULL")),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("language", sa.String(2), nullable=False, server_default="vi"),
        sa.Column("model", sa.JSON(), nullable=False),
        sa.Column("warnings", sa.JSON(), nullable=False),
        sa.Column("created_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("ai_request_id", sa.Integer(), sa.ForeignKey("ai_requests.id", ondelete="SET NULL")),
        sa.CheckConstraint("language IN ('vi', 'en')", name="ck_process_models_language"),
        sa.CheckConstraint("version >= 1", name="ck_process_models_version"),
        sa.UniqueConstraint("project_id", "version", name="uq_process_models_version"),
        sa.UniqueConstraint("ai_request_id", name="uq_process_models_ai_request"),
    )
    op.create_index("ix_process_models_id", "process_models", ["id"])
    op.create_index("ix_process_models_project", "process_models", ["project_id", "version"])
    if op.get_bind().dialect.name == "postgresql":
        # Dữ liệu nghiệp vụ riêng tư; schema public của Supabase mở qua Data API nên chỉ
        # chủ bảng (backend) được truy cập.
        op.execute("ALTER TABLE process_models ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE process_models FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE process_models_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE process_models FROM %I', api_role);
                        EXECUTE format('REVOKE ALL ON SEQUENCE process_models_id_seq FROM %I', api_role);
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_table("process_models")
