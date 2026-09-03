"""
Endpoint thông báo – Phase 3.3

GET    /notifications/                → Liệt kê thông báo (phân trang, có thể lọc)
GET    /notifications/unread-count    → Số lượng hiển thị trên badge
PATCH  /notifications/{id}/read       → Đánh dấu một thông báo đã đọc
PATCH  /notifications/read-all        → Đánh dấu tất cả đã đọc
DELETE /notifications/{id}            → Xóa một thông báo
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
    unread_only: bool = Query(default=False, description="Chỉ lọc các thông báo chưa đọc"),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """
    Liệt kê thông báo cho người dùng đã xác thực.
    Sắp xếp theo mới nhất trước.
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
    Endpoint nhẹ dành cho badge trên chuông thông báo.
    Chỉ trả về số lượng chưa đọc mà không lấy toàn bộ danh sách.
    """
    return await service.unread_count(current_user.id)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: int,
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Đánh dấu một thông báo là đã đọc."""
    return await service.mark_read(notification_id, current_user.id)


@router.patch("/read-all", response_model=MarkReadResponse)
async def mark_all_notifications_read(
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Đánh dấu TẤT CẢ thông báo chưa đọc của người dùng hiện tại là đã đọc."""
    return await service.mark_all_read(current_user.id)


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    service: NotificationServiceDep,
    current_user: CurrentUser,
):
    """Xóa vĩnh viễn một thông báo."""
    await service.delete(notification_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
