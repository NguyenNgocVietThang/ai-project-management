"""Hỗ trợ task, WBS, assignment và worklog cho Phase 2.

Revision ID: 20260814_phase2_task_wbs
Revises: 20260813_portfolio_project_core
Create Date: 2026-08-14
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260814_phase2_task_wbs"
down_revision: Union[str, None] = "20260813_portfolio_project_core"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column(
            "labels",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
    )
    op.alter_column("tasks", "labels", server_default=None)
    op.create_index("ix_tasks_labels", "tasks", ["labels"], unique=False, postgresql_using="gin")
    op.create_index("ix_tasks_due_date", "tasks", ["due_date"], unique=False)

    op.create_check_constraint(
        "chk_assignment_hours_nonnegative", "assignments", "allocated_hours >= 0"
    )
    op.create_check_constraint(
        "chk_assignment_percentage_range",
        "assignments",
        "allocation_percentage >= 0 AND allocation_percentage <= 100",
    )
    op.create_check_constraint(
        "chk_assignment_date_range",
        "assignments",
        "end_date IS NULL OR start_date IS NULL OR end_date >= start_date",
    )
    op.create_check_constraint("chk_worklog_hours_nonnegative", "worklogs", "hours >= 0")
    op.create_check_constraint(
        "chk_worklog_time_range",
        "worklogs",
        "end_time IS NULL OR start_time IS NULL OR end_time > start_time",
    )
    op.create_index(
        "uq_worklogs_active_timer_user",
        "worklogs",
        ["user_id"],
        unique=True,
        postgresql_where=sa.text("start_time IS NOT NULL AND end_time IS NULL"),
    )

    op.execute(
        """
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT roles.id, permissions.id
        FROM roles CROSS JOIN permissions
        WHERE (roles.name = 'BA' AND (permissions.resource, permissions.action) IN
               (('task','create'), ('task','update'), ('worklog','create'), ('worklog','update')))
           OR (roles.name = 'PM' AND permissions.resource = 'worklog'
               AND permissions.action IN ('create','update'))
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
          AND (
            (roles.name = 'BA' AND (permissions.resource, permissions.action) IN
             (('task','create'), ('task','update'), ('worklog','create'), ('worklog','update')))
            OR (roles.name = 'PM' AND permissions.resource = 'worklog'
                AND permissions.action IN ('create','update'))
          )
        """
    )
    op.drop_index("uq_worklogs_active_timer_user", table_name="worklogs")
    op.drop_constraint("chk_worklog_time_range", "worklogs", type_="check")
    op.drop_constraint("chk_worklog_hours_nonnegative", "worklogs", type_="check")
    op.drop_constraint("chk_assignment_date_range", "assignments", type_="check")
    op.drop_constraint("chk_assignment_percentage_range", "assignments", type_="check")
    op.drop_constraint("chk_assignment_hours_nonnegative", "assignments", type_="check")
    op.drop_index("ix_tasks_due_date", table_name="tasks")
    op.drop_index("ix_tasks_labels", table_name="tasks")
    op.drop_column("tasks", "labels")
