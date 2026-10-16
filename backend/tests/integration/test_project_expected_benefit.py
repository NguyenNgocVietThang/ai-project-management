"""Lợi ích kỳ vọng của dự án: lưu được, trả về được, không nhận số âm."""
from datetime import date

import pytest
from sqlalchemy import insert

from app.models.associations import project_members
from app.models.project import Project


@pytest.fixture
async def pm_project(session, make_user, seed_roles):
    pm = await make_user(roles=[seed_roles["PM"]])
    project = Project(
        name="Alpha", pm_id=pm.id, start_date=date(2026, 1, 1), end_date=date(2026, 12, 31)
    )
    session.add(project)
    await session.flush()
    await session.execute(
        insert(project_members).values(
            project_id=project.id, user_id=pm.id, role_id=seed_roles["PM"].id
        )
    )
    return pm, project


@pytest.mark.asyncio
async def test_pm_cap_nhat_va_doc_lai_loi_ich_ky_vong(as_user, pm_project):
    pm, project = pm_project
    async with as_user(pm) as client:
        response = await client.patch(
            f"/api/v1/projects/{project.id}", json={"expected_benefit": 5000}
        )
    assert response.status_code == 200, response.text
    assert response.json()["expected_benefit"] == 5000


@pytest.mark.asyncio
async def test_loi_ich_ky_vong_am_bi_tu_choi(as_user, pm_project):
    pm, project = pm_project
    async with as_user(pm) as client:
        response = await client.patch(
            f"/api/v1/projects/{project.id}", json={"expected_benefit": -1}
        )
    assert response.status_code == 422
