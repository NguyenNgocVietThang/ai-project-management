"""Index cho khoá ngoại và các đường truy vấn nóng.

Postgres không tự tạo index cho khoá ngoại. Trước migration này, phases, sprints,
epics, milestones và subtasks chỉ có index trên khoá chính — thứ không giúp gì cho
`WHERE project_id = ?`, tức là đúng truy vấn mà wbs_service và scheduling_service
chạy ở mọi thao tác ghi.

Cũng sửa chiều index của chat (history sắp xếp theo id, không phải created_at) và
đưa cột labels về JSONB cho khớp với model, để `.contains()` sinh ra toán tử
containment thay vì âm thầm rơi về so khớp chuỗi.

Revision ID: 20260904_perf_indexes
Revises: 20260904_audit_project_scope
Create Date: 2026-09-04
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260904_perf_indexes"
down_revision: Union[str, None] = "20260904_audit_project_scope"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

FK_INDEXES = [
    ("ix_phases_project_order", "phases", ["project_id", "order_index"]),
    ("ix_sprints_project", "sprints", ["project_id"]),
    ("ix_sprints_phase", "sprints", ["phase_id"]),
    ("ix_epics_project", "epics", ["project_id"]),
    ("ix_milestones_project_due", "milestones", ["project_id", "due_date"]),
    ("ix_subtasks_task", "subtasks", ["task_id"]),
    ("ix_tasks_phase", "tasks", ["phase_id"]),
    ("ix_tasks_epic", "tasks", ["epic_id"]),
    ("ix_tasks_start_notify", "tasks", ["start_date", "last_start_notified_at"]),
    ("ix_tasks_due_notify", "tasks", ["due_date", "last_due_soon_notified_at"]),
]


def upgrade() -> None:
    for name, table, columns in FK_INDEXES:
        op.create_index(name, table, columns, unique=False)

    # Lịch sử chat được phân trang bằng `id < before_id ORDER BY id DESC`; index
    # theo created_at không phục vụ được thứ tự đó.
    op.drop_index("ix_chat_messages_project_created", table_name="chat_messages")
    op.execute(
        "CREATE INDEX ix_chat_messages_project_id_desc "
        "ON chat_messages (project_id, id DESC)"
    )

    # Cột vốn đã là JSONB từ migration 20260814; model thì khai JSON. Câu lệnh này
    # là no-op trên schema đã đúng, nhưng khiến hai bên khớp nhau một cách tường minh.
    op.alter_column(
        "tasks",
        "labels",
        type_=postgresql.JSONB(astext_type=sa.Text()),
        postgresql_using="labels::jsonb",
        existing_nullable=False,
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_chat_messages_project_id_desc")
    op.create_index(
        "ix_chat_messages_project_created", "chat_messages", ["project_id", "created_at"]
    )
    for name, table, _ in reversed(FK_INDEXES):
        op.drop_index(name, table_name=table)
