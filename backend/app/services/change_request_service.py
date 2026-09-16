"""CRUD tối giản cho Change Request — nền cho AI Impact Analysis (SOP-AI-002).

Chỉ cài đặt phần tạo/xem/chuyển trạng thái DRAFT->SUBMITTED. Quy trình duyệt nhiều bước
(bảng `approvals`, BA -> PO -> PM) không thuộc phạm vi này — xem tasks/plan.md.
"""
from typing import Annotated

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.change_request import ChangeRequest, CRStatus
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
        old_status = item.status
        item.status = CRStatus.SUBMITTED
        await self.db.flush()
        add_audit(
            self.db, user.id, "UPDATE", "ChangeRequest", item.id,
            old_values={"status": old_status}, new_values={"status": item.status},
        )
        return ChangeRequestResponse.model_validate(item)

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
