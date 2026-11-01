"""CRUD tối giản cho Change Request — nền cho AI Impact Analysis (SOP-AI-002).

Cài đặt tạo/xem và submit DRAFT->SUBMITTED. Khi submit, tạo chuỗi duyệt 3 bước PENDING
(bảng `approvals`, BA -> PO -> PM) trong cùng transaction; việc quyết định từng bước thuộc A2.

Mức tác động (KH-CR): người tạo đề xuất, chỉ PM của dự án chốt/đổi mức; hạ từ MAJOR bắt buộc
lý do; nâng mức khi đã có bước được duyệt thì mở lại các bước đó. Báo cáo tác động chỉ mang
tính tư vấn; PM được nhập đánh giá thủ công khi chưa có báo cáo AI (dự phòng AI lỗi/hết quota).
"""
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy import and_, exists, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnprocessableException,
)
from app.db.session import get_db
from app.models.approval import APPROVAL_STEP_ROLES, Approval, ApprovalStatus
from app.models.associations import project_members, user_roles
from app.models.change_request import IMPACT_LEVEL_RANK, ChangeRequest, CRStatus, ImpactLevel
from app.models.impact_report import ImpactReport, ReportSource, RiskLevel
from app.models.project import Project
from app.models.role import Role
from app.models.user import User
from app.schemas.change_request import (
    ChangeRequestCreate,
    ChangeRequestResponse,
    ImpactLevelUpdateRequest,
)
from app.schemas.impact_report import ImpactReportResponse, ManualImpactReportRequest
from app.services.phase2_common import (
    ProjectContext,
    add_audit,
    get_project_context,
    serialize_model,
)

# CR còn đang mở (chưa kết thúc) mới được đổi mức hoặc nhập báo cáo thủ công.
OPEN_CR_STATUSES = (CRStatus.DRAFT, CRStatus.SUBMITTED, CRStatus.UNDER_REVIEW)
# Điểm rủi ro mặc định cho báo cáo nhập thủ công (PM chỉ chọn mức rủi ro).
MANUAL_RISK_SCORE = {
    RiskLevel.LOW: 2.0, RiskLevel.MEDIUM: 5.0, RiskLevel.HIGH: 7.5, RiskLevel.CRITICAL: 9.0,
}


def _is_project_pm(context: ProjectContext) -> bool:
    # Admin hệ thống không được chốt mức thay PM (tách bạch trách nhiệm như bước duyệt).
    return not context.is_admin and context.role == "PM"


class ChangeRequestService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self, project_id: int, data: ChangeRequestCreate, user: User
    ) -> ChangeRequestResponse:
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can create change requests")
        payload = data.model_dump()
        level = ImpactLevel(payload.pop("impact_level"))
        item = ChangeRequest(
            project_id=project_id,
            requested_by_id=user.id,
            status=CRStatus.DRAFT,
            impact_level=level.value,
            **payload,
        )
        if _is_project_pm(context):
            # PM tạo CR thì mức đề xuất cũng là mức PM chốt.
            item.impact_level_confirmed_by_id = user.id
            item.impact_level_confirmed_at = datetime.now(UTC)
        self.db.add(item)
        await self.db.flush()
        add_audit(
            self.db, user.id, "CREATE", "ChangeRequest", item.id,
            new_values=serialize_model(item), description=f"Created change request {item.title}",
        )
        return ChangeRequestResponse.model_validate(item)

    async def list_for_project(
        self, project_id: int, user: User
    ) -> list[ChangeRequestResponse]:
        await get_project_context(self.db, project_id, user)
        items = list(
            (
                await self.db.scalars(
                    select(ChangeRequest)
                    .where(ChangeRequest.project_id == project_id)
                    .order_by(ChangeRequest.id.desc())
                )
            ).all()
        )
        return [ChangeRequestResponse.model_validate(item) for item in items]

    async def get(self, change_request_id: int, user: User) -> ChangeRequestResponse:
        item = await self._get_or_404(change_request_id)
        await get_project_context(self.db, item.project_id, user)
        return ChangeRequestResponse.model_validate(item)

    async def submit(self, change_request_id: int, user: User) -> ChangeRequestResponse:
        item = await self._get_or_404(change_request_id)
        context = await get_project_context(self.db, item.project_id, user)
        if not context.is_admin and item.requested_by_id != user.id and context.role != "PM":
            raise ForbiddenException("Only the requester or the PM can submit this change request")
        if item.status != CRStatus.DRAFT:
            raise ConflictException("Only a DRAFT change request can be submitted")
        # Chặn submit khi dự án thiếu người cho một vai trò duyệt: CR giữ DRAFT, không tạo bước.
        missing = await self._missing_approval_roles(item.project_id)
        if missing:
            raise UnprocessableException(f"missing_roles: {', '.join(missing)}")
        # Phòng thủ thêm ngoài kiểm tra trạng thái: CR đã có bước duyệt thì không tạo lại.
        # Ràng buộc unique (change_request_id, step_order) là lớp chặn cuối ở DB.
        existing = await self.db.scalar(
            select(Approval.id).where(Approval.change_request_id == item.id).limit(1)
        )
        if existing is not None:
            raise ConflictException("Approval chain already exists for this change request")
        old_status = item.status
        for step_order, role in enumerate(APPROVAL_STEP_ROLES, start=1):
            self.db.add(
                Approval(
                    change_request_id=item.id,
                    approver_id=None,
                    step_order=step_order,
                    required_role=role,
                    status=ApprovalStatus.PENDING,
                )
            )
        item.status = CRStatus.SUBMITTED
        try:
            await self.db.flush()
        except IntegrityError as error:
            # Hai submit đua nhau: cả hai qua kiểm tra trên, ràng buộc unique chặn người sau.
            # Trả 409 thay vì 500; get_db sẽ rollback transaction hỏng.
            raise ConflictException("Approval chain already exists for this change request") from error
        add_audit(
            self.db, user.id, "UPDATE", "ChangeRequest", item.id,
            old_values={"status": old_status}, new_values={"status": item.status},
        )
        return ChangeRequestResponse.model_validate(item)

    async def set_impact_level(
        self, change_request_id: int, data: ImpactLevelUpdateRequest, user: User
    ) -> ChangeRequestResponse:
        """PM chốt hoặc đổi mức tác động; chạy dưới khóa hàng CR như quyết định duyệt."""
        # Import trễ để tránh vòng import với approval_service.
        from app.services.approval_service import reopen_approved_steps

        item = await self._lock_or_404(change_request_id)
        context = await get_project_context(self.db, item.project_id, user)
        if not _is_project_pm(context):
            raise ForbiddenException("Only the project PM can set the impact level")
        if item.status not in OPEN_CR_STATUSES:
            raise ConflictException("Impact level cannot change after the change request is closed")
        old_level = item.impact_level
        new_level = data.level.value
        lowering_major = (
            old_level == ImpactLevel.MAJOR.value and new_level != ImpactLevel.MAJOR.value
        )
        if lowering_major and not data.reason:
            raise UnprocessableException("reason_required")
        was_confirmed = item.impact_level_confirmed_at is not None
        old_status = item.status
        item.impact_level = new_level
        item.impact_level_confirmed_by_id = user.id
        item.impact_level_confirmed_at = datetime.now(UTC)
        if data.reason or new_level != old_level:
            item.impact_level_change_reason = data.reason
        reopened: list[int] = []
        if IMPACT_LEVEL_RANK[new_level] > IMPACT_LEVEL_RANK[old_level]:
            # Nâng mức: các bước đã duyệt dưới điều kiện lỏng hơn phải duyệt lại.
            reopened = await reopen_approved_steps(self.db, item)
        await self.db.flush()
        add_audit(
            self.db, user.id, "IMPACT_LEVEL", "ChangeRequest", item.id,
            old_values={
                "impact_level": old_level, "confirmed": was_confirmed,
                "status": old_status.value if hasattr(old_status, "value") else old_status,
            },
            new_values={
                "impact_level": new_level, "confirmed": True, "reason": data.reason,
                "reopened_steps": reopened,
                "status": item.status.value if hasattr(item.status, "value") else item.status,
            },
            description=f"Set impact level of change request {item.id} to {new_level}",
        )
        return ChangeRequestResponse.model_validate(item)

    async def get_impact_report(self, change_request_id: int, user: User) -> ImpactReportResponse:
        item = await self._get_or_404(change_request_id)
        await get_project_context(self.db, item.project_id, user)
        report = await self.db.scalar(
            select(ImpactReport).where(ImpactReport.change_request_id == item.id)
        )
        if report is None:
            raise NotFoundException("Impact report not found")
        return ImpactReportResponse.model_validate(report)

    async def set_manual_impact_report(
        self, change_request_id: int, data: ManualImpactReportRequest, user: User
    ) -> ImpactReportResponse:
        """PM nhập đánh giá tác động thủ công khi chưa có báo cáo AI (AI lỗi hoặc hết quota)."""
        item = await self._lock_or_404(change_request_id)
        context = await get_project_context(self.db, item.project_id, user)
        if not _is_project_pm(context):
            raise ForbiddenException("Only the project PM can enter a manual impact assessment")
        if item.status not in OPEN_CR_STATUSES:
            raise ConflictException("Change request is closed")
        report = await self.db.scalar(
            select(ImpactReport).where(ImpactReport.change_request_id == item.id)
        )
        if report is not None and report.source == ReportSource.AI.value:
            # Không ghi đè kết quả AI; muốn cập nhật thì chạy lại phân tích AI.
            raise ConflictException("ai_report_exists")
        old_values = (
            {"revision": report.revision, "source": report.source} if report is not None else None
        )
        if report is None:
            report = ImpactReport(change_request_id=item.id, revision=1)
            self.db.add(report)
        else:
            report.revision += 1
        report.source = ReportSource.MANUAL.value
        report.risk_level = data.risk_level
        report.risk_score = MANUAL_RISK_SCORE[data.risk_level]
        report.schedule_impact_days = data.schedule_impact_days
        report.cost_impact = data.cost_impact
        report.summary = data.summary
        report.affected_tasks_json = []
        report.ai_analysis_json = None
        report.suggested_impact_level = (
            data.suggested_impact_level.value if data.suggested_impact_level else None
        )
        report.impact_level_rationale = "Đánh giá thủ công của PM" if data.suggested_impact_level else None
        report.created_by_id = user.id
        await self.db.flush()
        await self.db.refresh(report)
        add_audit(
            self.db, user.id, "UPDATE" if old_values else "CREATE", "ImpactReport", report.id,
            old_values=old_values,
            new_values={"revision": report.revision, "source": report.source},
            description=f"Manual impact assessment for change request {item.id}",
        )
        return ImpactReportResponse.model_validate(report)

    async def _lock_or_404(self, change_request_id: int) -> ChangeRequest:
        item = await self.db.scalar(
            select(ChangeRequest)
            .where(ChangeRequest.id == change_request_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if item is None:
            raise NotFoundException("Change request not found")
        return item

    async def _missing_approval_roles(self, project_id: int) -> list[str]:
        """Các vai trò duyệt chưa có thành viên hợp lệ, theo thứ tự bước.

        Thành viên hợp lệ: dòng project_members còn hoạt động, không phải admin hệ thống
        (superuser hoặc có vai trò hệ thống Admin). PM còn được tính qua `project.pm_id`,
        khớp với cách `get_project_context` coi pm_id là PM.
        """
        admin_role = (
            select(user_roles.c.user_id)
            .join(Role, Role.id == user_roles.c.role_id)
            .where(and_(Role.name == "Admin", user_roles.c.user_id == User.id))
        )
        present = set(
            (
                await self.db.scalars(
                    select(Role.name)
                    .select_from(project_members)
                    .join(Role, Role.id == project_members.c.role_id)
                    .join(User, User.id == project_members.c.user_id)
                    .where(
                        project_members.c.project_id == project_id,
                        Role.name.in_(APPROVAL_STEP_ROLES),
                        User.is_active.is_(True),
                        User.is_superuser.is_(False),
                        ~exists(admin_role),
                    )
                    .distinct()
                )
            ).all()
        )
        if "PM" not in present:
            pm_admin_role = (
                select(user_roles.c.user_id)
                .join(Role, Role.id == user_roles.c.role_id)
                .where(and_(Role.name == "Admin", user_roles.c.user_id == Project.pm_id))
            )
            pm_user = await self.db.scalar(
                select(User.id)
                .join(Project, Project.pm_id == User.id)
                .where(
                    Project.id == project_id,
                    User.is_active.is_(True),
                    User.is_superuser.is_(False),
                    ~exists(pm_admin_role),
                )
            )
            if pm_user is not None:
                present.add("PM")
        return [role for role in APPROVAL_STEP_ROLES if role not in present]

    async def _get_or_404(self, change_request_id: int) -> ChangeRequest:
        item = await self.db.get(ChangeRequest, change_request_id)
        if item is None:
            raise NotFoundException("Change request not found")
        return item


async def get_change_request_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ChangeRequestService:
    return ChangeRequestService(db)


ChangeRequestServiceDep = Annotated[ChangeRequestService, Depends(get_change_request_service)]
