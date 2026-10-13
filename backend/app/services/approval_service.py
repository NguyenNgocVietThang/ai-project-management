"""Quyết định từng bước trong chuỗi duyệt CR BA -> PO -> PM (A2).

Quy tắc:
- Chỉ bước hiện hành (bước PENDING đầu tiên theo step_order) được quyết định.
- Chỉ thành viên có vai trò dự án đúng `required_role` được quyết định, kể cả người tạo CR.
  Admin hệ thống KHÔNG được quyết định: `get_project_context` trả role "Admin" cho họ, không
  phải BA/PO/PM, và A1 cũng không tính admin là người duyệt hợp lệ (tách bạch trách nhiệm).
  Admin vẫn xem được chuỗi duyệt.
- Sai vai trò => 403; bước không phải bước hiện hành, bước không PENDING, hoặc CR không ở
  SUBMITTED/UNDER_REVIEW => 409.
- Khóa hàng CR (`SELECT ... FOR UPDATE` trên PostgreSQL) trước khi đọc các bước, nên hai
  người cùng vai trò quyết định đồng thời thì người thứ hai thấy bước đã xong và nhận 409.
- Quyết định đầu tiên chuyển CR SUBMITTED -> UNDER_REVIEW; từ chối => các bước sau CANCELLED
  và CR REJECTED; duyệt bước cuối (PM) => CR APPROVED và gọi `on_change_request_approved`.
"""
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy import and_, exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.approval import Approval, ApprovalStatus
from app.models.associations import project_members, user_roles
from app.models.change_request import ChangeRequest, CRStatus
from app.models.notification import NotificationType
from app.models.project import Project
from app.models.role import Role
from app.models.user import User
from app.schemas.approval import ApprovalChainResponse, ApprovalStepResponse
from app.services.notification_service import NotificationService
from app.services.phase2_common import ProjectContext, add_audit, get_project_context

# Trạng thái CR cho phép quyết định bước duyệt.
DECIDABLE_CR_STATUSES = (CRStatus.SUBMITTED, CRStatus.UNDER_REVIEW)


async def on_change_request_approved(db: AsyncSession, cr: ChangeRequest, user: User) -> None:
    """Điểm móc khi PM duyệt bước cuối, chạy trong CÙNG transaction với quyết định.

    Chụp snapshot phiên bản dự án (V1) gắn `change_request_id`: mọi thay đổi ghi qua `db`
    được commit cùng lúc CR chuyển APPROVED, hoặc rollback cùng nếu có lỗi.
    """
    # Import trễ để tránh vòng import giữa các service.
    from app.services.versioning_service import KIND_CHANGE_REQUEST, create_snapshot

    await create_snapshot(
        db, cr.project_id, user,
        label=f"CR-{cr.id} được duyệt",
        description=cr.title,
        change_request_id=cr.id,
        kind=KIND_CHANGE_REQUEST,
    )


def _current_step(steps: list[Approval]) -> Approval | None:
    return next((s for s in steps if s.status == ApprovalStatus.PENDING), None)


def _value(enum_or_str) -> str:
    return enum_or_str.value if hasattr(enum_or_str, "value") else str(enum_or_str)


class ApprovalService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Đọc -------------------------------------------------------------------

    async def list_chain(self, change_request_id: int, user: User) -> ApprovalChainResponse:
        cr = await self.db.get(ChangeRequest, change_request_id)
        if cr is None:
            raise NotFoundException("Change request not found")
        context = await get_project_context(self.db, cr.project_id, user)
        steps = await self._steps(cr.id)
        return await self._build_response(cr, steps, context)

    # --- Quyết định ------------------------------------------------------------

    async def approve(
        self, change_request_id: int, step_order: int, user: User, comment: str | None = None
    ) -> ApprovalChainResponse:
        return await self._decide(change_request_id, step_order, user, approve=True, comment=comment)

    async def reject(
        self, change_request_id: int, step_order: int, user: User, reason: str
    ) -> ApprovalChainResponse:
        return await self._decide(change_request_id, step_order, user, approve=False, comment=reason)

    async def _decide(
        self,
        change_request_id: int,
        step_order: int,
        user: User,
        *,
        approve: bool,
        comment: str | None,
    ) -> ApprovalChainResponse:
        # Khóa hàng CR trước mọi kiểm tra trạng thái; populate_existing để đọc lại giá trị
        # mới nhất sau khi chờ khóa, không dùng bản cũ trong identity map.
        cr = await self.db.scalar(
            select(ChangeRequest)
            .where(ChangeRequest.id == change_request_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if cr is None:
            raise NotFoundException("Change request not found")
        context = await get_project_context(self.db, cr.project_id, user)
        steps = await self._steps(cr.id)
        step = next((s for s in steps if s.step_order == step_order), None)
        if step is None:
            raise NotFoundException("Approval step not found")
        if context.is_admin or context.role != step.required_role:
            raise ForbiddenException(f"Only a project {step.required_role} can decide this step")
        if cr.status not in DECIDABLE_CR_STATUSES:
            raise ConflictException("Change request is not under approval")
        current = _current_step(steps)
        if step.status != ApprovalStatus.PENDING or current is None or current.id != step.id:
            raise ConflictException("This approval step is not the current pending step")

        old_cr_status = cr.status
        step.approver_id = user.id
        step.approved_at = datetime.now(UTC)
        step.comment = comment
        step.status = ApprovalStatus.APPROVED if approve else ApprovalStatus.REJECTED
        cancelled: list[int] = []
        next_step: Approval | None = None
        if approve:
            next_step = _current_step(steps)
            cr.status = CRStatus.UNDER_REVIEW if next_step is not None else CRStatus.APPROVED
        else:
            for later in steps:
                if later.step_order > step.step_order and later.status == ApprovalStatus.PENDING:
                    later.status = ApprovalStatus.CANCELLED
                    cancelled.append(later.step_order)
            cr.status = CRStatus.REJECTED
        await self.db.flush()

        add_audit(
            self.db, user.id, "APPROVE" if approve else "REJECT", "Approval", step.id,
            old_values={"status": ApprovalStatus.PENDING.value},
            new_values={"status": _value(step.status), "comment": comment},
            description=f"Step {step.step_order} ({step.required_role}) of change request {cr.id}",
        )
        if cr.status != old_cr_status:
            add_audit(
                self.db, user.id, "UPDATE", "ChangeRequest", cr.id,
                old_values={"status": _value(old_cr_status)},
                new_values={"status": _value(cr.status), "cancelled_steps": cancelled},
            )

        if cr.status == CRStatus.APPROVED:
            # Điểm móc V1: snapshot phiên bản trong cùng transaction với quyết định cuối.
            await on_change_request_approved(self.db, cr, user)

        await self._notify(cr, next_step)
        return await self._build_response(cr, steps, context)

    # --- Thông báo -------------------------------------------------------------

    async def _notify(self, cr: ChangeRequest, next_step: Approval | None) -> None:
        link = f"/projects/{cr.project_id}/change-requests/{cr.id}"
        if next_step is not None:
            recipients = await role_member_ids(self.db, cr.project_id, next_step.required_role)
            await NotificationService.push_many(
                self.db, recipients,
                title="Change request cần bạn duyệt",
                message=f"Change request '{cr.title}' đang chờ bước duyệt {next_step.required_role}",
                ntype=NotificationType.CR_NEEDS_REVIEW,
                link=link, entity_type="ChangeRequest", entity_id=cr.id,
            )
            return
        approved = cr.status == CRStatus.APPROVED
        await NotificationService.push_many(
            self.db, [cr.requested_by_id],
            title="Change request đã được duyệt" if approved else "Change request bị từ chối",
            message=(
                f"Change request '{cr.title}' đã được duyệt"
                if approved
                else f"Change request '{cr.title}' đã bị từ chối"
            ),
            ntype=NotificationType.CR_APPROVED if approved else NotificationType.CR_REJECTED,
            link=link, entity_type="ChangeRequest", entity_id=cr.id,
        )

    # --- Tiện ích --------------------------------------------------------------

    async def _steps(self, change_request_id: int) -> list[Approval]:
        return list(
            (
                await self.db.scalars(
                    select(Approval)
                    .where(Approval.change_request_id == change_request_id)
                    .order_by(Approval.step_order)
                    .execution_options(populate_existing=True)
                )
            ).all()
        )

    async def _build_response(
        self, cr: ChangeRequest, steps: list[Approval], context: ProjectContext
    ) -> ApprovalChainResponse:
        approver_ids = {s.approver_id for s in steps if s.approver_id is not None}
        names: dict[int, str] = {}
        if approver_ids:
            rows = await self.db.execute(
                select(User.id, User.full_name).where(User.id.in_(approver_ids))
            )
            names = {row.id: row.full_name for row in rows}
        current = _current_step(steps) if cr.status in DECIDABLE_CR_STATUSES else None
        return ApprovalChainResponse(
            change_request_id=cr.id,
            change_request_status=_value(cr.status),
            current_step_order=current.step_order if current else None,
            steps=[
                ApprovalStepResponse(
                    id=s.id,
                    step_order=s.step_order,
                    required_role=s.required_role,
                    status=_value(s.status),
                    approver_id=s.approver_id,
                    approver_name=names.get(s.approver_id) if s.approver_id else None,
                    comment=s.comment,
                    decided_at=s.approved_at,
                    can_decide=(
                        current is not None
                        and s.id == current.id
                        and not context.is_admin
                        and context.role == s.required_role
                    ),
                )
                for s in steps
            ],
        )


async def role_member_ids(db: AsyncSession, project_id: int, role: str) -> list[int]:
    """Id các thành viên hoạt động, không phải admin hệ thống, giữ `role` trong dự án.

    PM còn tính qua `project.pm_id` khi người đó không có dòng thành viên với vai trò khác,
    khớp với `get_project_context`.
    """
    admin_role = (
        select(user_roles.c.user_id)
        .join(Role, Role.id == user_roles.c.role_id)
        .where(and_(Role.name == "Admin", user_roles.c.user_id == User.id))
    )
    eligible = and_(User.is_active.is_(True), User.is_superuser.is_(False), ~exists(admin_role))
    ids = set(
        (
            await db.scalars(
                select(User.id)
                .select_from(project_members)
                .join(Role, Role.id == project_members.c.role_id)
                .join(User, User.id == project_members.c.user_id)
                .where(project_members.c.project_id == project_id, Role.name == role, eligible)
            )
        ).all()
    )
    if role == "PM":
        pm_id = await db.scalar(
            select(User.id)
            .join(Project, Project.pm_id == User.id)
            .where(Project.id == project_id, eligible)
        )
        if pm_id is not None:
            member_role = await db.scalar(
                select(Role.name)
                .select_from(project_members)
                .join(Role, Role.id == project_members.c.role_id)
                .where(
                    project_members.c.project_id == project_id,
                    project_members.c.user_id == pm_id,
                )
            )
            if member_role is None or member_role == "PM":
                ids.add(pm_id)
    return sorted(ids)


async def get_approval_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApprovalService:
    return ApprovalService(db)


ApprovalServiceDep = Annotated[ApprovalService, Depends(get_approval_service)]
