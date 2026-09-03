from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.ws_manager import publish
from app.db.session import get_db
from app.models.chat_message import ChatMessage
from app.models.chat_read_state import ChatReadState
from app.models.user import User
from app.schemas.chat import (
    ChatHistoryResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatUnreadResponse,
)
from app.services.phase2_common import get_project_context


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def _to_response(message: ChatMessage) -> ChatMessageResponse:
        return ChatMessageResponse(
            id=message.id,
            project_id=message.project_id,
            user_id=message.user_id,
            user_name=message.user.full_name,
            user_avatar_url=message.user.avatar_url,
            content=message.content,
            created_at=message.created_at,
        )

    async def history(
        self,
        project_id: int,
        user: User,
        *,
        before_id: Optional[int] = None,
        limit: int = 50,
    ) -> ChatHistoryResponse:
        # Bắt buộc phải là thành viên dự án (hoặc admin) — nếu không sẽ raise Forbidden/NotFound.
        await get_project_context(self.db, project_id, user)

        stmt = (
            select(ChatMessage)
            .options(selectinload(ChatMessage.user))
            .where(ChatMessage.project_id == project_id)
        )
        if before_id is not None:
            stmt = stmt.where(ChatMessage.id < before_id)
        stmt = stmt.order_by(ChatMessage.id.desc()).limit(limit + 1)

        rows = (await self.db.scalars(stmt)).all()
        has_more = len(rows) > limit
        page = rows[:limit]
        # Thứ tự từ DB là mới nhất trước (phục vụ cursor `before_id`); đảo lại
        # theo thứ tự thời gian để render từ trên xuống dưới cho đơn giản.
        items = [self._to_response(message) for message in reversed(page)]
        next_before_id = page[-1].id if has_more and page else None
        return ChatHistoryResponse(items=items, next_before_id=next_before_id, has_more=has_more)

    async def create_message(
        self, project_id: int, user: User, data: ChatMessageCreate
    ) -> ChatMessageResponse:
        await get_project_context(self.db, project_id, user)

        message = ChatMessage(project_id=project_id, user_id=user.id, content=data.content.strip())
        self.db.add(message)
        await self.db.flush()
        message.user = user  # tránh một vòng truy vấn; ta đã có sẵn actor được nạp

        response = self._to_response(message)
        await publish(f"chat:project:{project_id}", response.model_dump(mode="json"))
        return response

    async def unread_count(self, project_id: int, user: User) -> ChatUnreadResponse:
        await get_project_context(self.db, project_id, user)

        state = await self.db.scalar(
            select(ChatReadState).where(
                ChatReadState.project_id == project_id, ChatReadState.user_id == user.id
            )
        )
        last_read_id = state.last_read_message_id if state else None
        filters = [ChatMessage.project_id == project_id]
        if last_read_id is not None:
            filters.append(ChatMessage.id > last_read_id)
        count = int(
            await self.db.scalar(select(func.count()).select_from(ChatMessage).where(*filters)) or 0
        )
        return ChatUnreadResponse(unread_count=count, last_read_message_id=last_read_id)

    async def mark_read(
        self, project_id: int, user: User, message_id: Optional[int] = None
    ) -> ChatUnreadResponse:
        await get_project_context(self.db, project_id, user)

        if message_id is None:
            message_id = await self.db.scalar(
                select(func.max(ChatMessage.id)).where(ChatMessage.project_id == project_id)
            )

        state = await self.db.scalar(
            select(ChatReadState).where(
                ChatReadState.project_id == project_id, ChatReadState.user_id == user.id
            )
        )
        now = datetime.now(timezone.utc)
        if state is None:
            state = ChatReadState(
                project_id=project_id,
                user_id=user.id,
                last_read_message_id=message_id,
                last_read_at=now,
            )
            self.db.add(state)
        else:
            if message_id is not None and (
                state.last_read_message_id is None or message_id > state.last_read_message_id
            ):
                state.last_read_message_id = message_id
            state.last_read_at = now
        await self.db.flush()
        return ChatUnreadResponse(unread_count=0, last_read_message_id=state.last_read_message_id)


async def get_chat_service(db: Annotated[AsyncSession, Depends(get_db)]) -> ChatService:
    return ChatService(db)


ChatServiceDep = Annotated[ChatService, Depends(get_chat_service)]
