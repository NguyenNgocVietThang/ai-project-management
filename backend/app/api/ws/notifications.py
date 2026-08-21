from typing import Annotated

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.ws.deps import WSAuthError, authenticate_ws
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
    try:
        while True:
            # The client never needs to send anything meaningful here — this
            # keeps the loop alive so we notice a disconnect via the
            # WebSocketDisconnect exception below.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(channel, websocket)
