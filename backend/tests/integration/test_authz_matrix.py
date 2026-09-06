"""Kiem tra phan quyen o tang HTTP that.

Toan bo bo test truoc day mock o tang service, nen KHONG co test nao chung minh
mot route thuc su tra 403. Cac dependency phan quyen co the bi go bo ma bo test
van xanh.
"""
import pytest
from sqlalchemy import insert

from app.models.associations import project_members
from app.models.project import Project


@pytest.fixture
async def project(session, make_user, seed_roles):
    """Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai."""
    pm = await make_user(email="pm@example.com", username="pm")
    member = await make_user(email="member@example.com", username="member")
    customer = await make_user(email="customer@example.com", username="customer")
    outsider = await make_user(email="outsider@example.com", username="outsider")

    project = Project(name="Delivery", pm_id=pm.id)
    session.add(project)
    await session.flush()

    for user, role in ((pm, "PM"), (member, "Member"), (customer, "Customer")):
        await session.execute(
            insert(project_members).values(
                project_id=project.id, user_id=user.id, role_id=seed_roles[role].id
            )
        )
    await session.flush()
    return {
        "project": project,
        "pm": pm,
        "member": member,
        "customer": customer,
        "outsider": outsider,
    }


@pytest.mark.asyncio
async def test_a_non_member_cannot_read_project_tasks(as_user, project):
    async with as_user(project["outsider"]) as client:
        response = await client.get(f"/api/v1/projects/{project['project'].id}/tasks")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_member_can_read_project_tasks(as_user, project):
    async with as_user(project["member"]) as client:
        response = await client.get(f"/api/v1/projects/{project['project'].id}/tasks")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_the_customer_role_cannot_read_the_work_breakdown_of_tasks(as_user, project):
    """Customer nhin thay du an nhung khong thay phan ra cong viec ben trong."""
    async with as_user(project["customer"]) as client:
        response = await client.get(f"/api/v1/projects/{project['project'].id}/tasks")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_the_customer_role_cannot_read_the_dependency_graph_either(as_user, project):
    """Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin."""
    async with as_user(project["customer"]) as client:
        response = await client.get(
            f"/api/v1/projects/{project['project'].id}/dependencies"
        )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_a_member_cannot_create_tasks(as_user, project):
    async with as_user(project["member"]) as client:
        response = await client.post(
            f"/api/v1/projects/{project['project'].id}/tasks",
            json={"name": "New task", "priority": "MEDIUM"},
        )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_the_pm_can_create_tasks(as_user, project):
    async with as_user(project["pm"]) as client:
        response = await client.post(
            f"/api/v1/projects/{project['project'].id}/tasks",
            json={"name": "New task", "priority": "MEDIUM"},
        )
    assert response.status_code == 201, response.text


@pytest.mark.asyncio
async def test_an_unverified_account_cannot_write(as_user, session, project, seed_roles):
    """CurrentVerifiedUser chi duoc dung o 2/40+ route truoc day, nen luong xac
    minh email gan nhu chi mang tinh trang tri."""
    unverified = project["pm"]
    unverified.email_verified = False
    await session.flush()

    async with as_user(unverified) as client:
        response = await client.post(
            f"/api/v1/projects/{project['project'].id}/tasks",
            json={"name": "New task", "priority": "MEDIUM"},
        )
    assert response.status_code == 403
    assert "verify" in response.text.lower()


@pytest.mark.asyncio
async def test_an_unverified_account_can_still_read(as_user, session, project):
    """Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email."""
    reader = project["member"]
    reader.email_verified = False
    await session.flush()

    async with as_user(reader) as client:
        response = await client.get(f"/api/v1/projects/{project['project'].id}/tasks")
    assert response.status_code == 200
