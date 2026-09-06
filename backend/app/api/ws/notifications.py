import asyncio
from typing import Annotated

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.api.ws.deps import WSAuthError, authenticate_ws, enforce_connection_validity
from app.core.ws_manager import manager

notifications_ws_router = APIRouter()


@notifications_ws_router.websocket("/notifications")
async def notifications_ws(
    websocket: WebSocket,
    ticket: Annotated[str, Query()],
):
    try:
        user = await authenticate_ws(ticket)
    except WSAuthError:
        await websocket.close(code=4401)
        return

    channel = f"notif:user:{user.id}"
    await manager.connect(channel, websocket)
    # Về phía client, socket này chỉ nhận, nên việc xác thực lại không thể dựa vào
    # tin nhắn đến — nó cần watchdog dựa trên timer.
    watchdog = asyncio.create_task(
        enforce_connection_validity(websocket, user.id, user.auth_version or 0)
    )
    try:
        while True:
            # Client không bao giờ cần gửi gì có ý nghĩa ở đây — dòng này giữ
            # vòng lặp sống để ta phát hiện ngắt kết nối qua exception
            # WebSocketDisconnect bên dưới.
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        watchdog.cancel()
        manager.disconnect(channel, websocket)
