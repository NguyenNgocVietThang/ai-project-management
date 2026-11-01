"""Mức tác động CR và cổng duyệt G1–G4 (KH-CR, bước B1) trên SQLite thật.

Kịch bản theo tasks/b1-cr-impact-level-plan.md §6. Nguyên tắc được kiểm chứng: AI chỉ gợi ý,
PM chốt mức, con người quyết định từng bước; CR MAJOR cần báo cáo, xác nhận đã đọc và nhận xét.
"""

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import func, insert, select
from sqlalchemy.ext.asyncio import async_sessionmaker

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.api.v1.endpoints import approvals as approvals_endpoint
from app.api.v1.endpoints import change_requests as change_requests_endpoint
from app.core.dependencies import get_current_user
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnprocessableException,
)
from app.db.session import get_db
from app.models.approval import Approval, ApprovalStatus
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.change_request import ChangeRequest, CRStatus
from app.models.impact_report import ImpactReport, RiskLevel
from app.models.notification import Notification, NotificationType
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.change_request import ChangeRequestCreate, ImpactLevelUpdateRequest
from app.schemas.impact_report import ManualImpactReportRequest
from app.services import approval_service as approval_module
from app.services.approval_service import ApprovalService
from app.services.change_request_service import ChangeRequestService


@pytest.fixture(autouse=True)
def _no_ws_publish(monkeypatch):
    # Không chạm Redis thật: thông báo vẫn ghi vào DB, chỉ bỏ phần publish WS.
    async def noop(messages):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish_many", noop)


@pytest.fixture(autouse=True)
def _no_snapshot(monkeypatch):
    # Snapshot khi duyệt cuối đã có test riêng (test_project_versions); ở đây chỉ xét cổng duyệt.
    async def hook(db, item, user):
        return None

    monkeypatch.setattr(approval_module, "on_change_request_approved", hook)


async def _project(session, make_user, seed_roles):
    users = {
        "BA": await make_user(), "BA2": await make_user(), "PO": await make_user(),
        "PM": await make_user(), "Member": await make_user(),
    }
    project = Project(name="Impact project", pm_id=users["PM"].id, budget=1_000_000)
    session.add(project)
    await session.flush()
    for key, role in (("BA", "BA"), ("BA2", "BA"), ("PO", "PO"), ("PM", "PM"), ("Member", "Member")):
        await session.execute(insert(project_members).values(
            project_id=project.id, user_id=users[key].id, role_id=seed_roles[role].id,
        ))
    return project, users


async def _submitted_cr(session, project, users, *, creator="BA", level="MODERATE", confirm=True):
    """Tạo CR qua service (đúng luồng thật), PM chốt mức nếu cần, rồi submit."""
    service = ChangeRequestService(session)
    created = await service.create(
        project.id,
        ChangeRequestCreate(title="Add SSO", description="Y", impact_level=level),
        users[creator],
    )
    if confirm and not created.impact_level_confirmed:
        await service.set_impact_level(
            created.id, ImpactLevelUpdateRequest(level=level), users["PM"]
        )
    await service.submit(created.id, users[creator])
    return created.id


async def _add_report(session, cr_id, revision=1, source="AI"):
    report = ImpactReport(
        change_request_id=cr_id, risk_level=RiskLevel.HIGH, risk_score=7, schedule_impact_days=12,
        cost_impact=0, summary="Big change", revision=revision, source=source,
        suggested_impact_level="MAJOR",
    )
    session.add(report)
    await session.flush()
    return report


# --- Tạo CR và chốt mức ------------------------------------------------------------


@pytest.mark.asyncio
async def test_pm_created_cr_is_confirmed_ba_created_cr_is_not(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    service = ChangeRequestService(session)
    by_pm = await service.create(
        project.id, ChangeRequestCreate(title="By PM", description="Y", impact_level="MAJOR"), users["PM"]
    )
    assert by_pm.impact_level == "MAJOR" and by_pm.impact_level_confirmed
    assert by_pm.impact_level_confirmed_by_id == users["PM"].id
    by_ba = await service.create(project.id, ChangeRequestCreate(title="By BA", description="Y"), users["BA"])
    assert by_ba.impact_level == "MODERATE" and not by_ba.impact_level_confirmed


@pytest.mark.asyncio
async def test_g1_unconfirmed_level_blocks_approve_and_reject(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, confirm=False)
    approvals = ApprovalService(session)
    for decide in (
        approvals.approve(cr_id, 1, users["BA"], "ok"),
        approvals.reject(cr_id, 1, users["BA"], "no"),
    ):
        with pytest.raises(UnprocessableException) as exc:
            await decide
        assert exc.value.detail == "impact_level_unconfirmed"
    chain = await approvals.list_chain(cr_id, users["BA"])
    assert chain.impact_level_confirmed is False
    # PM chốt xong thì BA duyệt được.
    await ChangeRequestService(session).set_impact_level(
        cr_id, ImpactLevelUpdateRequest(level="MODERATE"), users["PM"]
    )
    chain = await approvals.approve(cr_id, 1, users["BA"], "ok")
    assert chain.steps[0].status == "APPROVED"
    assert chain.steps[0].impact_level_at_decision == "MODERATE"


@pytest.mark.asyncio
async def test_only_project_pm_can_set_level(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, confirm=False)
    service = ChangeRequestService(session)
    body = ImpactLevelUpdateRequest(level="MINOR")
    for key in ("BA", "PO", "Member"):
        with pytest.raises(ForbiddenException):
            await service.set_impact_level(cr_id, body, users[key])
    with pytest.raises(ForbiddenException):
        await service.set_impact_level(cr_id, body, await make_user(superuser=True))
    with pytest.raises(ForbiddenException):
        await service.set_impact_level(cr_id, body, await make_user())
    with pytest.raises(NotFoundException):
        await service.set_impact_level(99999, body, users["PM"])


@pytest.mark.asyncio
async def test_lowering_major_requires_reason_and_is_audited(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    service = ChangeRequestService(session)
    with pytest.raises(UnprocessableException) as exc:
        await service.set_impact_level(cr_id, ImpactLevelUpdateRequest(level="MINOR", reason="  "), users["PM"])
    assert exc.value.detail == "reason_required"
    result = await service.set_impact_level(
        cr_id, ImpactLevelUpdateRequest(level="MINOR", reason="Chỉ đổi nhãn nút"), users["PM"]
    )
    assert result.impact_level == "MINOR"
    assert result.impact_level_change_reason == "Chỉ đổi nhãn nút"
    await session.flush()
    audit = await session.scalar(
        select(AuditLog).where(AuditLog.action == "IMPACT_LEVEL", AuditLog.entity_id == cr_id)
        .order_by(AuditLog.id.desc())
    )
    assert audit.old_values["impact_level"] == "MAJOR"
    assert audit.new_values["impact_level"] == "MINOR"
    assert audit.new_values["reason"] == "Chỉ đổi nhãn nút"


# --- Cổng G2–G4 với CR MAJOR -------------------------------------------------------


@pytest.mark.asyncio
async def test_major_without_report_cannot_be_approved_but_can_be_rejected(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    approvals = ApprovalService(session)
    chain = await approvals.list_chain(cr_id, users["BA"])
    assert chain.requires_report and chain.requires_acknowledgement and chain.requires_comment
    assert chain.report_revision is None
    with pytest.raises(UnprocessableException) as exc:
        await approvals.approve(cr_id, 1, users["BA"], "ok", acknowledged_report_revision=1)
    assert exc.value.detail == "impact_report_required"
    chain = await approvals.reject(cr_id, 1, users["BA"], "Thiếu phân tích")
    assert chain.change_request_status == "REJECTED"


@pytest.mark.asyncio
async def test_major_needs_matching_acknowledgement_and_comment(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    await _add_report(session, cr_id, revision=2)
    approvals = ApprovalService(session)
    cases = [
        ({"comment": "ok"}, "acknowledgement_required"),
        ({"comment": "ok", "acknowledged_report_revision": 1}, "impact_report_changed"),
        ({"comment": None, "acknowledged_report_revision": 2}, "comment_required"),
    ]
    for kwargs, code in cases:
        with pytest.raises(UnprocessableException) as exc:
            await approvals.approve(cr_id, 1, users["BA"], **kwargs)
        assert exc.value.detail == code
    for step, key in ((1, "BA"), (2, "PO"), (3, "PM")):
        chain = await approvals.approve(
            cr_id, step, users[key], f"Đã đọc báo cáo ({key})", acknowledged_report_revision=2
        )
    assert chain.change_request_status == "APPROVED"
    assert [s.acknowledged_report_revision for s in chain.steps] == [2, 2, 2]
    assert [s.impact_level_at_decision for s in chain.steps] == ["MAJOR"] * 3
    await session.flush()
    audit = await session.scalar(
        select(AuditLog).where(AuditLog.action == "APPROVE").order_by(AuditLog.id.desc())
    )
    assert audit.new_values["impact_level"] == "MAJOR"
    assert audit.new_values["acknowledged_report_revision"] == 2


@pytest.mark.asyncio
async def test_non_major_acknowledgement_is_optional_but_must_match(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MODERATE")
    approvals = ApprovalService(session)
    chain = await approvals.list_chain(cr_id, users["BA"])
    assert not (chain.requires_report or chain.requires_acknowledgement or chain.requires_comment)
    with pytest.raises(UnprocessableException) as exc:
        await approvals.approve(cr_id, 1, users["BA"], acknowledged_report_revision=1)
    assert exc.value.detail == "impact_report_required"
    await _add_report(session, cr_id, revision=3)
    with pytest.raises(UnprocessableException) as exc:
        await approvals.approve(cr_id, 1, users["BA"], acknowledged_report_revision=2)
    assert exc.value.detail == "impact_report_changed"
    chain = await approvals.approve(cr_id, 1, users["BA"], acknowledged_report_revision=3)
    assert chain.steps[0].acknowledged_report_revision == 3
    # Không gửi xác nhận, không nhận xét: vẫn duyệt được ở mức MODERATE.
    chain = await approvals.approve(cr_id, 2, users["PO"])
    assert chain.steps[1].status == "APPROVED"


# --- Đổi mức giữa chừng ------------------------------------------------------------


@pytest.mark.asyncio
async def test_raising_level_reopens_approved_steps_and_notifies(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MODERATE")
    approvals = ApprovalService(session)
    await approvals.approve(cr_id, 1, users["BA"], "ok")
    await approvals.approve(cr_id, 2, users["PO"], "ok")
    await session.flush()
    # Chỉ xét thông báo phát sinh do nâng mức (bỏ qua thông báo mời PO/PM duyệt trước đó).
    before = await session.scalar(select(func.max(Notification.id))) or 0
    result = await ChangeRequestService(session).set_impact_level(
        cr_id, ImpactLevelUpdateRequest(level="MAJOR"), users["PM"]
    )
    assert result.status == "SUBMITTED" and result.impact_level == "MAJOR"
    steps = list(await session.scalars(
        select(Approval).where(Approval.change_request_id == cr_id).order_by(Approval.step_order)
    ))
    assert [s.status for s in steps] == [ApprovalStatus.PENDING] * 3
    assert all(s.approver_id is None and s.comment is None for s in steps)
    await session.flush()
    notified = set(await session.scalars(
        select(Notification.user_id).where(
            Notification.id > before,
            Notification.notification_type == NotificationType.CR_NEEDS_REVIEW,
            Notification.related_entity_id == cr_id,
        )
    ))
    assert notified == {users["BA"].id, users["BA2"].id}
    audit = await session.scalar(
        select(AuditLog).where(AuditLog.action == "IMPACT_LEVEL").order_by(AuditLog.id.desc())
    )
    assert audit.new_values["reopened_steps"] == [1, 2]
    # Giờ là MAJOR: BA phải duyệt lại theo điều kiện chặt hơn.
    with pytest.raises(UnprocessableException):
        await approvals.approve(cr_id, 1, users["BA"], "ok")


@pytest.mark.asyncio
async def test_lowering_level_keeps_approved_steps(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    await _add_report(session, cr_id)
    approvals = ApprovalService(session)
    await approvals.approve(cr_id, 1, users["BA"], "ok", acknowledged_report_revision=1)
    result = await ChangeRequestService(session).set_impact_level(
        cr_id, ImpactLevelUpdateRequest(level="MODERATE", reason="Phạm vi nhỏ hơn dự kiến"), users["PM"]
    )
    assert result.status == "UNDER_REVIEW"
    chain = await approvals.list_chain(cr_id, users["PO"])
    assert chain.steps[0].status == "APPROVED" and chain.current_step_order == 2


@pytest.mark.asyncio
async def test_level_cannot_change_after_cr_is_closed(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MINOR")
    await ApprovalService(session).reject(cr_id, 1, users["BA"], "no")
    with pytest.raises(ConflictException):
        await ChangeRequestService(session).set_impact_level(
            cr_id, ImpactLevelUpdateRequest(level="MAJOR"), users["PM"]
        )


# --- Báo cáo tác động: đọc và nhập thủ công ----------------------------------------


@pytest.mark.asyncio
async def test_manual_report_rules(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    service = ChangeRequestService(session)
    with pytest.raises(NotFoundException):
        await service.get_impact_report(cr_id, users["Member"])
    body = ManualImpactReportRequest(
        risk_level="HIGH", schedule_impact_days=14, cost_impact=50_000, summary="AI hết quota, PM đánh giá",
        suggested_impact_level="MAJOR",
    )
    with pytest.raises(ForbiddenException):
        await service.set_manual_impact_report(cr_id, body, users["BA"])
    first = await service.set_manual_impact_report(cr_id, body, users["PM"])
    assert (first.source, first.revision, first.advisory) == ("MANUAL", 1, True)
    assert first.created_by_id == users["PM"].id and first.risk_score == 7.5
    second = await service.set_manual_impact_report(cr_id, body, users["PM"])
    assert second.revision == 2
    read = await service.get_impact_report(cr_id, users["Member"])
    assert read.revision == 2 and read.summary == "AI hết quota, PM đánh giá"
    with pytest.raises(ForbiddenException):
        await service.get_impact_report(cr_id, await make_user())
    # Báo cáo thủ công đủ điều kiện cho cổng MAJOR.
    chain = await ApprovalService(session).approve(
        cr_id, 1, users["BA"], "Đã đọc", acknowledged_report_revision=2
    )
    assert chain.steps[0].status == "APPROVED"


@pytest.mark.asyncio
async def test_manual_report_never_overwrites_ai_report(session, make_user, seed_roles):
    project, users = await _project(session, make_user, seed_roles)
    cr_id = await _submitted_cr(session, project, users, level="MAJOR")
    await _add_report(session, cr_id, source="AI")
    body = ManualImpactReportRequest(risk_level="LOW", schedule_impact_days=0, cost_impact=0, summary="x")
    with pytest.raises(ConflictException) as exc:
        await ChangeRequestService(session).set_manual_impact_report(cr_id, body, users["PM"])
    assert exc.value.detail == "ai_report_exists"


# --- Job AI: gợi ý được lưu, mức của CR không đổi ----------------------------------


@pytest.mark.asyncio
async def test_ai_job_records_suggestion_bumps_revision_and_never_changes_cr_level(
    engine, session, make_user, seed_roles, monkeypatch
):
    from app.core.job_runner import JobRunner
    from app.models.ai_request import AIRequest, AIRequestStatus
    from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status
    from app.services.ai_service import AIService

    project, users = await _project(session, make_user, seed_roles)
    session.add(Task(name="Login", project_id=project.id))
    cr_id = await _submitted_cr(session, project, users, level="MINOR")
    ba_id = users["BA"].id
    await session.commit()

    async def fake_ai(change_request, project, tasks, cpm_summary):
        return {
            "risk_level": "HIGH", "risk_score": 8, "schedule_impact_days": 15, "cost_impact": 0,
            "affected_task_ids": [], "summary": "Ảnh hưởng lớn",
            "suggested_impact_level": "MAJOR", "impact_level_rationale": "Trễ 15 ngày",
        }

    monkeypatch.setattr("app.services.ai.impact_analyzer.generate_impact_analysis", fake_ai)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    for expected_revision in (1, 2):
        # Nạp lại user mỗi vòng: expire_all ở vòng trước làm thuộc tính hết hạn.
        ba = await session.get(User, ba_id)
        response = await AIService(session).request_impact_analysis(cr_id, ba)
        await session.commit()
        runner = JobRunner(factory, AI_HANDLERS, on_transition=mirror_ai_status)
        assert await runner.poll_once() == 1
        await runner.stop()  # chờ job chạy xong
        session.expire_all()
        request = await session.get(AIRequest, int(response.job_id))
        assert request.status == AIRequestStatus.COMPLETED, request.error_message
        report = await session.scalar(select(ImpactReport).where(ImpactReport.change_request_id == cr_id))
        assert report.revision == expected_revision and report.source == "AI"
        assert report.suggested_impact_level == "MAJOR"
        assert report.impact_level_rationale == "Trễ 15 ngày"
        assert report.created_by_id == ba_id
    cr = await session.get(ChangeRequest, cr_id)
    # AI gợi ý MAJOR nhưng mức của CR vẫn là mức PM đã chốt.
    assert cr.impact_level == "MINOR" and cr.status == CRStatus.SUBMITTED
    assert await session.scalar(select(Approval.id).where(Approval.approver_id.is_not(None))) is None


# --- Endpoint ----------------------------------------------------------------------


@pytest_asyncio.fixture
async def http_as(session):
    test_app = FastAPI()
    test_app.include_router(approvals_endpoint.router, prefix="/api/v1")
    test_app.include_router(change_requests_endpoint.router, prefix="/api/v1")

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
    project, users = await _project(session, make_user, seed_roles)
    async with http_as(users["BA"]) as http:
        created = await http.post(
            f"/api/v1/projects/{project.id}/change-requests",
            json={"title": "Big change", "description": "Y", "impact_level": "MAJOR"},
        )
        assert created.status_code == 201, created.text
        body = created.json()
        assert body["impact_level"] == "MAJOR" and body["impact_level_confirmed"] is False
        cr_id = body["id"]
        bad = await http.post(
            f"/api/v1/projects/{project.id}/change-requests",
            json={"title": "Bad", "description": "Y", "impact_level": "HUGE"},
        )
        assert bad.status_code == 422
        assert (await http.post(f"/api/v1/change-requests/{cr_id}/submit")).status_code == 200
        assert (await http.get(f"/api/v1/change-requests/{cr_id}/impact-report")).status_code == 404
        denied = await http.post(f"/api/v1/change-requests/{cr_id}/impact-level", json={"level": "MAJOR"})
        assert denied.status_code == 403
    async with http_as(users["PM"]) as http:
        confirmed = await http.post(f"/api/v1/change-requests/{cr_id}/impact-level", json={"level": "MAJOR"})
        assert confirmed.status_code == 200 and confirmed.json()["impact_level_confirmed"] is True
        lowered = await http.post(f"/api/v1/change-requests/{cr_id}/impact-level", json={"level": "MINOR"})
        assert lowered.status_code == 422 and lowered.json()["detail"] == "reason_required"
        manual = await http.put(
            f"/api/v1/change-requests/{cr_id}/impact-report/manual",
            json={"risk_level": "HIGH", "schedule_impact_days": 12, "cost_impact": 0, "summary": "Thủ công"},
        )
        assert manual.status_code == 200, manual.text
        assert manual.json()["advisory"] is True and manual.json()["source"] == "MANUAL"
    async with http_as(users["BA"]) as http:
        base = f"/api/v1/change-requests/{cr_id}/approvals"
        chain = (await http.get(base)).json()
        assert chain["impact_level"] == "MAJOR" and chain["report_revision"] == 1
        assert chain["requires_acknowledgement"] is True
        missing = await http.post(f"{base}/1/approve", json={"comment": "ok"})
        assert missing.status_code == 422 and missing.json()["detail"] == "acknowledgement_required"
        ok = await http.post(f"{base}/1/approve", json={"comment": "Đã đọc", "acknowledged_report_revision": 1})
        assert ok.status_code == 200, ok.text
        assert ok.json()["steps"][0]["acknowledged_report_revision"] == 1
        report = await http.get(f"/api/v1/change-requests/{cr_id}/impact-report")
        assert report.status_code == 200 and report.json()["revision"] == 1
    async with http_as(await make_user()) as http:
        outsider = await http.get(f"/api/v1/change-requests/{cr_id}/impact-report")
        assert outsider.status_code == 403
