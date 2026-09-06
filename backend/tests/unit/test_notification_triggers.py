from datetime import UTC, date, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.notification import NotificationType
from app.models.task import TaskStatus
from app.schemas.task import TaskStatusUpdate, TaskUpdate
from app.services.phase2_common import ProjectContext, notify_project_team
from app.services.task_service import TaskService


@pytest.mark.asyncio
async def test_notify_project_team_excludes_given_users():
    scalars_result = SimpleNamespace(all=Mock(return_value=[1, 2, 3]))
    db = SimpleNamespace(scalars=AsyncMock(return_value=scalars_result))

    with patch(
        "app.services.notification_service.NotificationService.push_many", new=AsyncMock()
    ) as push_mock:
        await notify_project_team(
            db,
            7,
            title="t",
            message="m",
            ntype=NotificationType.SYSTEM,
            exclude_user_ids={2},
        )

    # Một lời gọi cho cả nhóm, không phải một lời gọi cho mỗi người nhận: vòng lặp
    # cũ tốn một flush và một round-trip Redis cho từng thành viên.
    push_mock.assert_awaited_once()
    assert set(push_mock.await_args.args[1]) == {1, 3}


@pytest.mark.asyncio
async def test_notify_project_team_with_no_exclusions_notifies_everyone():
    scalars_result = SimpleNamespace(all=Mock(return_value=[5, 6]))
    db = SimpleNamespace(scalars=AsyncMock(return_value=scalars_result))

    with patch(
        "app.services.notification_service.NotificationService.push_many", new=AsyncMock()
    ) as push_mock:
        await notify_project_team(
            db, 1, title="t", message="m", ntype=NotificationType.SYSTEM
        )

    push_mock.assert_awaited_once()
    assert set(push_mock.await_args.args[1]) == {5, 6}


@pytest.mark.asyncio
async def test_task_update_notifies_team_on_significant_field_change():
    task = SimpleNamespace(
        id=5,
        project_id=7,
        name="Task A",
        status=TaskStatus.TODO,
        sprint_id=None,
        assignee_id=None,
        start_date=date(2026, 8, 1),
        due_date=date(2026, 8, 10),
        last_due_soon_notified_at=datetime(2026, 8, 1, tzinfo=UTC),
    )
    context = ProjectContext(project=SimpleNamespace(id=7), role="PM", is_admin=False)
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = TaskService(db)
    service._loaded_task = AsyncMock(return_value=task)
    service._response = AsyncMock(return_value=SimpleNamespace())
    actor = SimpleNamespace(id=1, full_name="Alice")

    with (
        patch(
            "app.services.task_service.get_task_context",
            AsyncMock(return_value=(task, context)),
        ),
        patch("app.services.task_service.recalculate_project", AsyncMock()),
        patch(
            "app.services.task_service.notify_project_team", AsyncMock()
        ) as notify_mock,
    ):
        await service.update(task.id, TaskUpdate(due_date=date(2026, 8, 15)), actor)

    notify_mock.assert_awaited_once()
    _, kwargs = notify_mock.call_args
    assert kwargs["ntype"] == NotificationType.SYSTEM
    assert actor.id in kwargs["exclude_user_ids"]
    # due_date thay đổi -> cờ idempotency "due soon" phải được reset để
    # đợt sweep theo lịch có thể kích hoạt lại cho ngày vừa được lên lịch lại.
    assert task.last_due_soon_notified_at is None


@pytest.mark.asyncio
async def test_task_update_does_not_notify_team_when_nothing_significant_changed():
    task = SimpleNamespace(
        id=5,
        project_id=7,
        name="Task A",
        status=TaskStatus.TODO,
        sprint_id=None,
        assignee_id=None,
        start_date=date(2026, 8, 1),
        due_date=date(2026, 8, 10),
        description="old",
        last_due_soon_notified_at=None,
    )
    context = ProjectContext(project=SimpleNamespace(id=7), role="PM", is_admin=False)
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = TaskService(db)
    service._loaded_task = AsyncMock(return_value=task)
    service._response = AsyncMock(return_value=SimpleNamespace())
    actor = SimpleNamespace(id=1, full_name="Alice")

    with (
        patch(
            "app.services.task_service.get_task_context",
            AsyncMock(return_value=(task, context)),
        ),
        patch("app.services.task_service.recalculate_project", AsyncMock()),
        patch(
            "app.services.task_service.notify_project_team", AsyncMock()
        ) as notify_mock,
    ):
        await service.update(task.id, TaskUpdate(description="new text"), actor)

    notify_mock.assert_not_awaited()


@pytest.mark.asyncio
async def test_change_status_notifies_team_on_transition():
    task = SimpleNamespace(
        id=5, project_id=7, name="Task A", status=TaskStatus.TODO, progress=0.0, assignee_id=2, actual_start=None, actual_end=None
    )
    context = ProjectContext(project=SimpleNamespace(id=7), role="PM", is_admin=False)
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = TaskService(db)
    service._capabilities = AsyncMock(return_value=SimpleNamespace(can_change_status=True))
    service._loaded_task = AsyncMock(return_value=task)
    service._response = AsyncMock(return_value=SimpleNamespace())
    actor = SimpleNamespace(id=1, full_name="Alice")

    with (
        patch(
            "app.services.task_service.get_task_context",
            AsyncMock(return_value=(task, context)),
        ),
        patch("app.services.task_service.recalculate_project", AsyncMock()),
        patch(
            "app.services.task_service.notify_project_team", AsyncMock()
        ) as notify_mock,
    ):
        await service.change_status(task.id, TaskStatusUpdate(status="IN_PROGRESS"), actor)

    notify_mock.assert_awaited_once()
    _, kwargs = notify_mock.call_args
    assert kwargs["exclude_user_ids"] == {actor.id}
    assert kwargs["ntype"] == NotificationType.SYSTEM


@pytest.mark.asyncio
async def test_change_status_skips_notification_when_status_unchanged():
    task = SimpleNamespace(
        id=5, project_id=7, name="Task A", status=TaskStatus.TODO, progress=0.0, assignee_id=2
    )
    context = ProjectContext(project=SimpleNamespace(id=7), role="PM", is_admin=False)
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = TaskService(db)
    service._capabilities = AsyncMock(return_value=SimpleNamespace(can_change_status=True))
    service._loaded_task = AsyncMock(return_value=task)
    service._response = AsyncMock(return_value=SimpleNamespace())
    actor = SimpleNamespace(id=1, full_name="Alice")

    with (
        patch(
            "app.services.task_service.get_task_context",
            AsyncMock(return_value=(task, context)),
        ),
        patch("app.services.task_service.recalculate_project", AsyncMock()),
        patch(
            "app.services.task_service.notify_project_team", AsyncMock()
        ) as notify_mock,
    ):
        await service.change_status(task.id, TaskStatusUpdate(status="TODO"), actor)

    notify_mock.assert_not_awaited()
