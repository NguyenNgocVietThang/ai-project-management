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
    db.info = {}
    db.get = AsyncMock(return_value=SimpleNamespace(id=1, start_date=None, progress=0.0))
    db.scalar = AsyncMock(return_value=5_000)

    with patch("app.services.job_service.enqueue", AsyncMock()) as scheduled:
        await scheduling_service.recalculate_project(db, 1)

    scheduled.assert_awaited_once_with(
        db,
        kind="scheduling.cpm",
        payload={"project_id": 1},
        dedupe_key="cpm:1",
        project_id=1,
        coalesce=True,
    )
    db.scalars.assert_not_awaited()
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_the_worker_itself_never_re_enqueues():
    """force_sync là đường mà worker dùng; thiếu nó thì nó tự đẩy việc cho chính
    mình mãi mãi."""
    from app.services import scheduling_service

    db = AsyncMock()
    db.info = {}
    db.get = AsyncMock(return_value=SimpleNamespace(id=1, start_date=None, progress=0.0))
    db.scalar = AsyncMock(return_value=5_000)
    db.scalars = AsyncMock(return_value=SimpleNamespace(all=lambda: []))

    with patch("app.services.job_service.enqueue", AsyncMock()) as scheduled:
        await scheduling_service.recalculate_project(db, 1, force_sync=True)

    scheduled.assert_not_awaited()


@pytest.mark.asyncio
async def test_real_large_project_coalesces_edits_and_runner_publishes_latest_schedule(
    session,
    engine,
    make_user,
    monkeypatch,
):
    import asyncio
    from datetime import date, timedelta

    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import async_sessionmaker

    from app.core.config import settings
    from app.core.job_runner import JobRunner
    from app.models.job import Job
    from app.models.project import Project
    from app.models.task import Task, TaskStatus
    from app.services.durable_handlers import run_cpm
    from app.services.scheduling_service import recalculate_project

    monkeypatch.setattr(settings, "CPM_SYNC_TASK_THRESHOLD", 300)
    owner = await make_user()
    anchor = date(2026, 10, 8)
    project = Project(name="Large CPM", pm_id=owner.id, start_date=anchor)
    session.add(project)
    await session.flush()
    tasks = [
        Task(name=f"Task {index}", project_id=project.id, estimated_hours=8) for index in range(301)
    ]
    session.add_all(tasks)
    await session.flush()

    await recalculate_project(session, project.id)
    assert all(task.early_start is None for task in tasks)
    tasks[0].estimated_hours = 16
    tasks[0].status = TaskStatus.DONE
    await session.flush()
    await recalculate_project(session, project.id)
    jobs = (await session.scalars(select(Job))).all()
    assert len(jobs) == 1
    assert jobs[0].generation == 2
    assert jobs[0].status == "queued"
    assert tasks[0].early_finish is None
    job_id, task_id, project_id = jobs[0].id, tasks[0].id, project.id
    await session.commit()

    factory = async_sessionmaker(engine, expire_on_commit=False)
    runner = JobRunner(factory, {"scheduling.cpm": run_cpm})
    assert await runner.poll_once() == 1
    await asyncio.gather(*runner._active)
    async with factory() as db:
        first = await db.get(Task, task_id)
        project = await db.get(Project, project_id)
        job = await db.get(Job, job_id)
        assert job.status == "succeeded"
        assert first.early_start == anchor
        assert first.early_finish == anchor + timedelta(days=2)
        assert first.is_critical is True
        assert project.progress == round(100 / 301, 2)
        assert len((await db.scalars(select(Job))).all()) == 1


@pytest.mark.asyncio
async def test_real_small_project_keeps_synchronous_cpm_without_outbox(session, make_user):
    from datetime import date, timedelta

    from sqlalchemy import select

    from app.models.job import Job
    from app.models.project import Project
    from app.models.task import Task
    from app.services.scheduling_service import recalculate_project

    owner = await make_user()
    anchor = date(2026, 10, 8)
    project = Project(name="Small CPM", pm_id=owner.id, start_date=anchor)
    session.add(project)
    await session.flush()
    task = Task(name="Small task", project_id=project.id, estimated_hours=16)
    session.add(task)
    await session.flush()
    await recalculate_project(session, project.id)
    assert task.early_start == anchor
    assert task.early_finish == anchor + timedelta(days=2)
    assert (await session.scalars(select(Job))).all() == []


@pytest.mark.asyncio
@pytest.mark.parametrize("cap", ["tasks", "dependencies"])
async def test_cpm_resource_cap_fails_visibly_before_calculating(
    session, engine, make_user, monkeypatch, as_user, cap
):
    import asyncio

    from sqlalchemy.ext.asyncio import async_sessionmaker

    from app.core.config import settings
    from app.core.job_runner import JobRunner
    from app.models.dependency import Dependency
    from app.models.project import Project
    from app.models.task import Task
    from app.services.durable_handlers import run_cpm
    from app.services.job_service import enqueue

    monkeypatch.setattr(settings, "CPM_MAX_TASKS", 2 if cap == "tasks" else 10)
    monkeypatch.setattr(settings, "CPM_MAX_DEPENDENCIES", 1 if cap == "dependencies" else 10)
    owner = await make_user()
    project = Project(name="Bounded CPM", pm_id=owner.id)
    session.add(project)
    await session.flush()
    tasks = [Task(project_id=project.id, name=f"Task {index}") for index in range(3)]
    session.add_all(tasks)
    await session.flush()
    session.add_all([Dependency(predecessor_id=tasks[0].id, successor_id=tasks[1].id),
                     Dependency(predecessor_id=tasks[1].id, successor_id=tasks[2].id)])
    job = await enqueue(session, "scheduling.cpm", {"project_id": project.id},
                        f"cpm-cap:{project.id}", project_id=project.id)
    job_id = job.id
    await session.commit()
    runner = JobRunner(async_sessionmaker(engine, expire_on_commit=False), {"scheduling.cpm": run_cpm})
    with patch("app.services.scheduling_service.recalculate_project", AsyncMock()) as calculate:
        assert await runner.poll_once() == 1
        await asyncio.gather(*runner._active)
        calculate.assert_not_awaited()
    await session.refresh(job)
    assert job.status == "failed"
    assert job.error_code == "resource_limit_exceeded"
    assert job.attempts == 1
    assert all(task.early_start is None for task in tasks)
    async with as_user(owner) as http:
        response = await http.get(f"/api/v1/jobs/{job_id}")
        assert response.status_code == 200
        assert response.json()["status"] == "failed"
        assert response.json()["error_code"] == "resource_limit_exceeded"


@pytest.mark.asyncio
async def test_the_cpm_endpoint_reports_float_and_the_critical_chain():
    """Engine da hoan chinh tu Phase 2 nhung chua tung duoc expose: client khong co
    cach nao lay duong gang, do tre cho phep, hay tong thoi gian du an."""
    from datetime import date as _date

    from app.services.scheduling_service import SchedulingService

    tasks = [
        SimpleNamespace(
            id=1,
            name="A",
            status=SimpleNamespace(value="TODO"),
            start_date=None,
            due_date=None,
            estimated_hours=None,
            project_id=1,
        ),
        SimpleNamespace(
            id=2,
            name="B",
            status=SimpleNamespace(value="TODO"),
            start_date=None,
            due_date=None,
            estimated_hours=None,
            project_id=1,
        ),
    ]
    dependency = SimpleNamespace(predecessor_id=1, successor_id=2, dependency_type="FS", lag_days=0)

    db = AsyncMock()
    # COUNT task/dependency trong cap (G1) trước khi nạp.
    db.scalar = AsyncMock(return_value=2)
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


@pytest.mark.asyncio
@pytest.mark.parametrize("counts", [(2001, 0), (10, 10001)])
async def test_the_cpm_endpoint_refuses_over_cap_without_loading_tasks(monkeypatch, counts):
    """G1: endpoint đọc CPM tính đồng bộ; vượt cap phải từ chối chỉ bằng COUNT,
    không nạp task/dependency nào vào bộ nhớ."""
    from fastapi import HTTPException

    from app.core.config import settings
    from app.services.scheduling_service import SchedulingService

    monkeypatch.setattr(settings, "CPM_MAX_TASKS", 2000)
    monkeypatch.setattr(settings, "CPM_MAX_DEPENDENCIES", 10000)
    db = AsyncMock()
    db.scalar = AsyncMock(side_effect=list(counts))
    db.scalars = AsyncMock()
    service = SchedulingService(db)

    project = SimpleNamespace(id=1, start_date=None, deleted_at=None)
    with patch(
        "app.services.phase2_common.get_project_context",
        AsyncMock(return_value=SimpleNamespace(project=project, role="PM", is_admin=False)),
    ):
        with pytest.raises(HTTPException) as excinfo:
            await service.critical_path(1, SimpleNamespace(id=9))

    assert excinfo.value.status_code == 422
    assert excinfo.value.detail == "resource_limit_exceeded"
    db.scalars.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize("cap", ["tasks", "dependencies", "none"])
async def test_the_cpm_endpoint_applies_the_job_caps_over_http(
    session, make_user, monkeypatch, as_user, cap
):
    """G1 qua HTTP thật: vượt cap trả 422 resource_limit_exceeded; trong cap trả như cũ."""
    from app.core.config import settings
    from app.models.dependency import Dependency
    from app.models.project import Project
    from app.models.task import Task

    monkeypatch.setattr(settings, "CPM_MAX_TASKS", 2 if cap == "tasks" else 10)
    monkeypatch.setattr(settings, "CPM_MAX_DEPENDENCIES", 1 if cap == "dependencies" else 10)
    owner = await make_user()
    project = Project(name="Capped CPM read", pm_id=owner.id)
    session.add(project)
    await session.flush()
    tasks = [Task(project_id=project.id, name=f"Task {index}") for index in range(3)]
    session.add_all(tasks)
    await session.flush()
    session.add_all([Dependency(predecessor_id=tasks[0].id, successor_id=tasks[1].id),
                     Dependency(predecessor_id=tasks[1].id, successor_id=tasks[2].id)])
    project_id = project.id
    await session.commit()

    async with as_user(owner) as http:
        response = await http.get(f"/api/v1/projects/{project_id}/cpm")

    if cap == "none":
        assert response.status_code == 200
        body = response.json()
        assert len(body["tasks"]) == 3
        assert body["critical_path"] == [task.id for task in tasks]
    else:
        assert response.status_code == 422
        assert response.json()["detail"] == "resource_limit_exceeded"
