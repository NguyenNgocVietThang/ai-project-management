from datetime import date, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.notification import NotificationType
from app.models.task import TaskStatus
from app.workers.notification_tasks import DUE_SOON_DAYS_AHEAD, sweep_task_dates


@pytest.mark.asyncio
async def test_sweep_notifies_starting_and_due_soon_tasks_and_stamps_idempotency():
    today = date.today()
    starting_task = SimpleNamespace(
        id=1,
        project_id=10,
        name="Kickoff",
        status=TaskStatus.TODO,
        start_date=today,
        due_date=None,
        last_start_notified_at=None,
    )
    due_task = SimpleNamespace(
        id=2,
        project_id=11,
        name="Wrap up",
        status=TaskStatus.IN_PROGRESS,
        start_date=None,
        due_date=today + timedelta(days=DUE_SOON_DAYS_AHEAD),
        last_due_soon_notified_at=None,
    )
    scalars_results = [
        SimpleNamespace(all=Mock(return_value=[starting_task])),
        SimpleNamespace(all=Mock(return_value=[due_task])),
    ]
    db = SimpleNamespace(scalars=AsyncMock(side_effect=scalars_results))

    with patch(
        "app.workers.notification_tasks.notify_project_team", new=AsyncMock()
    ) as notify_mock:
        result = await sweep_task_dates(db)

    assert result == {"started_notified": 1, "due_soon_notified": 1}
    assert notify_mock.await_count == 2
    assert starting_task.last_start_notified_at is not None
    assert due_task.last_due_soon_notified_at is not None
    ntypes = {call.kwargs["ntype"] for call in notify_mock.call_args_list}
    assert NotificationType.SYSTEM in ntypes
    assert NotificationType.TASK_DUE_SOON in ntypes


@pytest.mark.asyncio
async def test_sweep_is_noop_when_nothing_matches():
    scalars_results = [
        SimpleNamespace(all=Mock(return_value=[])),
        SimpleNamespace(all=Mock(return_value=[])),
    ]
    db = SimpleNamespace(scalars=AsyncMock(side_effect=scalars_results))

    with patch(
        "app.workers.notification_tasks.notify_project_team", new=AsyncMock()
    ) as notify_mock:
        result = await sweep_task_dates(db)

    assert result == {"started_notified": 0, "due_soon_notified": 0}
    notify_mock.assert_not_awaited()
