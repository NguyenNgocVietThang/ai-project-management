"""Aggregates all WebSocket routers (chat, notifications, ...) mounted at the
app root under /ws — see main.py. Kept separate from api/v1/router.py since
these are not versioned REST routes."""
from fastapi import APIRouter

from app.api.ws.chat import chat_ws_router

ws_router = APIRouter()

# Sub-routers are registered here as each feature adds its own WS endpoint
# (see app/api/ws/chat.py, app/api/ws/notifications.py).
ws_router.include_router(chat_ws_router)
