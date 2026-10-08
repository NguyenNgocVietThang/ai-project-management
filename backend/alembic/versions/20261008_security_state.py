"""Keep revocation, one-time auth codes and abuse counters durable and server-only."""

import sqlalchemy as sa

from alembic import op

revision = "20261008_security_state"
down_revision = "20261008_durable_jobs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "security_states",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("namespace", sa.String(40), nullable=False),
        sa.Column("key_hash", sa.String(64), nullable=False),
        sa.Column("payload", sa.JSON(none_as_null=True)),
        sa.Column("counter", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("namespace", "key_hash", name="uq_security_states_key"),
        sa.CheckConstraint("counter >= 0", name="ck_security_states_counter"),
    )
    op.create_index("ix_security_states_id", "security_states", ["id"])
    op.create_index("ix_security_states_expiry", "security_states", ["expires_at"])
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TABLE security_states ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE security_states FROM PUBLIC")
        # Supabase default grants must not expose tokens or PKCE through its Data API.
        op.execute("""DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
                REVOKE ALL ON TABLE security_states FROM anon;
            END IF;
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
                REVOKE ALL ON TABLE security_states FROM authenticated;
            END IF;
        END $$""")


def downgrade() -> None:
    op.drop_table("security_states")
