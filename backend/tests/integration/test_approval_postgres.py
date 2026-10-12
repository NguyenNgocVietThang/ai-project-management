"""Quyết định bước duyệt đồng thời trên PostgreSQL thật (A2).

TEST_POSTGRES_URL phải trỏ tới DB dùng một lần; mỗi test tạo và xóa một schema riêng.
SQLite không chứng minh được khóa hàng `SELECT ... FOR UPDATE`.
"""
import asyncio
import os
from uuid import uuid4

import pytest
import pytest_asyncio
from sqlalchemy import insert, select, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

import app.db.base  # noqa: F401 - đăng ký mọi model trước create_all
from app.core.exceptions import ConflictException
from app.models.approval import Approval, ApprovalStatus
from app.models.associations import project_members
from app.models.base import Base
from app.models.change_request import ChangeRequest, CRStatus
from app.models.project import Project
from app.models.role import Role
from app.models.user import User
from app.services.approval_service import ApprovalService
from app.services.change_request_service import ChangeRequestService


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
    schema = f"approval_test_{uuid4().hex}"
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
    """Dự án có hai BA, một PO, một PM; CR đã submit. Trả về (cr_id, id theo khóa)."""
    async with factory() as db, db.begin():
        roles = {name: Role(name=name, description=name) for name in ("BA", "PO", "PM")}
        db.add_all(roles.values())
        users = {}
        for key in ("BA", "BA2", "PO", "PM"):
            users[key] = User(
                email=f"{key.lower()}@example.com", username=key.lower(), full_name=key,
                hashed_password="x", is_active=True, is_superuser=False,
                email_verified=True, auth_version=0,
            )
            users[key].roles = []
        db.add_all(users.values())
        await db.flush()
        project = Project(name="PG approvals", pm_id=users["PM"].id)
        db.add(project)
        await db.flush()
        for key, role in (("BA", "BA"), ("BA2", "BA"), ("PO", "PO"), ("PM", "PM")):
            await db.execute(insert(project_members).values(
                project_id=project.id, user_id=users[key].id, role_id=roles[role].id,
            ))
        cr = ChangeRequest(
            project_id=project.id, requested_by_id=users["BA"].id, title="PG CR",
            description="Y", status=CRStatus.DRAFT,
        )
        db.add(cr)
        await db.flush()
        await ChangeRequestService(db).submit(cr.id, users["BA"])
        return cr.id, {key: u.id for key, u in users.items()}


async def _approve(factory, cr_id, user_id, step_order=1):
    async with factory() as db, db.begin():
        user = await db.get(User, user_id)
        await ApprovalService(db).approve(cr_id, step_order, user)


@pytest.mark.asyncio
async def test_postgres_two_same_role_approvers_only_one_wins(pg_factory):
    cr_id, ids = await _seed(pg_factory)
    results = await asyncio.gather(
        _approve(pg_factory, cr_id, ids["BA"]),
        _approve(pg_factory, cr_id, ids["BA2"]),
        return_exceptions=True,
    )
    assert sum(r is None for r in results) == 1
    assert sum(isinstance(r, ConflictException) for r in results) == 1
    async with pg_factory() as db:
        steps = list(await db.scalars(
            select(Approval).where(Approval.change_request_id == cr_id).order_by(Approval.step_order)
        ))
        assert [s.status for s in steps] == [
            ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.PENDING,
        ]
        assert steps[0].approver_id in {ids["BA"], ids["BA2"]}
        assert (await db.get(ChangeRequest, cr_id)).status == CRStatus.UNDER_REVIEW


@pytest.mark.asyncio
async def test_postgres_second_decider_waits_for_row_lock(pg_factory):
    cr_id, ids = await _seed(pg_factory)
    # Người thứ nhất giữ khóa (chưa commit); người thứ hai phải chờ chứ không đọc bản cũ.
    async with pg_factory() as first, first.begin():
        user = await first.get(User, ids["BA"])
        await ApprovalService(first).approve(cr_id, 1, user)
        second = asyncio.create_task(_approve(pg_factory, cr_id, ids["BA2"]))
        await asyncio.sleep(0.5)
        assert not second.done()
    with pytest.raises(ConflictException):
        await asyncio.wait_for(second, timeout=10)
