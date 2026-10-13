"""Phiên bản dự án (V1) trên PostgreSQL thật: khóa hàng dự án và móc duyệt CR.

TEST_POSTGRES_URL phải trỏ tới DB dùng một lần; mỗi test tạo và xóa một schema riêng.
"""
import asyncio
import os
from uuid import uuid4

import pytest
import pytest_asyncio
from sqlalchemy import insert, select, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

import app.db.base  # noqa: F401 - đăng ký mọi model trước create_all
from app.models.associations import project_members
from app.models.base import Base
from app.models.change_request import ChangeRequest, CRStatus
from app.models.project import Project
from app.models.project_version import ProjectVersion
from app.models.role import Role
from app.models.task import Task
from app.models.user import User
from app.services.approval_service import ApprovalService
from app.services.change_request_service import ChangeRequestService
from app.services.versioning_service import create_snapshot


@pytest.fixture(autouse=True)
def _no_ws_publish(monkeypatch):
    async def noop(messages):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish_many", noop)


@pytest_asyncio.fixture
async def pg_factory():
    url = os.getenv("TEST_POSTGRES_URL")
    if not url:
        pytest.skip("Set TEST_POSTGRES_URL to a disposable PostgreSQL server; SQLite does not prove locks")
    admin = create_async_engine(url)
    schema = f"versions_test_{uuid4().hex}"
    async with admin.begin() as db:
        await db.execute(text(f'CREATE SCHEMA "{schema}"'))
    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    async with engine.begin() as db:
        await db.run_sync(Base.metadata.create_all)
    try:
        yield async_sessionmaker(engine, expire_on_commit=False, autoflush=False)
    finally:
        await engine.dispose()
        async with admin.begin() as db:
            await db.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        await admin.dispose()


async def _seed(factory):
    async with factory() as db, db.begin():
        roles = {name: Role(name=name, description=name) for name in ("BA", "PO", "PM")}
        db.add_all(roles.values())
        users = {}
        for key in ("BA", "PO", "PM"):
            users[key] = User(
                email=f"{key.lower()}@example.com", username=key.lower(), full_name=key,
                hashed_password="x", is_active=True, is_superuser=False,
                email_verified=True, auth_version=0,
            )
            users[key].roles = []
        db.add_all(users.values())
        await db.flush()
        project = Project(name="PG versions", pm_id=users["PM"].id)
        db.add(project)
        await db.flush()
        for key in ("BA", "PO", "PM"):
            await db.execute(insert(project_members).values(
                project_id=project.id, user_id=users[key].id, role_id=roles[key].id,
            ))
        db.add(Task(name="T", project_id=project.id))
        return project.id, {key: u.id for key, u in users.items()}


async def _snapshot(factory, project_id, user_id, label):
    async with factory() as db, db.begin():
        user = await db.get(User, user_id)
        await create_snapshot(db, project_id, user, label=label)


@pytest.mark.asyncio
async def test_postgres_concurrent_snapshots_get_distinct_numbers(pg_factory):
    project_id, ids = await _seed(pg_factory)
    results = await asyncio.gather(
        *(_snapshot(pg_factory, project_id, ids["PM"], f"v{i}") for i in range(5)),
        return_exceptions=True,
    )
    assert all(r is None for r in results), results
    async with pg_factory() as db:
        numbers = list(await db.scalars(
            select(ProjectVersion.version_number).where(ProjectVersion.project_id == project_id)
            .order_by(ProjectVersion.version_number)
        ))
    assert numbers == [1, 2, 3, 4, 5]


@pytest.mark.asyncio
async def test_postgres_second_snapshot_waits_for_project_lock(pg_factory):
    project_id, ids = await _seed(pg_factory)
    async with pg_factory() as first, first.begin():
        user = await first.get(User, ids["PM"])
        await create_snapshot(first, project_id, user, label="first")
        second = asyncio.create_task(_snapshot(pg_factory, project_id, ids["PM"], "second"))
        await asyncio.sleep(0.5)
        assert not second.done()
    await asyncio.wait_for(second, timeout=10)


@pytest.mark.asyncio
async def test_postgres_final_pm_approval_creates_cr_snapshot(pg_factory):
    project_id, ids = await _seed(pg_factory)
    async with pg_factory() as db, db.begin():
        cr = ChangeRequest(
            project_id=project_id, requested_by_id=ids["BA"], title="PG CR",
            description="Y", status=CRStatus.DRAFT,
        )
        db.add(cr)
        await db.flush()
        await ChangeRequestService(db).submit(cr.id, await db.get(User, ids["BA"]))
        cr_id = cr.id
    for order, key in ((1, "BA"), (2, "PO"), (3, "PM")):
        async with pg_factory() as db, db.begin():
            await ApprovalService(db).approve(cr_id, order, await db.get(User, ids[key]))
    async with pg_factory() as db:
        assert (await db.get(ChangeRequest, cr_id)).status == CRStatus.APPROVED
        versions = list(await db.scalars(
            select(ProjectVersion).where(ProjectVersion.change_request_id == cr_id)
        ))
    assert len(versions) == 1 and versions[0].snapshot["counts"]["tasks"] == 1
