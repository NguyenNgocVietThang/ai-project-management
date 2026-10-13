"""Thêm bảng generated_documents cho tài liệu SRS/BRD do AI sinh theo nhóm mục (D2).

Revision ID: 20261013_generated_documents
Revises: 20261013_approval_chain
"""

import sqlalchemy as sa

from alembic import op

revision = "20261013_generated_documents"
down_revision = "20261013_approval_chain"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "generated_documents",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("brief_id", sa.Integer(), sa.ForeignKey("requirement_briefs.id", ondelete="SET NULL")),
        sa.Column("doc_type", sa.String(8), nullable=False),
        sa.Column("language", sa.String(2), nullable=False, server_default="vi"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("status", sa.String(24), nullable=False, server_default="queued"),
        sa.Column("section_groups", sa.JSON(), nullable=False),
        sa.Column("sections", sa.JSON(), nullable=False),
        sa.Column("missing_items", sa.JSON()),
        sa.Column("warnings", sa.JSON(), nullable=False),
        sa.Column("storage_key", sa.Text()),
        sa.Column("file_size", sa.Integer()),
        sa.Column("error_code", sa.String(64)),
        sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="SET NULL")),
        sa.Column("created_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("doc_type IN ('SRS', 'BRD')", name="ck_generated_documents_doc_type"),
        sa.CheckConstraint("language IN ('vi', 'en')", name="ck_generated_documents_language"),
        sa.CheckConstraint(
            "status IN ('queued', 'generating', 'needs_clarification', 'ready', 'failed')",
            name="ck_generated_documents_status",
        ),
        sa.CheckConstraint("version >= 1", name="ck_generated_documents_version"),
        sa.UniqueConstraint(
            "project_id", "doc_type", "language", "version", name="uq_generated_documents_version"
        ),
    )
    op.create_index("ix_generated_documents_id", "generated_documents", ["id"])
    op.create_index("ix_generated_documents_project", "generated_documents", ["project_id", "created_at"])
    if op.get_bind().dialect.name == "postgresql":
        # Nội dung tài liệu là dữ liệu nghiệp vụ riêng tư; schema public của Supabase mở
        # qua Data API nên chỉ chủ bảng (backend) được truy cập.
        op.execute("ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE generated_documents FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE generated_documents_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE generated_documents FROM %I', api_role);
                        EXECUTE format(
                            'REVOKE ALL ON SEQUENCE generated_documents_id_seq FROM %I', api_role
                        );
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_table("generated_documents")
