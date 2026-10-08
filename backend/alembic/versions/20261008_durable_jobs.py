"""Add transactional durable jobs/outbox.

Revision ID: 20261008_durable_jobs
Revises: 20261008_drop_facebook_login
"""

import sqlalchemy as sa

from alembic import op

revision = "20261008_durable_jobs"
down_revision = "20261008_drop_facebook_login"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column("kind", sa.String(64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("dedupe_key", sa.String(255), nullable=False),
        sa.Column("status", sa.String(16), nullable=False, server_default="queued"),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="SET NULL")),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("max_attempts", sa.Integer(), nullable=False, server_default="3"),
        sa.Column("generation", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("available_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("lease_token", sa.String(36)),
        sa.Column("lease_generation", sa.Integer()),
        sa.Column("lease_expires_at", sa.DateTime(timezone=True)),
        sa.Column("error_code", sa.String(64)),
        sa.Column("result", sa.JSON(none_as_null=True)),
        sa.Column("staged_result", sa.JSON(none_as_null=True)),
        sa.Column("request_dispatched", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("request_dispatched_at", sa.DateTime(timezone=True)),
        sa.Column(
            "ambiguous_on_lease_loss", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.UniqueConstraint("dedupe_key", name="uq_jobs_dedupe_key"),
        sa.CheckConstraint(
            "status IN ('queued', 'running', 'succeeded', 'failed')", name="ck_jobs_status"
        ),
        sa.CheckConstraint(
            "attempts >= 0 AND max_attempts > 0 AND generation > 0", name="ck_jobs_attempts"
        ),
    )
    op.create_index("ix_jobs_id", "jobs", ["id"])
    op.create_index("ix_jobs_ready", "jobs", ["status", "available_at", "id"])
    op.create_index("ix_jobs_lease", "jobs", ["status", "lease_expires_at"])
    op.create_index("ix_jobs_owner", "jobs", ["owner_id", "created_at"])
    if op.get_bind().dialect.name == "postgresql":
        # Outbox payloads contain private mail and provider results. Supabase's
        # public schema is exposed to Data APIs; only the backend table owner
        # should access these rows. Owner connections bypass ordinary RLS.
        op.execute("ALTER TABLE jobs ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE jobs FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE jobs_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE jobs FROM %I', api_role);
                        EXECUTE format('REVOKE ALL ON SEQUENCE jobs_id_seq FROM %I', api_role);
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_table("jobs")
