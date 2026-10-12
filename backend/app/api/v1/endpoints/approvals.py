"""Quyết định từng bước duyệt CR (A2), lồng dưới /change-requests/{cr_id}/approvals."""
from fastapi import APIRouter

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.schemas.approval import (
    ApprovalApproveRequest,
    ApprovalChainResponse,
    ApprovalRejectRequest,
)
from app.services.approval_service import ApprovalServiceDep

router = APIRouter()


@router.get("/change-requests/{change_request_id}/approvals", response_model=ApprovalChainResponse)
async def list_approvals(
    change_request_id: int, service: ApprovalServiceDep, current_user: CurrentUser
):
    return await service.list_chain(change_request_id, current_user)


@router.post(
    "/change-requests/{change_request_id}/approvals/{step_order}/approve",
    response_model=ApprovalChainResponse,
)
async def approve_step(
    change_request_id: int,
    step_order: int,
    service: ApprovalServiceDep,
    current_user: CurrentVerifiedUser,
    body: ApprovalApproveRequest | None = None,
):
    comment = body.comment if body else None
    return await service.approve(change_request_id, step_order, current_user, comment)


@router.post(
    "/change-requests/{change_request_id}/approvals/{step_order}/reject",
    response_model=ApprovalChainResponse,
)
async def reject_step(
    change_request_id: int,
    step_order: int,
    body: ApprovalRejectRequest,
    service: ApprovalServiceDep,
    current_user: CurrentVerifiedUser,
):
    return await service.reject(change_request_id, step_order, current_user, body.reason)
