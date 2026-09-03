from typing import Annotated, Optional

from fastapi import APIRouter, Body, Query, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.schemas.chat import (
    ChatHistoryResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatUnreadResponse,
)
from app.services.chat_service import ChatServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/messages", response_model=ChatHistoryResponse)
async def get_chat_history(
    project_id: int,
    service: ChatServiceDep,
    current_user: CurrentUser,
    before_id: Optional[int] = Query(default=None),
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
):
    return await service.history(project_id, current_user, before_id=before_id, limit=limit)


@router.post(
    "/projects/{project_id}/messages",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def post_chat_message(
    project_id: int,
    body: ChatMessageCreate,
    service: ChatServiceDep,
    current_user: CurrentVerifiedUser,
):
    # Phương án REST dự phòng cho client không có WebSocket đang mở — endpoint WS
    # (app/api/ws/chat.py) gọi cùng ChatService.create_message().
    return await service.create_message(project_id, current_user, body)


@router.get("/projects/{project_id}/unread-count", response_model=ChatUnreadResponse)
async def get_chat_unread_count(
    project_id: int,
    service: ChatServiceDep,
    current_user: CurrentUser,
):
    return await service.unread_count(project_id, current_user)


@router.post("/projects/{project_id}/read", response_model=ChatUnreadResponse)
async def mark_chat_read(
    project_id: int,
    service: ChatServiceDep,
    current_user: CurrentUser,
    message_id: Optional[int] = Body(default=None, embed=True),
):
    return await service.mark_read(project_id, current_user, message_id)
