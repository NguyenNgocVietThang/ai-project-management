"""Tai nguyen cua du an nay khong duoc ro ri sang du an khac."""
from datetime import UTC

import pytest
from sqlalchemy import insert

from app.models.associations import project_members
from app.models.project import Project
from app.models.task import Task


@pytest.fixture
async def two_projects(session, make_user, seed_roles):
    alice = await make_user(email="alice@example.com", username="alice")
    bob = await make_user(email="bob@example.com", username="bob")

    alpha = Project(name="Alpha", pm_id=alice.id)
    beta = Project(name="Beta", pm_id=bob.id)
    session.add_all([alpha, beta])
    await session.flush()

    for project, owner in ((alpha, alice), (beta, bob)):
        await session.execute(
            insert(project_members).values(
                project_id=project.id, user_id=owner.id, role_id=seed_roles["PM"].id
            )
        )
    beta_task = Task(project_id=beta.id, name="Beta secret task")
    session.add(beta_task)
    await session.flush()
    return {"alice": alice, "bob": bob, "alpha": alpha, "beta": beta, "beta_task": beta_task}


@pytest.mark.asyncio
async def test_a_pm_cannot_read_another_projects_tasks(as_user, two_projects):
    async with as_user(two_projects["alice"]) as client:
        response = await client.get(f"/api/v1/projects/{two_projects['beta'].id}/tasks")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_pm_cannot_open_a_task_from_another_project(as_user, two_projects):
    async with as_user(two_projects["alice"]) as client:
        response = await client.get(f"/api/v1/tasks/{two_projects['beta_task'].id}")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_pm_cannot_read_another_projects_work_breakdown(as_user, two_projects):
    async with as_user(two_projects["alice"]) as client:
        response = await client.get(f"/api/v1/projects/{two_projects['beta'].id}/wbs")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_pm_cannot_read_another_projects_chat(as_user, two_projects):
    async with as_user(two_projects["alice"]) as client:
        response = await client.get(
            f"/api/v1/projects/{two_projects['beta'].id}/messages"
        )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_pm_cannot_read_another_projects_critical_path(as_user, two_projects):
    async with as_user(two_projects["alice"]) as client:
        response = await client.get(f"/api/v1/projects/{two_projects['beta'].id}/cpm")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_soft_deleted_project_reads_as_missing(as_user, session, two_projects):
    from datetime import datetime

    two_projects["alpha"].deleted_at = datetime.now(UTC)
    await session.flush()

    async with as_user(two_projects["alice"]) as client:
        response = await client.get(f"/api/v1/projects/{two_projects['alpha'].id}/tasks")
    assert response.status_code == 404
