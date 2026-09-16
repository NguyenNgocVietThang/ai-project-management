"""Regression checks for populated Phase 2 flows found during the project audit."""
from datetime import UTC, datetime

import pytest
from sqlalchemy import insert, text

from app.models.associations import project_members
from app.models.dependency import Dependency
from app.models.project import Project
from app.models.task import Task
from app.models.worklog import Worklog
from app.services.resource_service import ResourceService
from app.services.scheduling_service import recalculate_project_cost
from app.services.task_service import TaskService


@pytest.fixture
async def project_work(session, make_user, seed_roles):
    await session.commit()
    await session.execute(text('PRAGMA foreign_keys=ON'))
    owner = await make_user(hourly_rate=100)
    project = Project(name="Audit project", pm_id=owner.id)
    session.add(project)
    await session.flush()
    await session.execute(insert(project_members).values(project_id=project.id, user_id=owner.id, role_id=seed_roles['PM'].id))
    first = Task(name="Design", project_id=project.id, assignee_id=owner.id)
    second = Task(name="Build", project_id=project.id, assignee_id=owner.id)
    session.add_all([first, second])
    await session.flush()
    return owner, project, first, second


@pytest.mark.asyncio
async def test_populated_dependencies_and_both_task_details(session, as_user, project_work):
    owner, project, first, second = project_work
    session.add(Dependency(predecessor_id=first.id, successor_id=second.id))
    await session.flush()
    async with as_user(owner) as client:
        response = await client.get(f'/api/v1/projects/{project.id}/dependencies')
        assert response.status_code == 200
        assert response.json()[0]['predecessor_name'] == 'Design'
        assert response.json()[0]['successor_name'] == 'Build'
        for task in (first, second):
            response = await client.get(f'/api/v1/tasks/{task.id}')
            assert response.status_code == 200
            edges = response.json()['predecessor_dependencies'] + response.json()['successor_dependencies']
            assert len(edges) == 1


@pytest.mark.asyncio
async def test_task_deletion_recalculates_surviving_work_cost(session, project_work):
    owner, project, first, second = project_work
    session.add_all([Worklog(task_id=first.id, user_id=owner.id, hours=3, log_date=datetime.now(UTC).date()), Worklog(task_id=second.id, user_id=owner.id, hours=2, log_date=datetime.now(UTC).date())])
    await session.flush()
    await recalculate_project_cost(session, project.id)
    assert project.actual_cost == 500
    await TaskService(session).delete(first.id, owner)
    assert project.actual_cost == 200


@pytest.mark.asyncio
async def test_deleted_project_timer_can_be_recovered_when_starting_elsewhere(session, project_work, seed_roles):
    owner, project, first, _ = project_work
    service = ResourceService(session)
    timer = await service.start_timer(first.id, owner)
    project.deleted_at = datetime.now(UTC)
    other = Project(name='Next project', pm_id=owner.id)
    session.add(other)
    await session.flush()
    await session.execute(insert(project_members).values(project_id=other.id, user_id=owner.id, role_id=seed_roles['PM'].id))
    next_task = Task(name='Next task', project_id=other.id, assignee_id=owner.id)
    session.add(next_task)
    await session.flush()
    next_timer = await service.start_timer(next_task.id, owner)
    assert next_timer.task_id == next_task.id
    old = await session.get(Worklog, timer.id)
    assert old.end_time is not None
    assert old.hours >= 0


@pytest.mark.asyncio
async def test_owner_can_stop_timer_after_project_access_removed(session, project_work):
    owner, project, first, _ = project_work
    service = ResourceService(session)
    timer = await service.start_timer(first.id, owner)
    project.deleted_at = datetime.now(UTC)
    await session.flush()
    result = await service.stop_timer(timer.id, owner)
    assert result.is_running is False


@pytest.mark.asyncio
async def test_ai_broker_failure_does_not_leave_pending_job(session, project_work, monkeypatch):
    from fastapi import HTTPException
    from sqlalchemy import select

    from app.models.ai_request import AIRequest, AIRequestStatus
    from app.services.ai_service import AIService
    from app.workers.ai_tasks import generate_project_task

    def unavailable(*args, **kwargs):
        raise ConnectionError('broker unavailable')

    monkeypatch.setattr(generate_project_task, 'delay', unavailable)
    owner, _, _, _ = project_work
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation('Create a project plan', owner)
    assert exc.value.status_code == 503
    request = await session.scalar(select(AIRequest))
    assert request.status == AIRequestStatus.FAILED
    assert request.completed_at is not None

@pytest.mark.asyncio
async def test_timer_recovery_keeps_audit_in_the_correct_project(session, project_work, seed_roles, make_user):
    from sqlalchemy import delete, select

    from app.core.request_context import set_current_project_id
    from app.models.audit_log import AuditLog
    owner, project, first, _ = project_work
    service = ResourceService(session)
    timer = await service.start_timer(first.id, owner)
    await session.flush()
    # Remove membership and PM ownership while retaining the running worklog.
    replacement = await make_user()
    project.pm_id = replacement.id
    await session.execute(delete(project_members).where(project_members.c.project_id == project.id))
    other = Project(name='Other project', pm_id=owner.id)
    session.add(other)
    await session.flush()
    await session.execute(insert(project_members).values(project_id=other.id, user_id=owner.id, role_id=seed_roles['PM'].id))
    task = Task(name='Other work', project_id=other.id, assignee_id=owner.id)
    session.add(task)
    await session.flush()
    next_timer = await service.start_timer(task.id, owner)
    await session.flush()
    entries = list((await session.scalars(select(AuditLog).where(AuditLog.entity_type == 'Worklog').order_by(AuditLog.id))).all())
    assert [(entry.action, entry.project_id) for entry in entries] == [('START_TIMER', project.id), ('STOP_TIMER', project.id), ('START_TIMER', other.id)]
    set_current_project_id(None)
    await service.stop_timer(next_timer.id, owner)
    await session.flush()
    last = await session.scalar(select(AuditLog).order_by(AuditLog.id.desc()).limit(1))
    assert last.project_id == other.id
    assert (await session.get(Worklog, timer.id)).end_time is not None


@pytest.mark.asyncio
async def test_phase_cascade_recalculates_project_cost(session, project_work):
    from app.models.phase import Phase
    from app.services.wbs_service import WBSService
    owner, project, first, second = project_work
    phase = Phase(name='Removed phase', project_id=project.id)
    session.add(phase)
    await session.flush()
    first.phase_id = phase.id
    session.add_all([Worklog(task_id=first.id, user_id=owner.id, hours=3, log_date=datetime.now(UTC).date()), Worklog(task_id=second.id, user_id=owner.id, hours=2, log_date=datetime.now(UTC).date())])
    await session.flush()
    await recalculate_project_cost(session, project.id)
    await WBSService(session).delete_phase(phase.id, 'cascade', owner)
    assert project.actual_cost == 200

@pytest.mark.asyncio
async def test_unrelated_user_cannot_stop_another_users_orphan_timer(session, project_work, make_user):
    from fastapi import HTTPException
    owner, project, first, _ = project_work
    service = ResourceService(session)
    timer = await service.start_timer(first.id, owner)
    project.deleted_at = datetime.now(UTC)
    intruder = await make_user()
    await session.flush()
    with pytest.raises(HTTPException) as exc:
        await service.stop_timer(timer.id, intruder)
    assert exc.value.status_code in (403, 404)
    assert (await session.get(Worklog, timer.id)).end_time is None


@pytest.mark.asyncio
async def test_populated_home_dashboard_counts_done_and_overdue_tasks(session, as_user, project_work):
    from datetime import timedelta

    from app.models.task import TaskStatus
    owner, _, first, second = project_work
    first.status = TaskStatus.DONE
    first.due_date = datetime.now(UTC).date() - timedelta(days=2)
    second.due_date = datetime.now(UTC).date() - timedelta(days=1)
    await session.flush()
    async with as_user(owner) as client:
        response = await client.get('/api/v1/dashboards/summary')
    assert response.status_code == 200
    data = response.json()
    assert data['stats']['total_tasks'] == 2
    assert data['stats']['overdue_tasks'] == 1
    assert data['active_projects'][0]['completed_task_count'] == 1

@pytest.mark.asyncio
async def test_timer_can_stop_within_the_same_clock_tick(session, project_work, monkeypatch):
    import app.services.resource_service as resource_module
    owner, _, first, _ = project_work
    service = ResourceService(session)
    timer = await service.start_timer(first.id, owner)
    stored = await session.get(Worklog, timer.id)

    class FixedClock(datetime):
        @classmethod
        def now(cls, tz=None):
            return stored.start_time.replace(tzinfo=UTC)

    monkeypatch.setattr(resource_module, 'datetime', FixedClock)
    stopped = await service.stop_timer(timer.id, owner)
    # SQLite drops timezone information when reading stored timestamps.
    assert stopped.end_time.replace(tzinfo=UTC) > stopped.start_time.replace(tzinfo=UTC)
    assert stopped.hours == 0
