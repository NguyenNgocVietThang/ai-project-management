"""Gom tất cả các WebSocket router (chat, notifications, ...) được mount tại
gốc ứng dụng dưới /ws — xem main.py. Tách riêng khỏi api/v1/router.py vì
đây không phải các route REST có version."""
from fastapi import APIRouter

from app.api.ws.chat import chat_ws_router
from app.api.ws.notifications import notifications_ws_router

ws_router = APIRouter()

# Các sub-router được đăng ký ở đây khi mỗi tính năng bổ sung WS endpoint riêng
# (xem app/api/ws/chat.py, app/api/ws/notifications.py).
ws_router.include_router(chat_ws_router)
ws_router.include_router(notifications_ws_router)
