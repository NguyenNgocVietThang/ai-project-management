"""Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy được.

Trước đây `_recent_activity` nhận `project_ids` nhưng chỉ dùng nó cho câu lệnh
thoát sớm — mệnh đề WHERE không hề lọc theo dự án, nên bất kỳ ai đã đăng nhập gọi
GET /dashboards/summary đều nhận 15 dòng audit mới nhất của TOÀN hệ thống, kèm mô
tả và tên người thực hiện của những dự án họ không thuộc về.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import select

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.audit_log import AuditLog
from app.services.dashboard_service import DashboardService


def _captured_where_text(execute_mock) -> str:
    statement = execute_mock.await_args.args[0]
    return str(statement.whereclause)


@pytest.mark.asyncio
async def test_recent_activity_filters_by_visible_projects():
    execute = AsyncMock(return_value=SimpleNamespace(all=lambda: []))
    service = DashboardService(SimpleNamespace(execute=execute))

    await service._recent_activity([3, 9])

    execute.assert_awaited_once()
    where = _captured_where_text(execute)
    assert "audit_logs.project_id IN" in where, (
        "truy vấn phải lọc theo project_id, nếu không feed sẽ lộ hoạt động "
        f"của mọi dự án; where hiện tại: {where}"
    )


@pytest.mark.asyncio
async def test_recent_activity_returns_nothing_without_visible_projects():
    execute = AsyncMock()
    service = DashboardService(SimpleNamespace(execute=execute))

    assert await service._recent_activity([]) == []
    execute.assert_not_awaited()


def test_audit_log_records_the_project_it_belongs_to():
    """Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu."""
    assert "project_id" in AuditLog.__table__.columns
    # Được điền tự động từ request context, giống ip_address.
    assert AuditLog.__table__.c.project_id.default is not None


def test_audit_log_is_indexed_for_the_activity_feed():
    index_names = {index.name for index in AuditLog.__table__.indexes}
    assert "ix_audit_project_created" in index_names


def test_project_id_default_reads_the_request_context():
    from app.core.request_context import get_current_project_id, set_current_project_id

    set_current_project_id(None)
    assert get_current_project_id() is None
    set_current_project_id(17)
    try:
        assert AuditLog.__table__.c.project_id.default.arg({}) == 17
    finally:
        set_current_project_id(None)


def test_select_over_audit_logs_still_compiles():
    """Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới."""
    statement = select(AuditLog).where(AuditLog.project_id.in_([1, 2]))
    assert "audit_logs.project_id IN" in str(statement)
