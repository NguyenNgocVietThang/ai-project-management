import asyncio
from typing import Annotated

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.ws.deps import WSAuthError, authenticate_ws, enforce_token_lifetime
from app.core.ws_manager import manager
from app.db.session import get_db

notifications_ws_router = APIRouter()


@notifications_ws_router.websocket("/notifications")
async def notifications_ws(
    websocket: WebSocket,
    token: Annotated[str, Query()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    try:
        user = await authenticate_ws(token, db)
    except WSAuthError:
        await websocket.close(code=4401)
        return

    channel = f"notif:user:{user.id}"
    await manager.connect(channel, websocket)
    # Về phía client, socket này chỉ nhận, nên việc xác thực lại không thể dựa vào
    # tin nhắn đến — nó cần watchdog dựa trên timer.
    watchdog = asyncio.create_task(enforce_token_lifetime(websocket, token))
    try:
        while True:
            # Client không bao giờ cần gửi gì có ý nghĩa ở đây — dòng này giữ
            # vòng lặp sống để ta phát hiện ngắt kết nối qua exception
            # WebSocketDisconnect bên dưới.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(channel, websocket)
    finally:
        watchdog.cancel()
        manager.disconnect(channel, websocket)
