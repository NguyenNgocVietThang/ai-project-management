"""So hoc cua dashboard_service - 544 dong truoc day khong co test nao.

Day cung la file chua lo ro ri audit log; viec no dung ngoai moi bai test la mot
phan ly do lo hong do lot luoi.
"""
from datetime import date, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

import app.db.base  # noqa: F401 - dang ky quan he SQLAlchemy
from app.services.dashboard_service import DashboardService


def _service_with_rows(rows):
    """DashboardService voi mot execute() tra ve `rows` da dinh san."""
    db = AsyncMock()
    db.execute = AsyncMock(return_value=SimpleNamespace(all=lambda: rows))
    db.scalar = AsyncMock(return_value=0)
    return DashboardService(db)


@pytest.mark.asyncio
async def test_burndown_accumulates_completions_across_the_window():
    today = date.today()
    completions = [
        (today - timedelta(days=10), 2),
        (today - timedelta(days=5), 3),
    ]
    service = _service_with_rows(completions)

    points = await service._burndown(project_id=1, total_tasks=10, today=today)

    assert len(points) == 14
    # Truoc ngay hoan thanh dau tien: chua tru gi.
    assert points[0].remaining == 10.0
    # Sau ca hai moc: 10 - (2 + 3).
    assert points[-1].remaining == 5.0


@pytest.mark.asyncio
async def test_burndown_counts_work_finished_before_the_window_opens():
    """Neu khong, mot du an gan xong lai hien ra nhu chua bat dau."""
    today = date.today()
    service = _service_with_rows([(today - timedelta(days=60), 7)])

    points = await service._burndown(project_id=1, total_tasks=10, today=today)

    assert points[0].remaining == 3.0


@pytest.mark.asyncio
async def test_burndown_never_reports_negative_work_remaining():
    today = date.today()
    service = _service_with_rows([(today - timedelta(days=1), 99)])

    points = await service._burndown(project_id=1, total_tasks=10, today=today)

    assert all(point.remaining >= 0 for point in points)


@pytest.mark.asyncio
async def test_the_ideal_line_runs_from_the_total_down_to_zero():
    today = date.today()
    service = _service_with_rows([])

    points = await service._burndown(project_id=1, total_tasks=14, today=today)

    assert points[0].ideal == 13.0
    assert points[-1].ideal == 0.0


@pytest.mark.asyncio
async def test_team_utilisation_is_empty_without_members():
    """Duong thoat som phai chay truoc cac truy van gop, khong phai sau."""
    db = AsyncMock()
    db.execute = AsyncMock(return_value=SimpleNamespace(all=lambda: []))
    service = DashboardService(db)

    assert await service._team_utilization(project_id=1, pm_id=1) == []


@pytest.mark.asyncio
async def test_team_utilisation_uses_grouped_queries_not_one_per_member():
    """Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day
    ton 91 round-trip moi lan mo dashboard."""
    members = [
        SimpleNamespace(id=1, full_name="A", avatar_url=None),
        SimpleNamespace(id=2, full_name="B", avatar_url=None),
        SimpleNamespace(id=3, full_name="C", avatar_url=None),
    ]
    responses = [
        members,        # danh sach thanh vien
        [(1, 5)],       # so task theo assignment
        [],             # task chi co assignee_id
        [(1, 12.5)],    # gio da ghi
        [(2, 8.0)],     # gio uoc luong
    ]
    calls = {"n": 0}

    async def execute(_stmt):
        index = calls["n"]
        calls["n"] += 1
        return SimpleNamespace(all=lambda: responses[index])

    db = AsyncMock()
    db.execute = execute
    service = DashboardService(db)

    result = await service._team_utilization(project_id=1, pm_id=1)

    assert len(result) == 3
    assert calls["n"] <= 5, f"so truy van phai co dinh, khong theo so thanh vien: {calls['n']}"
    assert result[0].task_count == 5
    assert result[0].logged_hours == 12.5
    assert result[1].estimated_hours == 8.0
    # Thanh vien khong co du lieu van xuat hien, voi so 0.
    assert result[2].task_count == 0
