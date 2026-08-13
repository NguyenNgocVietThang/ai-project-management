"""Add Portfolio and Project Phase 1 core fields.

Revision ID: 20260813_portfolio_project_core
Revises: 20260813_profile_security
Create Date: 2026-08-13
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260813_portfolio_project_core"
down_revision: Union[str, None] = "20260813_profile_security"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    methodology_enum = postgresql.ENUM(
        "agile",
        "waterfall",
        "hybrid",
        name="projectmethodology",
    )
    methodology_enum.create(op.get_bind(), checkfirst=True)

    op.add_column("portfolios", sa.Column("start_date", sa.Date(), nullable=True))
    op.add_column("portfolios", sa.Column("end_date", sa.Date(), nullable=True))
    op.add_column(
        "portfolios",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        "ix_portfolios_owner_deleted",
        "portfolios",
        ["owner_id", "deleted_at"],
        unique=False,
    )
    op.create_index(
        "ix_portfolios_status_deleted",
        "portfolios",
        ["status", "deleted_at"],
        unique=False,
    )

    op.add_column(
        "projects",
        sa.Column(
            "methodology",
            postgresql.ENUM(
                "agile",
                "waterfall",
                "hybrid",
                name="projectmethodology",
                create_type=False,
            ),
            server_default="agile",
            nullable=False,
        ),
    )
    op.alter_column("projects", "methodology", server_default=None)
    op.add_column(
        "projects",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        "ix_projects_pm_deleted",
        "projects",
        ["pm_id", "deleted_at"],
        unique=False,
    )
    op.create_index(
        "ix_projects_portfolio_deleted",
        "projects",
        ["portfolio_id", "deleted_at"],
        unique=False,
    )

    op.add_column("project_members", sa.Column("role_id", sa.Integer(), nullable=True))
    op.add_column(
        "project_members",
        sa.Column(
            "joined_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_foreign_key(
        "fk_project_members_role_id_roles",
        "project_members",
        "roles",
        ["role_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.execute(
        """
        UPDATE project_members AS pm
        SET role_id = roles.id
        FROM roles
        WHERE lower(roles.name) = lower(pm.role_in_project)
        """
    )
    op.execute(
        """
        UPDATE project_members
        SET role_id = (SELECT id FROM roles WHERE name = 'Member' LIMIT 1)
        WHERE role_id IS NULL
        """
    )
    op.execute(
        """
        INSERT INTO project_members (project_id, user_id, role_id, joined_at)
        SELECT projects.id, projects.pm_id, roles.id, projects.created_at
        FROM projects
        CROSS JOIN roles
        WHERE roles.name = 'PM'
        ON CONFLICT (project_id, user_id) DO NOTHING
        """
    )
    op.execute(
        """
        UPDATE project_members AS pm
        SET role_id = roles.id
        FROM projects, roles
        WHERE pm.project_id = projects.id
          AND pm.user_id = projects.pm_id
          AND roles.name = 'PM'
        """
    )
    op.alter_column("project_members", "role_id", nullable=False)
    op.create_index(
        "ix_project_members_role_id",
        "project_members",
        ["role_id"],
        unique=False,
    )
    op.drop_column("project_members", "role_in_project")

    op.execute(
        """
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT roles.id, permissions.id
        FROM roles
        CROSS JOIN permissions
        WHERE roles.name = 'PM'
          AND permissions.resource IN ('portfolio', 'project')
          AND permissions.action = 'delete'
        ON CONFLICT (role_id, permission_id) DO NOTHING
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM role_permissions
        USING roles, permissions
        WHERE role_permissions.role_id = roles.id
          AND role_permissions.permission_id = permissions.id
          AND roles.name = 'PM'
          AND permissions.resource IN ('portfolio', 'project')
          AND permissions.action = 'delete'
        """
    )
    op.add_column(
        "project_members",
        sa.Column("role_in_project", sa.String(length=100), nullable=True),
    )
    op.execute(
        """
        UPDATE project_members AS pm
        SET role_in_project = roles.name
        FROM roles
        WHERE roles.id = pm.role_id
        """
    )
    op.drop_index("ix_project_members_role_id", table_name="project_members")
    op.drop_constraint(
        "fk_project_members_role_id_roles",
        "project_members",
        type_="foreignkey",
    )
    op.drop_column("project_members", "joined_at")
    op.drop_column("project_members", "role_id")

    op.drop_index("ix_projects_portfolio_deleted", table_name="projects")
    op.drop_index("ix_projects_pm_deleted", table_name="projects")
    op.drop_column("projects", "deleted_at")
    op.drop_column("projects", "methodology")
    postgresql.ENUM(name="projectmethodology").drop(op.get_bind(), checkfirst=True)

    op.drop_index("ix_portfolios_status_deleted", table_name="portfolios")
    op.drop_index("ix_portfolios_owner_deleted", table_name="portfolios")
    op.drop_column("portfolios", "deleted_at")
    op.drop_column("portfolios", "end_date")
    op.drop_column("portfolios", "start_date")
