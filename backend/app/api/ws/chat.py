import asyncio
import time
from collections import deque
from typing import Annotated

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.api.ws.deps import WSAuthError, authenticate_ws, enforce_connection_validity
from app.core.exceptions import ForbiddenException, NotFoundException
from app.core.ws_manager import manager
from app.db.session import AsyncSessionLocal
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


async def _is_still_a_member(project_id: int, user) -> bool:
    """Người dùng còn quyền truy cập dự án này không.

    Được watchdog gọi định kỳ. Nếu không có nó, một người bị xoá khỏi dự án vẫn
    tiếp tục nhận mọi tin nhắn của kênh cho tới khi họ tự đóng tab — có thể là
    nhiều ngày. Chiều gửi vốn đã an toàn vì create_message kiểm tra lại mỗi lần.
    """
    from app.services.phase2_common import get_project_context

    try:
        async with AsyncSessionLocal() as db:
            await get_project_context(db, project_id, user)
        return True
    except (ForbiddenException, NotFoundException):
        return False


@chat_ws_router.websocket("/chat/{project_id}")
async def chat_ws(
    websocket: WebSocket,
    project_id: int,
    ticket: Annotated[str, Query()],
):
    try:
        user = await authenticate_ws(ticket)
        if not user.email_verified:
            # Phản chiếu CurrentVerifiedUser trên route REST POST — nếu không thì
            # socket trở thành cách để lách nó.
            raise WSAuthError("Email address is not verified")
        # Kiểm tra thành viên ngay từ đầu để không accept() trước khi phân quyền.
        if not await _is_still_a_member(project_id, user):
            raise WSAuthError("No access to this project")
    except WSAuthError:
        await websocket.close(code=4401)
        return

    channel = f"chat:project:{project_id}"
    await manager.connect(channel, websocket)
    watchdog = asyncio.create_task(
        enforce_connection_validity(
            websocket,
            user.id,
            user.auth_version or 0,
            still_allowed=lambda: _is_still_a_member(project_id, user),
        )
    )
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
            # Session ngắn hạn cho từng tin nhắn: giữ một session mở suốt vòng đời
            # socket sẽ chiếm một connection trong pool cho tới khi người dùng
            # đóng tab.
            async with AsyncSessionLocal() as db:
                await ChatService(db).create_message(
                    project_id, user, ChatMessageCreate(content=content)
                )
                await db.commit()
    except WebSocketDisconnect:
        pass
    except Exception:
        # Bất kỳ lỗi bất ngờ nào (payload sai, DB trục trặc, v.v.) — hủy kết nối
        # này thay vì để nó ở trạng thái nửa hỏng.
        raise
    finally:
        # Phải nằm ở finally, không phải chỉ trong nhánh WebSocketDisconnect: nhánh
        # thoát sớm khi frame quá lớn từng bỏ lại socket đã đóng nằm trong registry.
        watchdog.cancel()
        manager.disconnect(channel, websocket)
