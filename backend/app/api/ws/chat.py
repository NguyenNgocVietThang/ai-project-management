from typing import Annotated

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.ws.deps import WSAuthError, authenticate_ws
from app.core.exceptions import ForbiddenException, NotFoundException
from app.core.ws_manager import manager
from app.db.session import get_db
from app.schemas.chat import ChatMessageCreate
from app.services.chat_service import ChatService

chat_ws_router = APIRouter()


@chat_ws_router.websocket("/chat/{project_id}")
async def chat_ws(
    websocket: WebSocket,
    project_id: int,
    token: Annotated[str, Query()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    try:
        user = await authenticate_ws(token, db)
        chat_service = ChatService(db)
        # Membership check up front so we don't accept() before authorizing.
        await chat_service.history(project_id, user, limit=1)
    except (WSAuthError, ForbiddenException, NotFoundException):
        await websocket.close(code=4401)
        return

    channel = f"chat:project:{project_id}"
    await manager.connect(channel, websocket)
    try:
        while True:
            raw = await websocket.receive_json()
            if raw.get("type") == "message":
                content = (raw.get("content") or "").strip()
                if content:
                    await chat_service.create_message(
                        project_id, user, ChatMessageCreate(content=content)
                    )
                    await db.commit()
    except WebSocketDisconnect:
        manager.disconnect(channel, websocket)
    except Exception:
        # Any unexpected error (bad payload, DB hiccup, etc.) — drop this
        # connection rather than leaving it in a half-broken state.
        manager.disconnect(channel, websocket)
        raise
