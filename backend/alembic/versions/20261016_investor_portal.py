"""Cổng nhà đầu tư: bảng portfolio_investors và cột projects.expected_benefit.

Revision ID: 20261016_investor_portal
Revises: 20261013_process_models
"""

import sqlalchemy as sa

from alembic import op

revision = "20261016_investor_portal"
down_revision = "20261013_process_models"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "portfolio_investors",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("portfolio_id", sa.Integer(), sa.ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("granted_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.UniqueConstraint("portfolio_id", "user_id", name="uq_portfolio_investors_portfolio_user"),
    )
    op.create_index("ix_portfolio_investors_id", "portfolio_investors", ["id"])
    op.create_index("ix_portfolio_investors_user", "portfolio_investors", ["user_id"])
    op.add_column("projects", sa.Column("expected_benefit", sa.Float(), nullable=True))
    op.create_check_constraint(
        "ck_projects_expected_benefit_nonneg",
        "projects",
        "expected_benefit IS NULL OR expected_benefit >= 0",
    )
    if op.get_bind().dialect.name == "postgresql":
        # Quyền truy cập là dữ liệu nhạy cảm; schema public của Supabase mở qua Data API
        # nên chỉ chủ bảng (backend) được đọc/ghi.
        op.execute("ALTER TABLE portfolio_investors ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE portfolio_investors FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE portfolio_investors_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE portfolio_investors FROM %I', api_role);
                        EXECUTE format('REVOKE ALL ON SEQUENCE portfolio_investors_id_seq FROM %I', api_role);
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_constraint("ck_projects_expected_benefit_nonneg", "projects", type_="check")
    op.drop_column("projects", "expected_benefit")
    op.drop_table("portfolio_investors")
