from datetime import UTC, datetime

import pytest
from sqlalchemy import delete, func, insert, select

from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus
from app.models.associations import project_members
from app.models.job import Job
from app.models.project import Project
from app.services.ai_service import AIService


@pytest.mark.asyncio
async def test_ai_and_outbox_rollback_together(session, make_user):
    user = await make_user()
    await session.commit()
    result = await AIService(session).request_project_generation("A small demo", user)
    assert result.status == "PENDING"
    assert await session.scalar(select(func.count()).select_from(Job)) == 1
    await session.rollback()
    assert await session.scalar(select(func.count()).select_from(AIRequest)) == 0
    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_same_request_key_does_not_generate_twice(session, make_user):
    user = await make_user()
    service = AIService(session)
    first = await service.request_project_generation("A small demo", user, request_key="demo-submit")
    second = await service.request_project_generation("A small demo", user, request_key="demo-submit")
    assert first.job_id == second.job_id
    assert await session.scalar(select(func.count()).select_from(Job)) == 1
    assert await session.scalar(select(func.count()).select_from(AIRequest)) == 1


@pytest.mark.asyncio
async def test_owner_can_resume_jobs_other_owner_cannot(session, make_user, as_user):
    owner = await make_user()
    other = await make_user()
    job = await AIService(session).request_project_generation("A small demo", owner)
    async with as_user(owner) as http:
        response = await http.get("/api/v1/ai/jobs")
        assert response.status_code == 200
        assert response.json()[0]["job_id"] == job.job_id
    async with as_user(other) as http:
        assert (await http.get("/api/v1/ai/jobs")).json() == []
        assert (await http.get(f"/api/v1/ai/jobs/{job.job_id}")).status_code == 403


@pytest.mark.asyncio
@pytest.mark.parametrize("access_change, expected", [("removed_member", 403), ("deleted_project", 404)])
async def test_completed_ai_output_rechecks_current_project_access(
    session, make_user, seed_roles, as_user, access_change, expected
):
    pm = await make_user()
    owner = await make_user()
    project = Project(name="Private analysis", pm_id=pm.id)
    session.add(project)
    await session.flush()
    await session.execute(insert(project_members).values(
        project_id=project.id, user_id=owner.id, role_id=seed_roles["Member"].id
    ))
    job = await AIService(session).request_risk_analysis(project.id, owner)
    request = await session.get(AIRequest, int(job.job_id))
    request.status = AIRequestStatus.COMPLETED
    session.add(AIOutput(ai_request_id=request.id, output_json={"private": "analysis"}))
    await session.flush()
    async with as_user(owner) as http:
        response = await http.get(f"/api/v1/ai/jobs/{job.job_id}")
        assert response.status_code == 200
        assert response.json()["result"] == {"private": "analysis"}
        assert len((await http.get("/api/v1/ai/jobs")).json()) == 1
        if access_change == "removed_member":
            await session.execute(delete(project_members).where(
                project_members.c.project_id == project.id,
                project_members.c.user_id == owner.id,
            ))
        else:
            project.deleted_at = datetime.now(UTC)
        await session.flush()
        assert (await http.get(f"/api/v1/ai/jobs/{job.job_id}")).status_code == expected
        assert (await http.get("/api/v1/ai/jobs")).json() == []
