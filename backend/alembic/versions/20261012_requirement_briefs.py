"""Thêm bảng hồ sơ yêu cầu (requirement_briefs) cho luồng AI hỏi làm rõ.

Revision ID: 20261012_requirement_briefs
Revises: 20261008_security_state
"""

import sqlalchemy as sa

from alembic import op

revision = "20261012_requirement_briefs"
down_revision = "20261008_security_state"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "requirement_briefs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="SET NULL")),
        sa.Column("idea", sa.Text(), nullable=False),
        sa.Column("items", sa.JSON(), nullable=False),
        sa.Column("qa_history", sa.JSON(), nullable=False),
        sa.Column("turn_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(16), nullable=False, server_default="clarifying"),
        sa.Column(
            "last_ai_request_id",
            sa.Integer(),
            sa.ForeignKey("ai_requests.id", ondelete="SET NULL"),
        ),
        sa.Column("pending_job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="SET NULL")),
        sa.CheckConstraint(
            "status IN ('clarifying', 'ready', 'consumed')", name="ck_requirement_briefs_status"
        ),
        sa.CheckConstraint("turn_count >= 0", name="ck_requirement_briefs_turn_count"),
    )
    op.create_index("ix_requirement_briefs_id", "requirement_briefs", ["id"])
    op.create_index("ix_requirement_briefs_owner", "requirement_briefs", ["owner_id", "created_at"])
    op.create_index("ix_requirement_briefs_project", "requirement_briefs", ["project_id"])
    if op.get_bind().dialect.name == "postgresql":
        # Hồ sơ chứa ý tưởng kinh doanh riêng tư của người dùng; schema public của
        # Supabase mở qua Data API nên chỉ chủ bảng (backend) được truy cập.
        op.execute("ALTER TABLE requirement_briefs ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE requirement_briefs FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE requirement_briefs_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE requirement_briefs FROM %I', api_role);
                        EXECUTE format(
                            'REVOKE ALL ON SEQUENCE requirement_briefs_id_seq FROM %I', api_role
                        );
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_table("requirement_briefs")
