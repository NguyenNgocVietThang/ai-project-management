import asyncio
import time
from collections import deque
from typing import Annotated

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.ws.deps import WSAuthError, authenticate_ws, enforce_token_lifetime
from app.core.exceptions import ForbiddenException, NotFoundException
from app.core.ws_manager import manager
from app.db.session import get_db
from app.schemas.chat import ChatMessageCreate
from app.services.chat_service import ChatService

chat_ws_router = APIRouter()

# Kiểm soát flood theo từng socket. Các REST endpoint đã được slowapi lo, nhưng một
# WebSocket là một request rồi mang theo vô số tin nhắn, nên nó cần budget riêng.
MAX_MESSAGES_PER_WINDOW = 10
RATE_WINDOW_SECONDS = 10
# ChatMessageCreate giới hạn content ở 4000 ký tự; từ chối bất cứ thứ gì vượt quá xa
# mức đó trước khi tốn công parse JSON + validation Pydantic cho nó.
MAX_FRAME_CHARS = 8000


class _MessageBudget:
    """Bộ đếm cửa sổ trượt cho một socket."""

    def __init__(self) -> None:
        self._sent: deque[float] = deque()

    def allow(self) -> bool:
        now = time.monotonic()
        while self._sent and now - self._sent[0] > RATE_WINDOW_SECONDS:
            self._sent.popleft()
        if len(self._sent) >= MAX_MESSAGES_PER_WINDOW:
            return False
        self._sent.append(now)
        return True


@chat_ws_router.websocket("/chat/{project_id}")
async def chat_ws(
    websocket: WebSocket,
    project_id: int,
    token: Annotated[str, Query()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    try:
        user = await authenticate_ws(token, db)
        if not user.email_verified:
            # Phản chiếu CurrentVerifiedUser trên route REST POST — nếu không thì
            # socket trở thành cách để lách nó.
            raise WSAuthError("Email address is not verified")
        chat_service = ChatService(db)
        # Kiểm tra thành viên ngay từ đầu để không accept() trước khi phân quyền.
        await chat_service.history(project_id, user, limit=1)
    except (WSAuthError, ForbiddenException, NotFoundException):
        await websocket.close(code=4401)
        return

    channel = f"chat:project:{project_id}"
    await manager.connect(channel, websocket)
    # Các socket sống lâu phải liên tục chứng minh token còn hợp lệ; xem
    # app/api/ws/deps.py::enforce_token_lifetime.
    watchdog = asyncio.create_task(enforce_token_lifetime(websocket, token))
    budget = _MessageBudget()
    try:
        while True:
            raw = await websocket.receive_json()
            if raw.get("type") != "message":
                continue
            content = (raw.get("content") or "")
            if len(content) > MAX_FRAME_CHARS:
                await websocket.close(code=1009)  # tin nhắn quá lớn
                return
            content = content.strip()
            if not content:
                continue
            if not budget.allow():
                await websocket.send_json(
                    {"type": "error", "detail": "You are sending messages too quickly."}
                )
                continue
            await chat_service.create_message(
                project_id, user, ChatMessageCreate(content=content)
            )
            await db.commit()
    except WebSocketDisconnect:
        manager.disconnect(channel, websocket)
    except Exception:
        # Bất kỳ lỗi bất ngờ nào (payload sai, DB trục trặc, v.v.) — hủy kết nối
        # này thay vì để nó ở trạng thái nửa hỏng.
        manager.disconnect(channel, websocket)
        raise
    finally:
        watchdog.cancel()
