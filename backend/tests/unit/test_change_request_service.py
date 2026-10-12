"""Change Request CRUD tối giản — nền cho AI Impact Analysis (SOP-AI-002).

Submit tạo chuỗi duyệt BA -> PO -> PM (A1); phần cuối file kiểm tra trên SQLite thật và migration.
"""
import importlib.util
from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
import sqlalchemy as sa
from sqlalchemy import func, insert, inspect, select
from sqlalchemy.exc import IntegrityError

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnprocessableException,
)
from app.models.approval import Approval, ApprovalStatus
from app.models.associations import project_members
from app.models.change_request import ChangeRequest, CRStatus
from app.models.project import Project
from app.schemas.change_request import ChangeRequestCreate
from app.services.change_request_service import ChangeRequestService
from app.services.phase2_common import ProjectContext


def _simulate_db_defaults(item):
    # Mo phong RETURNING cua asyncpg: mot INSERT that se dien id/created_at khi
    # flush; fake db o day khong cham DB nen phai tu gan.
    if getattr(item, "id", None) is None:
        item.id = 999
    if getattr(item, "created_at", None) is None:
        item.created_at = datetime.now(UTC)


def fake_db(**overrides):
    values = {
        "add": Mock(side_effect=_simulate_db_defaults),
        "flush": AsyncMock(),
        "get": AsyncMock(return_value=None),
        "scalar": AsyncMock(return_value=None),
        "scalars": AsyncMock(),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def user(user_id=1):
    return SimpleNamespace(id=user_id)


def project_context(role="PM", is_admin=False):
    return ProjectContext(project=SimpleNamespace(id=7), role=role, is_admin=is_admin)


@pytest.mark.asyncio
async def test_pm_can_create_change_request():
    service = ChangeRequestService(fake_db())
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ):
        response = await service.create(
            7, ChangeRequestCreate(title="Add SSO", description="Add SSO login"), user()
        )
    assert response.status == "DRAFT"
    assert response.title == "Add SSO"


@pytest.mark.asyncio
async def test_member_cannot_create_change_request():
    service = ChangeRequestService(fake_db())
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="Member")),
    ):
        with pytest.raises(ForbiddenException):
            await service.create(
                7, ChangeRequestCreate(title="Add SSO", description="Add SSO login"), user()
            )


@pytest.mark.asyncio
async def test_submit_moves_draft_to_submitted():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y", status=CRStatus.DRAFT,
        created_at=datetime.now(UTC),
    )
    db = fake_db(get=AsyncMock(return_value=item))
    service = ChangeRequestService(db)
    # Fake db không có bảng thành viên: giả lập dự án đã đủ vai trò duyệt.
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ), patch.object(ChangeRequestService, "_missing_approval_roles", AsyncMock(return_value=[])):
        response = await service.submit(3, user())
    assert response.status == "SUBMITTED"
    added = [call.args[0] for call in db.add.call_args_list]
    steps = [(a.step_order, a.required_role) for a in added if isinstance(a, Approval)]
    assert steps == [(1, "BA"), (2, "PO"), (3, "PM")]


@pytest.mark.asyncio
async def test_submit_rejects_non_draft():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y",
        status=CRStatus.SUBMITTED,
    )
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=item)))
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ):
        with pytest.raises(ConflictException):
            await service.submit(3, user())


@pytest.mark.asyncio
async def test_submit_missing_change_request_raises_not_found():
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=None)))
    with pytest.raises(NotFoundException):
        await service.submit(999, user())


@pytest.mark.asyncio
async def test_other_member_cannot_submit_someone_elses_change_request():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y", status=CRStatus.DRAFT
    )
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=item)))
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="Member")),
    ):
        with pytest.raises(ForbiddenException):
            await service.submit(3, user(user_id=2))


# ─── Chuỗi duyệt trên SQLite thật (A1) ─────────────────────────────────────────


async def _project_with_roles(session, make_user, seed_roles, roles=("BA", "PO", "PM")):
    """Tạo dự án, mỗi vai trò trong `roles` có một thành viên; trả về (project, users theo vai trò)."""
    members = {name: await make_user() for name in roles}
    # pm_id bắt buộc: khi không muốn có PM, đặt pm_id là admin hệ thống (không được tính).
    pm_id = members["PM"].id if "PM" in roles else (await make_user(superuser=True)).id
    project = Project(name="CR project", pm_id=pm_id)
    session.add(project)
    await session.flush()
    for name, member in members.items():
        await _add_member(session, project, member, seed_roles[name])
    return project, members


async def _add_member(session, project, member, role):
    await session.execute(
        insert(project_members).values(project_id=project.id, user_id=member.id, role_id=role.id)
    )


async def _draft_cr(session, project, requester):
    item = ChangeRequest(
        project_id=project.id, requested_by_id=requester.id, title="X", description="Y",
        status=CRStatus.DRAFT,
    )
    session.add(item)
    await session.flush()
    return item


async def _steps(session, cr_id):
    rows = await session.scalars(
        select(Approval).where(Approval.change_request_id == cr_id).order_by(Approval.step_order)
    )
    return [(a.step_order, a.required_role, a.status, a.approver_id) for a in rows]


@pytest.mark.asyncio
async def test_submit_creates_three_pending_steps(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles)
    item = await _draft_cr(session, project, members["BA"])
    response = await ChangeRequestService(session).submit(item.id, members["BA"])
    assert response.status == "SUBMITTED"
    assert await _steps(session, item.id) == [
        (1, "BA", ApprovalStatus.PENDING, None),
        (2, "PO", ApprovalStatus.PENDING, None),
        (3, "PM", ApprovalStatus.PENDING, None),
    ]


@pytest.mark.asyncio
async def test_repeated_submit_does_not_duplicate_steps(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles)
    item = await _draft_cr(session, project, members["PM"])
    service = ChangeRequestService(session)
    await service.submit(item.id, members["PM"])
    # Đường 1: kiểm tra trạng thái chặn submit lại.
    with pytest.raises(ConflictException):
        await service.submit(item.id, members["PM"])
    # Đường 2: CR bị đưa về DRAFT nhưng chuỗi đã tồn tại thì vẫn không tạo lại.
    item.status = CRStatus.DRAFT
    await session.flush()
    with pytest.raises(ConflictException):
        await service.submit(item.id, members["PM"])
    assert len(await _steps(session, item.id)) == 3


@pytest.mark.asyncio
async def test_unique_constraint_blocks_duplicate_step(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles)
    item = await _draft_cr(session, project, members["PM"])
    await ChangeRequestService(session).submit(item.id, members["PM"])
    # Đường 3: ràng buộc DB chặn bước trùng dù lớp service bị vượt qua.
    session.add(Approval(change_request_id=item.id, step_order=1, required_role="BA"))
    with pytest.raises(IntegrityError):
        await session.flush()


@pytest.mark.asyncio
async def test_submit_missing_role_names_role_and_keeps_draft(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles, roles=("BA", "PM"))
    item = await _draft_cr(session, project, members["PM"])
    with pytest.raises(UnprocessableException) as error:
        await ChangeRequestService(session).submit(item.id, members["PM"])
    assert error.value.status_code == 422
    assert error.value.detail == "missing_roles: PO"
    assert item.status == CRStatus.DRAFT
    assert await _steps(session, item.id) == []


@pytest.mark.asyncio
async def test_admin_and_inactive_members_do_not_count(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles, roles=("PM",))
    superuser = await make_user(superuser=True)
    admin_by_role = await make_user(roles=[seed_roles["Admin"]])
    inactive = await make_user(active=False)
    await _add_member(session, project, superuser, seed_roles["BA"])
    await _add_member(session, project, admin_by_role, seed_roles["PO"])
    item = await _draft_cr(session, project, members["PM"])
    with pytest.raises(UnprocessableException) as error:
        await ChangeRequestService(session).submit(item.id, members["PM"])
    assert error.value.detail == "missing_roles: BA, PO"
    # Thành viên không hoạt động cũng không được tính.
    project2 = Project(name="Inactive", pm_id=members["PM"].id)
    session.add(project2)
    await session.flush()
    await _add_member(session, project2, inactive, seed_roles["BA"])
    assert await ChangeRequestService(session)._missing_approval_roles(project2.id) == ["BA", "PO"]


@pytest.mark.asyncio
async def test_project_pm_id_counts_as_pm(session, make_user, seed_roles):
    project, members = await _project_with_roles(session, make_user, seed_roles, roles=("BA", "PO"))
    service = ChangeRequestService(session)
    assert await service._missing_approval_roles(project.id) == ["PM"]
    pm = await make_user()
    project.pm_id = pm.id
    await session.flush()
    item = await _draft_cr(session, project, members["BA"])
    await service.submit(item.id, members["BA"])
    count = await session.scalar(
        select(func.count()).select_from(Approval).where(Approval.change_request_id == item.id)
    )
    assert count == 3


# ─── Migration chuỗi duyệt ─────────────────────────────────────────────────────


def _load_approval_migration():
    path = Path(__file__).parents[2] / "alembic/versions/20261013_approval_chain.py"
    spec = importlib.util.spec_from_file_location("approval_chain_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_approval_migration_chains_after_ai_request_types():
    migration = _load_approval_migration()
    assert migration.revision == "20261013_approval_chain"
    assert migration.down_revision == "20261013_ai_request_types_phase4"


def _old_approvals_table(metadata):
    # Hình dạng bảng approvals trước migration, theo migration initial.
    status = sa.Enum("PENDING", "APPROVED", "REJECTED", "REVISIONS_REQUESTED", name="approvalstatus")
    return sa.Table(
        "approvals", metadata,
        sa.Column("id", sa.Integer(), primary_key=True),
        # Bỏ khóa ngoại: MetaData riêng không thấy bảng khác; phép so sánh chỉ xét cột/unique.
        sa.Column("change_request_id", sa.Integer(), nullable=False),
        sa.Column("approver_id", sa.Integer(), nullable=False),
        sa.Column("step_order", sa.Integer(), nullable=False),
        sa.Column("status", status, nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Index("ix_approvals_cr_approver", "change_request_id", "approver_id"),
        sa.Index("ix_approvals_id", "id"),
    )


@pytest.mark.asyncio
async def test_approval_migration_matches_model_backfills_and_downgrades(engine):
    migration = _load_approval_migration()
    table = Approval.__table__

    def migrate(connection, upgrade):
        with Operations.context(MigrationContext.configure(connection)):
            (migration.upgrade if upgrade else migration.downgrade)()

    def shape(connection):
        inspector = inspect(connection)
        columns = {c["name"]: c["nullable"] for c in inspector.get_columns(table.name)}
        uniques = {
            (u["name"], tuple(u["column_names"]))
            for u in inspector.get_unique_constraints(table.name)
        }
        return columns, uniques

    def seed_old(connection):
        table.drop(connection)
        _old_approvals_table(sa.MetaData()).create(connection)
        # Bước 2 bị trùng: migration giữ dòng id nhỏ nhất.
        for row_id, step in ((1, 1), (2, 2), (3, 2), (4, 3)):
            connection.execute(sa.text(
                "INSERT INTO approvals (id, change_request_id, approver_id, step_order, status, "
                f"created_at, updated_at) VALUES ({row_id}, 1, 1, {step}, 'APPROVED', "
                "'2026-01-01', '2026-01-01')"
            ))

    async with engine.begin() as db:
        model_shape = await db.run_sync(shape)
        await db.run_sync(seed_old)
        await db.run_sync(lambda connection: migrate(connection, True))
        assert await db.run_sync(shape) == model_shape
        rows = (await db.execute(sa.text(
            "SELECT id, step_order, required_role FROM approvals ORDER BY id"
        ))).all()
        assert [tuple(r) for r in rows] == [(1, 1, "BA"), (2, 2, "PO"), (4, 3, "PM")]
        await db.run_sync(lambda connection: migrate(connection, False))
        columns, uniques = await db.run_sync(shape)
        assert "required_role" not in columns and columns["approver_id"] is False
        assert uniques == set()
