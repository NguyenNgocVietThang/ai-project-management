from datetime import datetime

from pydantic import BaseModel

from app.models.notification import NotificationType


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: NotificationType
    is_read: bool
    read_at: datetime | None
    link: str | None
    related_entity_type: str | None
    related_entity_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int


class UnreadCountResponse(BaseModel):
    unread_count: int


class MarkReadResponse(BaseModel):
    updated: int
    unread_count: int
