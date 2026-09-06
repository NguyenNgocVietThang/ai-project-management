"""Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi.

Không lỗi nào ở đây làm chương trình dừng: bộ lọc chỉ trả sai kết quả, truy vấn
chỉ chậm hơn, `autogenerate` chỉ lặng lẽ đề nghị xoá index. Tất cả đều cần được
khẳng định tường minh.
"""
from sqlalchemy import select
from sqlalchemy.dialects import postgresql

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.chat_message import ChatMessage
from app.models.epic import Epic
from app.models.milestone import Milestone
from app.models.phase import Phase
from app.models.sprint import Sprint
from app.models.subtask import Subtask
from app.models.task import Task


def _index_names(model) -> set[str]:
    return {index.name for index in model.__table__.indexes}


def test_label_filter_uses_jsonb_containment_not_string_matching():
    """Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc
    `?labels=` trên bảng Kanban không hoạt động và GIN index không bao giờ dùng tới."""
    sql = str(
        select(Task.id)
        .where(Task.labels.contains(["urgent"]))
        .compile(dialect=postgresql.dialect())
    )
    assert "@>" in sql
    assert "LIKE" not in sql.upper()


def test_labels_column_type_matches_the_database():
    assert isinstance(Task.__table__.c.labels.type, postgresql.JSONB)


def test_the_gin_index_on_labels_is_declared_on_the_model():
    """Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model,
    nên lần `alembic revision --autogenerate` kế tiếp sẽ sinh lệnh DROP nó."""
    assert "ix_tasks_labels" in _index_names(Task)


def test_foreign_keys_used_for_project_scoping_are_indexed():
    """Postgres không tự tạo index cho khoá ngoại; nếu thiếu, mọi truy vấn
    `WHERE project_id = ?` của wbs_service và scheduling_service là seq scan."""
    assert "ix_phases_project_order" in _index_names(Phase)
    assert {"ix_sprints_project", "ix_sprints_phase"} <= _index_names(Sprint)
    assert "ix_epics_project" in _index_names(Epic)
    assert "ix_milestones_project_due" in _index_names(Milestone)
    assert "ix_subtasks_task" in _index_names(Subtask)
    assert {"ix_tasks_phase", "ix_tasks_epic"} <= _index_names(Task)


def test_the_daily_sweep_query_is_indexed():
    """Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00."""
    assert {"ix_tasks_start_notify", "ix_tasks_due_notify"} <= _index_names(Task)


def test_chat_history_index_matches_the_order_it_is_read_in():
    """history() lọc theo project_id + id < before_id và ORDER BY id DESC; một
    index theo created_at không phục vụ được thứ tự đó."""
    names = _index_names(ChatMessage)
    assert "ix_chat_messages_project_id_desc" in names
    assert "ix_chat_messages_project_created" not in names


def test_audit_rows_can_be_filtered_by_project():
    from app.models.audit_log import AuditLog

    assert "ix_audit_project_created" in _index_names(AuditLog)
