"""
Notification endpoints – Phase 3.3

GET    /notifications/                → List notifications (paginated, filterable)
GET    /notifications/unread-count    → Badge count
PATCH  /notifications/{id}/read       → Mark single as read
PATCH  /notifications/read-all        → Mark all as read
DELETE /notifications/{id}            → Delete a notification
"""
from typing import Annotated

from fastapi import APIRouter, Query, Response, status

from app.core.dependencies import CurrentUser
from app.schemas.notification import (
    MarkReadResponse,
    NotificationListResponse,
    NotificationResponse,
    UnreadCountResponse,
)
from app.services.notification_service import NotificationServiceDep

router = APIRouter()


@router.get("/", response_model=NotificationListResponse)
async def list_notifications(
    service: NotificationServiceDep,
    current_user: CurrentUser,
    unread_only: bool = Query(default=False, description="Filter to unread only"),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """
    List notifications for the authenticated user.
    Sorted by newest first.
    """
    return await service.list(
        current_user.id,
        unread_only=unread_only,
        page=page,
        page_size=page_size,
    )


@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """
    Lightweight endpoint for the notification bell badge.
    Returns only the unread count without fetching full list.
    """
    return await service.unread_count(current_user.id)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: int,
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Mark a single notification as read."""
    return await service.mark_read(notification_id, current_user.id)


@router.patch("/read-all", response_model=MarkReadResponse)
async def mark_all_notifications_read(
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Mark ALL unread notifications for the current user as read."""
    return await service.mark_all_read(current_user.id)


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Permanently delete a notification."""
    await service.delete(notification_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
