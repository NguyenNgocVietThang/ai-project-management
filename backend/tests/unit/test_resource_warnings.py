"""Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test."""
from datetime import date, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

import app.db.base  # noqa: F401 - dang ky quan he SQLAlchemy
from app.core.config import settings
from app.services.resource_service import ResourceService


def _service(assignments, leaves=()):
    db = AsyncMock()
    db.execute = AsyncMock(return_value=SimpleNamespace(all=lambda: assignments))
    db.scalars = AsyncMock(return_value=SimpleNamespace(all=lambda: list(leaves)))
    return ResourceService(db)


def _assignment(hours, start, end, task_id=1):
    assignment = SimpleNamespace(
        allocated_hours=hours, start_date=start, end_date=end, user_id=1
    )
    task = SimpleNamespace(id=task_id, start_date=start, due_date=end)
    return (assignment, task)


@pytest.mark.asyncio
async def test_a_reasonable_workload_raises_nothing():
    day = date(2026, 3, 2)
    service = _service([_assignment(4.0, day, day)])

    assert await service.workload_warnings(1, day, day) == []


@pytest.mark.asyncio
async def test_more_hours_than_a_day_holds_is_flagged():
    day = date(2026, 3, 2)
    over = settings.MAX_DAILY_WORK_HOURS + 4
    service = _service([_assignment(over, day, day)])

    warnings = await service.workload_warnings(1, day, day)

    assert len(warnings) == 1
    assert warnings[0].reason == "overloaded"
    assert warnings[0].total_hours == over


@pytest.mark.asyncio
async def test_hours_are_spread_across_the_assignment_window():
    """40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai."""
    start = date(2026, 3, 2)
    end = start + timedelta(days=9)
    service = _service([_assignment(40.0, start, end)])

    assert await service.workload_warnings(1, start, end) == []


@pytest.mark.asyncio
async def test_concurrent_assignments_add_up():
    """Moi assignment rieng le deu on; van de nam o cho chung chong len nhau."""
    day = date(2026, 3, 2)
    half = settings.MAX_DAILY_WORK_HOURS * 0.75
    service = _service([_assignment(half, day, day, 1), _assignment(half, day, day, 2)])

    warnings = await service.workload_warnings(1, day, day)

    assert len(warnings) == 1
    assert warnings[0].task_ids == [1, 2], "canh bao phai chi ra cong viec nao gay ra no"


@pytest.mark.asyncio
async def test_work_assigned_during_approved_leave_is_flagged():
    day = date(2026, 3, 2)
    leave = SimpleNamespace(start_date=day, end_date=day)
    service = _service([_assignment(2.0, day, day)], leaves=[leave])

    warnings = await service.workload_warnings(1, day, day)

    assert [warning.reason for warning in warnings] == ["on_leave"]


@pytest.mark.asyncio
async def test_leave_takes_precedence_over_overload():
    """Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon."""
    day = date(2026, 3, 2)
    leave = SimpleNamespace(start_date=day, end_date=day)
    service = _service(
        [_assignment(settings.MAX_DAILY_WORK_HOURS + 10, day, day)], leaves=[leave]
    )

    warnings = await service.workload_warnings(1, day, day)

    assert len(warnings) == 1
    assert warnings[0].reason == "on_leave"


@pytest.mark.asyncio
async def test_each_overloaded_day_is_reported_separately():
    start = date(2026, 3, 2)
    end = start + timedelta(days=2)
    over = (settings.MAX_DAILY_WORK_HOURS + 2) * 3
    service = _service([_assignment(over, start, end)])

    warnings = await service.workload_warnings(1, start, end)

    assert len(warnings) == 3
    assert [warning.date for warning in warnings] == [
        start,
        start + timedelta(days=1),
        end,
    ]
