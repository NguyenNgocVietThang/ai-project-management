from datetime import UTC, date, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from pydantic import ValidationError

import app.db.base  # noqa: F401
from app.core.exceptions import ConflictException
from app.models.task import TaskStatus
from app.schemas.task import AssignmentCreate, TaskCreate, TaskStatusUpdate, WorklogCreate
from app.schemas.wbs import PhaseCreate
from app.services.phase2_common import ProjectContext
from app.services.resource_service import ResourceService
from app.services.task_service import STATUS_TRANSITIONS, TaskService
from app.services.wbs_service import WBSService
from app.utils.cpm import CPMEdge, build_graph, topological_sort


def test_phase2_schema_date_and_time_validation():
    with pytest.raises(ValidationError):
        TaskCreate(
            name="Invalid dates",
            start_date=date(2026, 8, 20),
            due_date=date(2026, 8, 19),
        )
    with pytest.raises(ValidationError):
        PhaseCreate(
            name="Invalid phase",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 8, 1),
        )
    with pytest.raises(ValidationError):
        AssignmentCreate(
            user_id=2,
            start_date=date(2026, 9, 1),
            end_date=date(2026, 8, 1),
        )
    with pytest.raises(ValidationError):
        WorklogCreate(hours=0, log_date=date(2026, 8, 14))
    timed = WorklogCreate(
        log_date=date(2026, 8, 14),
        start_time=datetime(2026, 8, 14, 1, tzinfo=UTC),
        end_time=datetime(2026, 8, 14, 2, tzinfo=UTC),
    )
    assert timed.hours is None


def test_status_graph_supports_normal_block_and_reopen_flows():
    assert TaskStatus.IN_PROGRESS in STATUS_TRANSITIONS[TaskStatus.TODO]
    assert TaskStatus.IN_REVIEW in STATUS_TRANSITIONS[TaskStatus.IN_PROGRESS]
    assert TaskStatus.DONE in STATUS_TRANSITIONS[TaskStatus.IN_REVIEW]
    assert TaskStatus.BLOCKED in STATUS_TRANSITIONS[TaskStatus.TODO]
    assert TaskStatus.IN_REVIEW in STATUS_TRANSITIONS[TaskStatus.DONE]


def test_dependency_cycle_is_detected_before_persisting():
    edges = [CPMEdge(1, 2), CPMEdge(2, 3), CPMEdge(3, 1)]
    nodes = build_graph([(1, 1.0), (2, 1.0), (3, 1.0)], edges)
    with pytest.raises(ValueError, match="Cycle detected"):
        topological_sort(nodes)


@pytest.mark.asyncio
async def test_invalid_task_status_transition_is_rejected():
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = TaskService(db)
    task = SimpleNamespace(
        id=5,
        project_id=7,
        assignee_id=2,
        status=TaskStatus.TODO,
        progress=0.0,
    )
    context = ProjectContext(
        project=SimpleNamespace(id=7), role="PM", is_admin=False
    )
    service._capabilities = AsyncMock(
        return_value=SimpleNamespace(can_change_status=True)
    )
    with patch(
        "app.services.task_service.get_task_context",
        AsyncMock(return_value=(task, context)),
    ):
        with pytest.raises(ConflictException):
            await service.change_status(
                task.id, TaskStatusUpdate(status="DONE"), SimpleNamespace(id=1)
            )
    db.flush.assert_not_awaited()


@pytest.mark.asyncio
async def test_stop_timer_calculates_hours_and_updates_task_total():
    db = SimpleNamespace(flush=AsyncMock(), add=Mock())
    service = ResourceService(db)
    started = datetime.now(UTC) - timedelta(hours=1)
    item = SimpleNamespace(
        id=8,
        task_id=3,
        user_id=4,
        start_time=started,
        end_time=None,
        hours=0.0,
    )
    task = SimpleNamespace(id=3)
    service._owned_worklog = AsyncMock(return_value=(item, task, None))
    service._worklog_response = AsyncMock(return_value=item)
    with patch(
        "app.services.resource_service.recalculate_task_hours", new=AsyncMock()
    ) as recalculate:
        result = await service.stop_timer(item.id, SimpleNamespace(id=4))
    assert result.hours >= 0.99
    assert result.end_time is not None
    recalculate.assert_awaited_once_with(db, task.id)


@pytest.mark.asyncio
async def test_cascade_phase_delete_records_snapshot_and_recalculates():
    phase = SimpleNamespace(id=10, name="Delivery", project_id=7)
    db = SimpleNamespace(
        execute=AsyncMock(), delete=AsyncMock(), flush=AsyncMock(), add=Mock()
    )
    service = WBSService(db)
    service._project_item = AsyncMock(return_value=phase)
    service._phase_task_ids = AsyncMock(return_value=([20], [30, 31]))
    service._phase_snapshot = AsyncMock(
        return_value={"schema_version": 1, "phase": {"name": phase.name}}
    )
    with (
        patch("app.services.wbs_service.require_project_roles", AsyncMock()),
        patch(
            "app.services.wbs_service.recalculate_project", new=AsyncMock()
        ) as recalculate,
    ):
        await service.delete_phase(phase.id, "cascade", SimpleNamespace(id=1))
    assert db.execute.await_count == 2
    db.delete.assert_awaited_once_with(phase)
    assert db.add.call_args.args[0].old_values["schema_version"] == 1
    recalculate.assert_awaited_once_with(db, phase.project_id)
