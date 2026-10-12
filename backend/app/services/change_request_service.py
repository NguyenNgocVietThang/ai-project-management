"""CRUD tối giản cho Change Request — nền cho AI Impact Analysis (SOP-AI-002).

Cài đặt tạo/xem và submit DRAFT->SUBMITTED. Khi submit, tạo chuỗi duyệt 3 bước PENDING
(bảng `approvals`, BA -> PO -> PM) trong cùng transaction; việc quyết định từng bước thuộc A2.
"""
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
from app.models.change_request import ChangeRequest, CRStatus
from app.models.project import Project
from app.models.role import Role
from app.models.user import User
from app.schemas.change_request import ChangeRequestCreate, ChangeRequestResponse
from app.services.phase2_common import add_audit, get_project_context, serialize_model


class ChangeRequestService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self, project_id: int, data: ChangeRequestCreate, user: User
    ) -> ChangeRequestResponse:
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can create change requests")
        item = ChangeRequest(
            project_id=project_id,
            requested_by_id=user.id,
            status=CRStatus.DRAFT,
            **data.model_dump(),
        )
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
