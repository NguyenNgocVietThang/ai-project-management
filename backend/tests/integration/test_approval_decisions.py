"""Quyết định bước duyệt CR (A2): service + endpoint trên SQLite thật.

App test tự include router approvals với prefix /api/v1 (giống cách router.py mount
change_requests), không phụ thuộc vào router.py.
"""
import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import insert, select

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.api.v1.endpoints import approvals as approvals_endpoint
from app.core.dependencies import get_current_user
from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.approval import Approval, ApprovalStatus
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.change_request import ChangeRequest, CRStatus
from app.models.notification import Notification, NotificationType
from app.models.project import Project
from app.services import approval_service as approval_module
from app.services.approval_service import ApprovalService, role_member_ids
from app.services.change_request_service import ChangeRequestService


@pytest.fixture(autouse=True)
def _no_ws_publish(monkeypatch):
    # Không chạm Redis thật: thông báo vẫn ghi vào DB, chỉ bỏ phần publish WS.
    async def noop(messages):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish_many", noop)


async def _setup(session, make_user, seed_roles):
    """Dự án đủ BA/PO/PM (thêm BA thứ hai và một Member), CR đã submit."""
    users = {
        "BA": await make_user(), "BA2": await make_user(), "PO": await make_user(),
        "PM": await make_user(), "Member": await make_user(),
    }
    project = Project(name="Approval project", pm_id=users["PM"].id)
    session.add(project)
    await session.flush()
    for key, role in (("BA", "BA"), ("BA2", "BA"), ("PO", "PO"), ("PM", "PM"), ("Member", "Member")):
        await session.execute(insert(project_members).values(
            project_id=project.id, user_id=users[key].id, role_id=seed_roles[role].id,
        ))
    cr = ChangeRequest(
        project_id=project.id, requested_by_id=users["BA"].id, title="Add SSO",
        description="Y", status=CRStatus.DRAFT,
    )
    session.add(cr)
    await session.flush()
    await ChangeRequestService(session).submit(cr.id, users["BA"])
    return project, cr, users


async def _statuses(session, cr_id):
    rows = await session.scalars(
        select(Approval).where(Approval.change_request_id == cr_id).order_by(Approval.step_order)
    )
    return [a.status for a in rows]


# --- Service ---------------------------------------------------------------------


@pytest.mark.asyncio
async def test_full_chain_approves_cr_and_calls_hook(session, make_user, seed_roles, monkeypatch):
    _, cr, users = await _setup(session, make_user, seed_roles)
    hook_calls = []

    async def hook(db, item, user):
        hook_calls.append((item.id, item.status, user.id))

    monkeypatch.setattr(approval_module, "on_change_request_approved", hook)
    service = ApprovalService(session)

    chain = await service.approve(cr.id, 1, users["BA"], "ok")
    assert chain.change_request_status == "UNDER_REVIEW"
    assert chain.current_step_order == 2
    assert chain.steps[0].approver_id == users["BA"].id
    assert chain.steps[0].comment == "ok" and chain.steps[0].decided_at is not None
    assert chain.steps[0].can_decide is False

    chain = await service.approve(cr.id, 2, users["PO"])
    assert chain.change_request_status == "UNDER_REVIEW" and chain.current_step_order == 3
    assert hook_calls == []
    chain = await service.approve(cr.id, 3, users["PM"])
    assert chain.change_request_status == "APPROVED"
    assert chain.current_step_order is None
    assert [s.status for s in chain.steps] == ["APPROVED"] * 3
    assert hook_calls == [(cr.id, CRStatus.APPROVED, users["PM"].id)]


@pytest.mark.asyncio
async def test_wrong_role_is_forbidden(session, make_user, seed_roles):
    _, cr, users = await _setup(session, make_user, seed_roles)
    service = ApprovalService(session)
    for key in ("PO", "PM", "Member"):
        with pytest.raises(ForbiddenException):
            await service.approve(cr.id, 1, users[key])
    # Admin hệ thống không được quyết định dù xem được chuỗi.
    admin = await make_user(superuser=True)
    with pytest.raises(ForbiddenException):
        await service.approve(cr.id, 1, admin)
    chain = await service.list_chain(cr.id, admin)
    assert not any(s.can_decide for s in chain.steps)
    # Người ngoài dự án.
    with pytest.raises(ForbiddenException):
        await service.list_chain(cr.id, await make_user())


@pytest.mark.asyncio
async def test_wrong_step_or_finished_step_conflicts(session, make_user, seed_roles):
    _, cr, users = await _setup(session, make_user, seed_roles)
    service = ApprovalService(session)
    # PO đúng vai trò nhưng bước 2 chưa tới lượt.
    with pytest.raises(ConflictException):
        await service.approve(cr.id, 2, users["PO"])
    await service.approve(cr.id, 1, users["BA"])
    # Bước đã duyệt: BA khác cùng vai trò nhận 409.
    with pytest.raises(ConflictException):
        await service.approve(cr.id, 1, users["BA2"])
    with pytest.raises(NotFoundException):
        await service.approve(cr.id, 9, users["PO"])
    with pytest.raises(NotFoundException):
        await service.approve(99999, 1, users["PO"])


@pytest.mark.asyncio
async def test_cr_not_under_approval_conflicts(session, make_user, seed_roles):
    _, cr, users = await _setup(session, make_user, seed_roles)
    item = await session.get(ChangeRequest, cr.id)
    item.status = CRStatus.CANCELLED
    await session.flush()
    with pytest.raises(ConflictException):
        await ApprovalService(session).approve(cr.id, 1, users["BA"])


@pytest.mark.asyncio
async def test_reject_ends_cr_and_cancels_later_steps(session, make_user, seed_roles):
    _, cr, users = await _setup(session, make_user, seed_roles)
    service = ApprovalService(session)
    await service.approve(cr.id, 1, users["BA"])
    chain = await service.reject(cr.id, 2, users["PO"], "Out of scope")
    assert chain.change_request_status == "REJECTED"
    assert [s.status for s in chain.steps] == ["APPROVED", "REJECTED", "CANCELLED"]
    assert chain.steps[1].comment == "Out of scope"
    assert chain.current_step_order is None
    with pytest.raises(ConflictException):
        await service.approve(cr.id, 3, users["PM"])
    assert await _statuses(session, cr.id) == [
        ApprovalStatus.APPROVED, ApprovalStatus.REJECTED, ApprovalStatus.CANCELLED,
    ]


@pytest.mark.asyncio
async def test_audit_and_notifications(session, make_user, seed_roles):
    _, cr, users = await _setup(session, make_user, seed_roles)
    service = ApprovalService(session)
    await service.approve(cr.id, 1, users["BA"])
    notes = list(await session.scalars(select(Notification)))
    assert [(n.user_id, n.notification_type) for n in notes] == [
        (users["PO"].id, NotificationType.CR_NEEDS_REVIEW)
    ]
    await service.reject(cr.id, 2, users["PO"], "No")
    notes = list(await session.scalars(select(Notification).order_by(Notification.id)))
    assert (notes[-1].user_id, notes[-1].notification_type) == (
        users["BA"].id, NotificationType.CR_REJECTED,
    )
    actions = [
        (a.action, a.entity_type)
        for a in await session.scalars(select(AuditLog).order_by(AuditLog.id))
    ]
    assert ("APPROVE", "Approval") in actions and ("REJECT", "Approval") in actions
    assert actions.count(("UPDATE", "ChangeRequest")) >= 3  # submit, UNDER_REVIEW, REJECTED


@pytest.mark.asyncio
async def test_role_member_ids_includes_pm_id_and_excludes_admins(session, make_user, seed_roles):
    project, _, users = await _setup(session, make_user, seed_roles)
    assert await role_member_ids(session, project.id, "BA") == sorted([users["BA"].id, users["BA2"].id])
    assert await role_member_ids(session, project.id, "PM") == [users["PM"].id]
    admin = await make_user(superuser=True)
    await session.execute(insert(project_members).values(
        project_id=project.id, user_id=admin.id, role_id=seed_roles["PO"].id,
    ))
    assert await role_member_ids(session, project.id, "PO") == [users["PO"].id]


# --- Endpoint --------------------------------------------------------------------


@pytest_asyncio.fixture
async def http_as(session):
    test_app = FastAPI()
    test_app.include_router(approvals_endpoint.router, prefix="/api/v1")

    async def override_db():
        yield session

    test_app.dependency_overrides[get_db] = override_db

    def factory(user):
        test_app.dependency_overrides[get_current_user] = lambda: user
        return AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test")

    yield factory
    test_app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_endpoints_contract(session, make_user, seed_roles, http_as):
    _, cr, users = await _setup(session, make_user, seed_roles)
    base = f"/api/v1/change-requests/{cr.id}/approvals"

    async with http_as(users["BA"]) as http:
        listed = await http.get(base)
        assert listed.status_code == 200
        body = listed.json()
        assert body["change_request_status"] == "SUBMITTED"
        assert [s["can_decide"] for s in body["steps"]] == [True, False, False]
        assert set(body["steps"][0]) == {
            "id", "step_order", "required_role", "status", "approver_id", "approver_name",
            "comment", "decided_at", "can_decide",
        }
        # Không có body vẫn duyệt được (comment tùy chọn).
        approved = await http.post(f"{base}/1/approve")
        assert approved.status_code == 200
        assert approved.json()["steps"][0]["approver_name"] == users["BA"].full_name

    async with http_as(users["PM"]) as http:
        assert (await http.post(f"{base}/2/approve", json={})).status_code == 403

    async with http_as(users["BA2"]) as http:
        # Cùng vai trò nhưng bước đã được quyết định.
        assert (await http.post(f"{base}/1/approve")).status_code == 409

    async with http_as(users["PO"]) as http:
        assert (await http.post(f"{base}/2/reject", json={"reason": "   "})).status_code == 422
        assert (await http.post(f"{base}/2/reject", json={})).status_code == 422
        rejected = await http.post(f"{base}/2/reject", json={"reason": "Too costly"})
        assert rejected.status_code == 200
        assert rejected.json()["change_request_status"] == "REJECTED"
        assert [s["status"] for s in rejected.json()["steps"]] == ["APPROVED", "REJECTED", "CANCELLED"]


@pytest.mark.asyncio
async def test_unverified_user_cannot_decide(session, make_user, seed_roles, http_as):
    _, cr, users = await _setup(session, make_user, seed_roles)
    unverified = await make_user(verified=False)
    await session.execute(insert(project_members).values(
        project_id=cr.project_id, user_id=unverified.id, role_id=seed_roles["BA"].id,
    ))
    async with http_as(unverified) as http:
        response = await http.post(f"/api/v1/change-requests/{cr.id}/approvals/1/approve")
    assert response.status_code == 403
