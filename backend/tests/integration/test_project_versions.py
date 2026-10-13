"""Phiên bản dự án (V1): snapshot, cap, móc duyệt CR và endpoint trên SQLite."""
import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import insert, select

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.api.v1.endpoints import project_versions as versions_endpoint
from app.core.dependencies import get_current_user
from app.core.exceptions import ConflictException
from app.db.session import get_db
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.change_request import ChangeRequest, CRStatus
from app.models.dependency import Dependency
from app.models.phase import Phase
from app.models.project import Project
from app.models.project_version import ProjectVersion
from app.models.task import Task
from app.services.approval_service import ApprovalService
from app.services.change_request_service import ChangeRequestService
from app.services.versioning_service import (
    KIND_CHANGE_REQUEST,
    SNAPSHOT_SCHEMA_VERSION,
    create_snapshot,
)


@pytest.fixture(autouse=True)
def _no_ws_publish(monkeypatch):
    async def noop(messages):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish_many", noop)


async def _setup(session, make_user, seed_roles):
    users = {key: await make_user() for key in ("PM", "BA", "PO", "Member", "Outsider")}
    project = Project(name="Versioned", pm_id=users["PM"].id)
    session.add(project)
    await session.flush()
    for key in ("PM", "BA", "PO", "Member"):
        await session.execute(insert(project_members).values(
            project_id=project.id, user_id=users[key].id, role_id=seed_roles[key].id,
        ))
    phase = Phase(name="P1", project_id=project.id)
    session.add(phase)
    await session.flush()
    t1 = Task(name="A", project_id=project.id, phase_id=phase.id, assignee_id=users["Member"].id)
    t2 = Task(name="B", project_id=project.id)
    session.add_all([t1, t2])
    await session.flush()
    session.add(Dependency(predecessor_id=t1.id, successor_id=t2.id))
    await session.flush()
    return project, users, (t1, t2)


@pytest.mark.asyncio
async def test_snapshot_contents_and_numbering(session, make_user, seed_roles):
    project, users, (t1, t2) = await _setup(session, make_user, seed_roles)
    v1 = await create_snapshot(session, project.id, users["PM"], label="first")
    v2 = await create_snapshot(session, project.id, users["PM"], label="second")
    assert (v1.version_number, v2.version_number) == (1, 2)
    snap = v1.snapshot
    assert snap["schema_version"] == SNAPSHOT_SCHEMA_VERSION
    assert snap["counts"] == {
        "phases": 1, "sprints": 0, "epics": 0, "milestones": 0, "tasks": 2, "dependencies": 1,
    }
    task = next(t for t in snap["tasks"] if t["id"] == t1.id)
    assert task["assignee_id"] == users["Member"].id and task["phase_id"] == t1.phase_id
    # Không lưu trường CPM, worklog hay comment.
    assert "early_start" not in task and "is_critical" not in task
    assert not {"worklogs", "comments", "subtasks", "assignments"} & set(snap)
    assert snap["dependencies"][0]["predecessor_id"] == t1.id
    await session.flush()  # session test dùng autoflush=False
    audits = await session.scalars(select(AuditLog).where(AuditLog.entity_type == "ProjectVersion"))
    assert len(list(audits)) == 2


@pytest.mark.asyncio
async def test_cap_evicts_oldest_non_baseline(session, make_user, seed_roles):
    project, users, _ = await _setup(session, make_user, seed_roles)
    await create_snapshot(session, project.id, users["PM"], label="b", is_baseline=True, cap=3)
    await create_snapshot(session, project.id, users["PM"], label="n2", cap=3)
    await create_snapshot(session, project.id, users["PM"], label="n3", cap=3)
    await create_snapshot(session, project.id, users["PM"], label="n4", cap=3)
    rows = list(await session.scalars(
        select(ProjectVersion).where(ProjectVersion.project_id == project.id)
        .order_by(ProjectVersion.version_number)
    ))
    assert [(r.version_number, r.label) for r in rows] == [(1, "b"), (3, "n3"), (4, "n4")]


@pytest.mark.asyncio
async def test_cap_full_of_baselines_raises_409(session, make_user, seed_roles):
    project, users, _ = await _setup(session, make_user, seed_roles)
    for i in range(2):
        await create_snapshot(session, project.id, users["PM"], label=f"b{i}", is_baseline=True, cap=2)
    with pytest.raises(ConflictException):
        await create_snapshot(session, project.id, users["PM"], label="b3", is_baseline=True, cap=2)


@pytest.mark.asyncio
async def test_final_pm_approval_creates_snapshot_with_cr(session, make_user, seed_roles):
    project, users, _ = await _setup(session, make_user, seed_roles)
    cr = ChangeRequest(
        project_id=project.id, requested_by_id=users["BA"].id, title="Scope",
        description="Y", status=CRStatus.DRAFT,
    )
    session.add(cr)
    await session.flush()
    await ChangeRequestService(session).submit(cr.id, users["BA"])
    service = ApprovalService(session)
    await service.approve(cr.id, 1, users["BA"])
    await service.approve(cr.id, 2, users["PO"])
    assert await session.scalar(select(ProjectVersion).where(ProjectVersion.project_id == project.id)) is None
    await service.approve(cr.id, 3, users["PM"])
    version = await session.scalar(select(ProjectVersion).where(ProjectVersion.change_request_id == cr.id))
    assert version is not None and version.label == f"CR-{cr.id} được duyệt"
    assert version.snapshot["kind"] == KIND_CHANGE_REQUEST and version.is_baseline is False


@pytest_asyncio.fixture
async def http_as(session):
    test_app = FastAPI()
    test_app.include_router(versions_endpoint.router, prefix="/api/v1")

    async def override_db():
        yield session

    test_app.dependency_overrides[get_db] = override_db

    def factory(user):
        test_app.dependency_overrides[get_current_user] = lambda: user
        return AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test")

    yield factory
    test_app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_endpoints_permissions_and_contract(session, make_user, seed_roles, http_as):
    project, users, _ = await _setup(session, make_user, seed_roles)
    base = f"/api/v1/projects/{project.id}/versions"
    async with http_as(users["Member"]) as client:
        resp = await client.post(f"{base}/baseline", json={"label": "x"})
        assert resp.status_code == 403
    async with http_as(users["BA"]) as client:
        assert (await client.post(f"{base}/baseline", json={"label": "x"})).status_code == 403
    async with http_as(users["PM"]) as client:
        resp = await client.post(f"{base}/baseline", json={"label": "Baseline 1", "description": "d"})
        assert resp.status_code == 201, resp.text
        created = resp.json()
        assert created["is_baseline"] is True and created["version_number"] == 1
        assert created["counts"]["tasks"] == 2 and created["snapshot"] is None
        assert (await client.post(f"{base}/baseline", json={"label": ""})).status_code == 422
    async with http_as(users["Member"]) as client:
        listing = (await client.get(base)).json()
        assert [v["id"] for v in listing] == [created["id"]] and listing[0]["snapshot"] is None
        detail = (await client.get(f"{base}/{created['id']}?include_snapshot=true")).json()
        assert detail["snapshot"]["counts"]["dependencies"] == 1
        assert (await client.get(f"{base}/999999")).status_code == 404
    async with http_as(users["Outsider"]) as client:
        assert (await client.get(base)).status_code == 403
