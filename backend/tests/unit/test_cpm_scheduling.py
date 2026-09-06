"""CPM engine và cách nó được lên lịch chạy.

`utils/cpm.py` là 329 dòng số học lịch trình mà trước đây chỉ có phần phát hiện
chu trình được kiểm thử — forward/backward pass, ES/EF/LS/LF, float và cả bốn loại
quan hệ đều không có test nào.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.utils.cpm import CPMEdge, CPMNode, run_cpm, topological_sort


def _chain() -> tuple[dict[int, CPMNode], list[CPMEdge]]:
    """A(3) -> B(2) -> D(4), và A -> C(1) -> D. Đường găng là A,B,D = 9 ngày."""
    nodes = {
        1: CPMNode(id=1, duration=3.0),
        2: CPMNode(id=2, duration=2.0),
        3: CPMNode(id=3, duration=1.0),
        4: CPMNode(id=4, duration=4.0),
    }
    edges = [
        CPMEdge(predecessor_id=1, successor_id=2, dependency_type="FS", lag_days=0),
        CPMEdge(predecessor_id=1, successor_id=3, dependency_type="FS", lag_days=0),
        CPMEdge(predecessor_id=2, successor_id=4, dependency_type="FS", lag_days=0),
        CPMEdge(predecessor_id=3, successor_id=4, dependency_type="FS", lag_days=0),
    ]
    for edge in edges:
        nodes[edge.predecessor_id].successors.append(edge.successor_id)
        nodes[edge.successor_id].predecessors.append(edge.predecessor_id)
    return nodes, edges


def test_forward_pass_gives_the_earliest_possible_dates():
    nodes, edges = _chain()
    result = run_cpm(nodes, edges)

    assert (result.nodes[1].early_start, result.nodes[1].early_finish) == (0.0, 3.0)
    assert (result.nodes[2].early_start, result.nodes[2].early_finish) == (3.0, 5.0)
    assert (result.nodes[3].early_start, result.nodes[3].early_finish) == (3.0, 4.0)
    # D phải chờ nhánh chậm hơn (B), không phải nhánh nhanh (C).
    assert (result.nodes[4].early_start, result.nodes[4].early_finish) == (5.0, 9.0)


def test_float_marks_only_the_slack_branch():
    nodes, edges = _chain()
    result = run_cpm(nodes, edges)

    assert result.nodes[1].float_days == 0.0
    assert result.nodes[2].float_days == 0.0
    assert result.nodes[4].float_days == 0.0
    # C xong sớm hơn B một ngày, nên nó có đúng một ngày dự trữ.
    assert result.nodes[3].float_days == 1.0


def test_the_critical_path_is_the_zero_float_chain():
    nodes, edges = _chain()
    result = run_cpm(nodes, edges)

    critical = {nid for nid, node in result.nodes.items() if node.is_critical}
    assert critical == {1, 2, 4}


def test_backward_pass_never_pulls_a_task_earlier_than_its_forward_pass():
    nodes, edges = _chain()
    result = run_cpm(nodes, edges)
    for node in result.nodes.values():
        assert node.late_start >= node.early_start - 1e-9
        assert node.late_finish >= node.early_finish - 1e-9


def test_lag_pushes_the_successor_out():
    nodes = {
        1: CPMNode(id=1, duration=2.0),
        2: CPMNode(id=2, duration=2.0),
    }
    edges = [CPMEdge(predecessor_id=1, successor_id=2, dependency_type="FS", lag_days=3)]
    nodes[1].successors.append(2)
    nodes[2].predecessors.append(1)

    result = run_cpm(nodes, edges)
    assert result.nodes[2].early_start == 5.0


def test_start_to_start_lets_work_overlap():
    nodes = {
        1: CPMNode(id=1, duration=5.0),
        2: CPMNode(id=2, duration=2.0),
    }
    edges = [CPMEdge(predecessor_id=1, successor_id=2, dependency_type="SS", lag_days=0)]
    nodes[1].successors.append(2)
    nodes[2].predecessors.append(1)

    result = run_cpm(nodes, edges)
    # SS nghĩa là B bắt đầu cùng lúc A, chứ không phải sau khi A xong.
    assert result.nodes[2].early_start == 0.0


def test_finish_to_finish_aligns_the_endings():
    nodes = {
        1: CPMNode(id=1, duration=5.0),
        2: CPMNode(id=2, duration=2.0),
    }
    edges = [CPMEdge(predecessor_id=1, successor_id=2, dependency_type="FF", lag_days=0)]
    nodes[1].successors.append(2)
    nodes[2].predecessors.append(1)

    result = run_cpm(nodes, edges)
    assert result.nodes[2].early_finish >= result.nodes[1].early_finish - 1e-9


def test_disjoint_subgraphs_are_scheduled_independently():
    nodes = {
        1: CPMNode(id=1, duration=3.0),
        2: CPMNode(id=2, duration=7.0),
    }
    result = run_cpm(nodes, [])
    assert result.nodes[1].early_start == 0.0
    assert result.nodes[2].early_start == 0.0


def test_a_cycle_is_reported_with_the_tasks_involved():
    nodes = {1: CPMNode(id=1, duration=1.0), 2: CPMNode(id=2, duration=1.0)}
    nodes[1].successors.append(2)
    nodes[2].successors.append(1)

    with pytest.raises(ValueError) as error:
        topological_sort(nodes)
    assert "1" in str(error.value) and "2" in str(error.value)


def test_topological_sort_is_deterministic():
    nodes, _ = _chain()
    assert topological_sort(nodes) == topological_sort(nodes)


@pytest.mark.asyncio
async def test_large_projects_recalculate_in_the_background():
    """Một lần kéo thả trên dự án vài nghìn task không nên kéo theo hàng nghìn
    lệnh UPDATE trong khi người dùng đang chờ."""
    from app.services import scheduling_service

    db = AsyncMock()
    db.get = AsyncMock(return_value=SimpleNamespace(id=1, start_date=None, progress=0.0))
    db.scalar = AsyncMock(return_value=5_000)

    with patch(
        "app.workers.scheduling_tasks.schedule_recalculation", AsyncMock(return_value=True)
    ) as scheduled:
        await scheduling_service.recalculate_project(db, 1)

    scheduled.assert_awaited_once_with(1)
    db.scalars.assert_not_awaited()


@pytest.mark.asyncio
async def test_the_worker_itself_never_re_enqueues():
    """force_sync là đường mà worker dùng; thiếu nó thì nó tự đẩy việc cho chính
    mình mãi mãi."""
    from app.services import scheduling_service

    db = AsyncMock()
    db.get = AsyncMock(return_value=SimpleNamespace(id=1, start_date=None, progress=0.0))
    db.scalar = AsyncMock(return_value=5_000)
    db.scalars = AsyncMock(return_value=SimpleNamespace(all=lambda: []))

    with patch(
        "app.workers.scheduling_tasks.schedule_recalculation", AsyncMock()
    ) as scheduled:
        await scheduling_service.recalculate_project(db, 1, force_sync=True)

    scheduled.assert_not_awaited()


@pytest.mark.asyncio
async def test_the_cpm_endpoint_reports_float_and_the_critical_chain():
    """Engine da hoan chinh tu Phase 2 nhung chua tung duoc expose: client khong co
    cach nao lay duong gang, do tre cho phep, hay tong thoi gian du an."""
    from datetime import date as _date

    from app.services.scheduling_service import SchedulingService

    tasks = [
        SimpleNamespace(id=1, name="A", status=SimpleNamespace(value="TODO"),
                        start_date=None, due_date=None, estimated_hours=None,
                        project_id=1),
        SimpleNamespace(id=2, name="B", status=SimpleNamespace(value="TODO"),
                        start_date=None, due_date=None, estimated_hours=None,
                        project_id=1),
    ]
    dependency = SimpleNamespace(predecessor_id=1, successor_id=2,
                                 dependency_type="FS", lag_days=0)

    db = AsyncMock()
    calls = {"n": 0}

    async def scalars(_stmt):
        calls["n"] += 1
        return SimpleNamespace(all=lambda: tasks if calls["n"] == 1 else [dependency])

    db.scalars = scalars
    service = SchedulingService(db)

    project = SimpleNamespace(id=1, start_date=_date(2026, 3, 2), deleted_at=None)
    with patch(
        "app.services.phase2_common.get_project_context",
        AsyncMock(return_value=SimpleNamespace(project=project, role="PM", is_admin=False)),
    ):
        result = await service.critical_path(1, SimpleNamespace(id=9))

    assert result.project_id == 1
    assert result.anchor_date == _date(2026, 3, 2)
    assert result.critical_path == [1, 2], "chuoi FS khong co nhanh song song deu la duong gang"
    assert all(task.float_days == 0.0 for task in result.tasks)
    assert result.project_duration_days > 0
