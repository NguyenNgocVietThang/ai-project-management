"""Schemas for the project-scoped team chat feature."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=4000)


class ChatMessageResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    user_name: str
    user_avatar_url: Optional[str] = None
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatHistoryResponse(BaseModel):
    items: list[ChatMessageResponse]
    next_before_id: Optional[int] = None  # pass as `before_id` to fetch the next (older) page
    has_more: bool


class ChatUnreadResponse(BaseModel):
    unread_count: int
    last_read_message_id: Optional[int] = None
