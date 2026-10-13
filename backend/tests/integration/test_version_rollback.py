"""Rollback phiên bản dự án (V3) theo bảng quy tắc V0, trên SQLite và PostgreSQL.

PostgreSQL: đặt TEST_POSTGRES_URL tới DB dùng một lần; mỗi test tạo và xóa một schema riêng.
"""
import importlib.util
import os
from datetime import date
from pathlib import Path
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import delete, func, insert, inspect, select, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.api.v1.endpoints import project_versions as versions_endpoint
from app.core.dependencies import get_current_user
from app.core.exceptions import ForbiddenException
from app.db.session import get_db
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.base import Base
from app.models.dependency import Dependency, DependencyType
from app.models.job import Job
from app.models.phase import Phase
from app.models.project import Project
from app.models.project_version import ProjectVersion
from app.models.role import Role
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.models.worklog import Worklog
from app.services.scheduling_service import SchedulingService
from app.services.task_service import TaskService
from app.services.versioning_service import (
    KIND_PRE_ROLLBACK,
    KIND_ROLLBACK,
    VersioningService,
    create_snapshot,
)
from app.utils.version_diff import diff_snapshots


@pytest.fixture(autouse=True)
def _no_ws_publish(monkeypatch):
    async def noop(messages):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish_many", noop)


# ─── Kịch bản dùng chung cho SQLite và PostgreSQL ───────────────────────────


async def _seed(db, roles: dict[str, Role]) -> dict:
    """Tạo dự án, PM, Member, phase P1, task A (P1, assignee Member) -> B; trả về các ID."""
    users = {}
    for key in ("PM", "Member"):
        users[key] = User(
            email=f"{key.lower()}-{uuid4().hex[:6]}@example.com",
            username=f"{key.lower()}-{uuid4().hex[:6]}", full_name=key,
            hashed_password="x", is_active=True, is_superuser=False,
            email_verified=True, auth_version=0,
        )
        users[key].roles = []
    db.add_all(users.values())
    await db.flush()
    project = Project(name="Rollback", pm_id=users["PM"].id)
    db.add(project)
    await db.flush()
    for key in ("PM", "Member"):
        await db.execute(insert(project_members).values(
            project_id=project.id, user_id=users[key].id, role_id=roles[key].id,
        ))
    phase = Phase(name="P1", project_id=project.id)
    db.add(phase)
    await db.flush()
    a = Task(name="A", project_id=project.id, phase_id=phase.id, assignee_id=users["Member"].id,
             start_date=date(2026, 1, 5), estimated_hours=8)
    b = Task(name="B", project_id=project.id)
    db.add_all([a, b])
    await db.flush()
    db.add(Dependency(predecessor_id=a.id, successor_id=b.id, dependency_type=DependencyType.FS, lag_days=1))
    await db.flush()
    return {
        "project": project.id, "pm": users["PM"].id, "member": users["Member"].id,
        "phase": phase.id, "a": a.id, "b": b.id,
    }


async def _mutate(db, ids: dict) -> dict:
    """Thay đổi sau v1: sửa A, xóa B, thêm C (có worklog) và D (không phụ thuộc), thêm P2."""
    a = await db.get(Task, ids["a"])
    a.name = "A2"
    a.status = TaskStatus.DONE
    p2 = Phase(name="P2", project_id=ids["project"])
    db.add(p2)
    await db.flush()
    a.phase_id = p2.id
    # Tạo C, D trước khi xóa B: SQLite (không AUTOINCREMENT) dùng lại ID lớn nhất vừa xóa.
    c = Task(name="C", project_id=ids["project"])
    d = Task(name="D", project_id=ids["project"])
    db.add_all([c, d])
    await db.flush()
    await db.execute(delete(Dependency).where(Dependency.successor_id == ids["b"]))
    await db.execute(delete(Task).where(Task.id == ids["b"]))
    db.add(Worklog(task_id=c.id, user_id=ids["member"], hours=2, log_date=date(2026, 1, 6)))
    db.add(Dependency(predecessor_id=c.id, successor_id=d.id))
    db.add(Dependency(predecessor_id=a.id, successor_id=c.id))
    await db.flush()
    return {"c": c.id, "d": d.id, "p2": p2.id}


async def _tasks(db, project_id: int) -> dict[str, Task]:
    rows = await db.scalars(
        select(Task).where(Task.project_id == project_id).execution_options(populate_existing=True)
    )
    return {task.name: task for task in rows}


async def _deps(db, project_id: int) -> set[tuple[int, int, str, int]]:
    ids = select(Task.id).where(Task.project_id == project_id)
    rows = await db.scalars(
        select(Dependency).where(Dependency.predecessor_id.in_(ids))
        .execution_options(populate_existing=True)
    )
    return {(d.predecessor_id, d.successor_id, d.dependency_type.value, d.lag_days) for d in rows}


def _assert_empty_diff(old: dict, new: dict) -> None:
    result = diff_snapshots(old, new)
    for entity, item in result["entities"].items():
        assert not (item["added"] or item["removed"] or item["changed"]), (entity, item)


async def _check_rollback(db, ids: dict, extra: dict, v1_snapshot: dict, result: dict) -> None:
    summary = result["summary"]
    tasks = await _tasks(db, ids["project"])
    # Task có trong snapshot: trường được khôi phục.
    a = tasks["A"]
    assert (a.status, a.phase_id, a.assignee_id) == (TaskStatus.TODO, ids["phase"], ids["member"])
    assert a.start_date == date(2026, 1, 5) and a.archived_at is None
    # Task mới có worklog: lưu trữ, worklog còn nguyên.
    assert tasks["C"].archived_at is not None
    assert await db.scalar(select(func.count()).select_from(Worklog).where(Worklog.task_id == extra["c"])) == 1
    # Task mới không phụ thuộc: xóa cứng.
    assert "D" not in tasks
    # Task đã xóa: tạo lại ID mới, ghi id_map.
    new_b = tasks["B"].id
    assert new_b != ids["b"]
    assert summary["id_map"]["tasks"][str(ids["b"])] == new_b
    # Dependency đúng tập snapshot (dịch ID), cạnh tới task lưu trữ bị bỏ.
    assert await _deps(db, ids["project"]) == {(ids["a"], new_b, "FS", 1)}
    # Phase không có trong snapshot bị xóa.
    assert await db.get(Phase, extra["p2"], populate_existing=True) is None
    version = await db.get(ProjectVersion, result["version"]["id"])
    assert version.snapshot["kind"] == KIND_ROLLBACK
    assert version.snapshot["id_map"]["tasks"] == {str(ids["b"]): new_b}
    # Snapshot kết quả trùng v1 sau khi dịch id_map.
    _assert_empty_diff(v1_snapshot, version.snapshot)
    pre = await db.get(ProjectVersion, summary["pre_rollback_version_id"])
    assert pre.snapshot["kind"] == KIND_PRE_ROLLBACK and pre.label.startswith("Trước khi khôi phục")
    jobs = await db.scalar(
        select(func.count()).select_from(Job)
        .where(Job.kind == "scheduling.cpm", Job.project_id == ids["project"])
    )
    assert jobs >= 1
    assert await db.scalar(
        select(func.count()).select_from(AuditLog).where(AuditLog.action == "ROLLBACK")
    ) == 1


async def _check_reverse(db, ids: dict, extra: dict, pre_snapshot: dict, result: dict) -> None:
    tasks = await _tasks(db, ids["project"])
    assert tasks["A2"].id == ids["a"] and tasks["A2"].status == TaskStatus.DONE
    # C được bỏ lưu trữ (giữ ID, worklog còn); D tạo lại với ID mới.
    assert tasks["C"].id == extra["c"] and tasks["C"].archived_at is None
    assert await db.scalar(select(func.count()).select_from(Worklog)) == 1
    assert result["summary"]["id_map"]["tasks"][str(extra["d"])] == tasks["D"].id
    version = await db.get(ProjectVersion, result["version"]["id"])
    _assert_empty_diff(pre_snapshot, version.snapshot)


# ─── SQLite ──────────────────────────────────────────────────────────────────


async def _sqlite_scenario(session, seed_roles):
    ids = await _seed(session, seed_roles)
    pm = await session.get(User, ids["pm"])
    v1 = await create_snapshot(session, ids["project"], pm, label="v1")
    await session.commit()
    extra = await _mutate(session, ids)
    await session.commit()
    return ids, extra, pm, v1


@pytest.mark.asyncio
async def test_rollback_applies_v0_rules_and_is_reversible(session, seed_roles):
    ids, extra, pm, v1 = await _sqlite_scenario(session, seed_roles)
    service = VersioningService(session)
    result = await service.rollback(ids["project"], v1.id, pm)
    await _check_rollback(session, ids, extra, v1.snapshot, result)

    pre_id = result["summary"]["pre_rollback_version_id"]
    pre_snapshot = (await session.get(ProjectVersion, pre_id)).snapshot
    reverse = await service.rollback(ids["project"], pre_id, pm)
    await _check_reverse(session, ids, extra, pre_snapshot, reverse)


@pytest.mark.asyncio
async def test_rollback_failure_leaves_no_partial_changes(session, seed_roles, monkeypatch):
    ids, extra, pm, v1 = await _sqlite_scenario(session, seed_roles)
    versions_before = await session.scalar(select(func.count()).select_from(ProjectVersion))
    deps_before = await _deps(session, ids["project"])

    async def boom(*args, **kwargs):
        raise RuntimeError("injected failure")

    # Lỗi sau khi đã khôi phục trường task và tạo lại B, trước bước lưu trữ/xóa.
    monkeypatch.setattr("app.services.versioning_service._tasks_with_dependent_rows", boom)
    with pytest.raises(RuntimeError):
        await VersioningService(session).rollback(ids["project"], v1.id, pm)
    await session.rollback()  # vai trò của get_db khi request lỗi

    tasks = await _tasks(session, ids["project"])
    assert set(tasks) == {"A2", "C", "D"}
    assert tasks["A2"].phase_id == extra["p2"]
    assert all(task.archived_at is None for task in tasks.values())
    assert await _deps(session, ids["project"]) == deps_before
    assert await session.scalar(select(func.count()).select_from(ProjectVersion)) == versions_before
    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_rollback_requires_pm(session, seed_roles):
    ids, _extra, _pm, v1 = await _sqlite_scenario(session, seed_roles)
    member = await session.get(User, ids["member"])
    with pytest.raises(ForbiddenException):
        await VersioningService(session).rollback(ids["project"], v1.id, member)


@pytest.mark.asyncio
async def test_assignee_no_longer_member_is_cleared_with_warning(session, seed_roles):
    ids, _extra, pm, v1 = await _sqlite_scenario(session, seed_roles)
    await session.execute(delete(project_members).where(project_members.c.user_id == ids["member"]))
    await session.commit()
    result = await VersioningService(session).rollback(ids["project"], v1.id, pm)
    tasks = await _tasks(session, ids["project"])
    assert tasks["A"].assignee_id is None
    assert result["summary"]["warnings"] == [{
        "code": "assignee_not_member", "task_id": ids["a"], "task_name": "A",
        "assignee_id": ids["member"],
    }]


@pytest.mark.asyncio
async def test_archived_tasks_hidden_from_list_cpm_and_snapshot(session, seed_roles):
    ids, extra, pm, v1 = await _sqlite_scenario(session, seed_roles)
    await VersioningService(session).rollback(ids["project"], v1.id, pm)
    listed = await TaskService(session).list(ids["project"], pm)
    assert {item.name for item in listed.items} == {"A", "B"} and listed.total == 2
    cpm = await SchedulingService(session).critical_path(ids["project"], pm)
    assert {task.name for task in cpm.tasks} == {"A", "B"}
    snapshot = (await create_snapshot(session, ids["project"], pm, label="after")).snapshot
    assert extra["c"] not in {task["id"] for task in snapshot["tasks"]}


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
async def test_rollback_endpoint(session, seed_roles, http_as):
    ids, _extra, pm, v1 = await _sqlite_scenario(session, seed_roles)
    member = await session.get(User, ids["member"])
    url = f"/api/v1/projects/{ids['project']}/versions/{v1.id}/rollback"
    async with http_as(member) as client:
        assert (await client.post(url)).status_code == 403
    async with http_as(pm) as client:
        response = await client.post(url)
        missing = await client.post(f"/api/v1/projects/{ids['project']}/versions/999999/rollback")
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["version"]["kind"] == KIND_ROLLBACK
    assert body["version"]["label"] == f"Khôi phục về v{v1.version_number}"
    assert body["summary"]["changes"]["archived"] == 1
    assert body["summary"]["changes"]["deleted"] >= 2  # D và P2
    assert body["summary"]["total_changes"] > 0
    assert missing.status_code == 404


# ─── Migration ───────────────────────────────────────────────────────────────


def _load_migration():
    path = Path(__file__).parents[2] / "alembic/versions/20261013_task_archived_at.py"
    spec = importlib.util.spec_from_file_location("task_archived_at_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


@pytest.mark.asyncio
async def test_migration_matches_model_and_downgrades(engine):
    migration = _load_migration()
    assert migration.revision == "20261013_task_archived_at"

    def migrate(connection, upgrade):
        with Operations.context(MigrationContext.configure(connection)):
            (migration.upgrade if upgrade else migration.downgrade)()

    def shape(connection):
        inspector = inspect(connection)
        columns = {c["name"]: c["nullable"] for c in inspector.get_columns("tasks")}
        indexes = {i["name"]: tuple(i["column_names"]) for i in inspector.get_indexes("tasks")}
        return columns, indexes

    async with engine.begin() as db:
        model_shape = await db.run_sync(shape)
        assert model_shape[0]["archived_at"] is True
        assert model_shape[1]["ix_tasks_project_archived"] == ("project_id", "archived_at")
        await db.run_sync(lambda connection: migrate(connection, False))
        columns, indexes = await db.run_sync(shape)
        assert "archived_at" not in columns and "ix_tasks_project_archived" not in indexes
        await db.run_sync(lambda connection: migrate(connection, True))
        assert await db.run_sync(shape) == model_shape


# ─── PostgreSQL ──────────────────────────────────────────────────────────────


@pytest_asyncio.fixture
async def pg_factory():
    url = os.getenv("TEST_POSTGRES_URL")
    if not url:
        pytest.skip("Set TEST_POSTGRES_URL to a disposable PostgreSQL server")
    admin = create_async_engine(url)
    schema = f"rollback_test_{uuid4().hex}"
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


async def _pg_scenario(factory):
    async with factory() as db, db.begin():
        roles = {name: Role(name=name, description=name) for name in ("PM", "Member")}
        db.add_all(roles.values())
        await db.flush()
        ids = await _seed(db, roles)
        pm = await db.get(User, ids["pm"])
        v1 = await create_snapshot(db, ids["project"], pm, label="v1")
        v1_id, v1_snapshot = v1.id, v1.snapshot
    async with factory() as db, db.begin():
        extra = await _mutate(db, ids)
    return ids, extra, v1_id, v1_snapshot


@pytest.mark.asyncio
async def test_pg_rollback_applies_v0_rules_and_is_reversible(pg_factory):
    ids, extra, v1_id, v1_snapshot = await _pg_scenario(pg_factory)
    async with pg_factory() as db:
        pm = await db.get(User, ids["pm"])
        result = await VersioningService(db).rollback(ids["project"], v1_id, pm)
    async with pg_factory() as db:
        await _check_rollback(db, ids, extra, v1_snapshot, result)
        pre_snapshot = (await db.get(ProjectVersion, result["summary"]["pre_rollback_version_id"])).snapshot
    async with pg_factory() as db:
        pm = await db.get(User, ids["pm"])
        reverse = await VersioningService(db).rollback(
            ids["project"], result["summary"]["pre_rollback_version_id"], pm
        )
    async with pg_factory() as db:
        await _check_reverse(db, ids, extra, pre_snapshot, reverse)


@pytest.mark.asyncio
async def test_pg_rollback_failure_leaves_no_partial_changes(pg_factory, monkeypatch):
    ids, extra, v1_id, _ = await _pg_scenario(pg_factory)

    async def boom(*args, **kwargs):
        raise RuntimeError("injected failure")

    # Lỗi ở bước cuối (sau khi mọi thay đổi dữ liệu đã flush).
    monkeypatch.setattr("app.services.job_service.enqueue", boom)
    async with pg_factory() as db:
        pm = await db.get(User, ids["pm"])
        with pytest.raises(RuntimeError):
            await VersioningService(db).rollback(ids["project"], v1_id, pm)
        await db.rollback()
    async with pg_factory() as db:
        tasks = await _tasks(db, ids["project"])
        assert set(tasks) == {"A2", "C", "D"}
        assert tasks["A2"].phase_id == extra["p2"]
        assert all(task.archived_at is None for task in tasks.values())
        assert await db.scalar(select(func.count()).select_from(ProjectVersion)) == 1
        assert await db.get(Phase, extra["p2"]) is not None
