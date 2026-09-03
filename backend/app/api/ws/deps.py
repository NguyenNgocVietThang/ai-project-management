"""Xác thực cho các WebSocket endpoint.

Trình duyệt không thể đặt header tùy chỉnh trên một WebSocket handshake, nên
JWT access token được truyền dưới dạng query parameter (`?token=...`) thay vì
header `Authorization` mà REST dùng. Điều này chấp nhận được ở đây vì frontend
vốn đã giữ access token ở dạng client-readable (Zustand store + một cookie
`auth-token` không phải httpOnly) — nó không làm tăng mức phơi bày.
"""
import asyncio
import logging
import time

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import AsyncSessionLocal
from app.models.user import User

logger = logging.getLogger(__name__)

# Tần suất một socket đang mở kiểm tra lại xem token của nó còn hợp lệ không. Một
# WebSocket có thể mở nhiều ngày, nên nếu không có bước này thì một session sẽ sống
# sót qua việc đổi mật khẩu, vô hiệu hóa và hết hạn token miễn là client còn giữ socket mở.
REAUTH_INTERVAL_SECONDS = 60


class WSAuthError(Exception):
    """Ném ra khi token/user của một kết nối WebSocket không qua được kiểm tra hợp lệ.
    Bên gọi nên bắt lỗi này và đóng socket với code 4401."""


async def authenticate_ws(token: str, db: AsyncSession) -> User:
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise WSAuthError("Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise WSAuthError("Invalid token payload")
    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise WSAuthError("Invalid token payload")

    from app.repositories.user_repository import UserRepository  # tránh circular import

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id_int)
    if user is None:
        raise WSAuthError("User not found")
    if payload.get("ver", 0) != (user.auth_version or 0):
        raise WSAuthError("Token has been invalidated")
    if not user.is_active:
        raise WSAuthError("Inactive user")
    return user


async def enforce_token_lifetime(
    websocket,
    token: str,
    *,
    interval: int = REAUTH_INTERVAL_SECONDS,
) -> None:
    """Watchdog task: đóng `websocket` khi token của nó không còn hợp lệ.

    Chạy song song với vòng lặp receive của endpoint, vì notification socket
    không bao giờ nhận gì từ client — một kiểm tra dựa trên tin nhắn đến sẽ
    không bao giờ được kích hoạt ở đó. Dùng DB session riêng: một AsyncSession
    không an toàn khi chia sẻ giữa các task chạy đồng thời.

    Đóng socket làm cho lời gọi receive() đang chờ của endpoint ném lỗi, từ đó
    đi vào luồng ngắt kết nối bình thường.
    """
    payload = decode_token(token)
    expires_at = payload.get("exp") if payload else None

    while True:
        await asyncio.sleep(interval)
        if expires_at and time.time() >= expires_at:
            await _close_unauthorized(websocket, "token expired")
            return
        try:
            async with AsyncSessionLocal() as db:
                await authenticate_ws(token, db)
        except WSAuthError as exc:
            await _close_unauthorized(websocket, str(exc))
            return
        except Exception:
            # Một sự cố DB tạm thời không được đăng xuất người dùng; thử lại ở tick kế tiếp.
            logger.warning("ws re-authentication check failed, will retry", exc_info=True)


async def _close_unauthorized(websocket, reason: str) -> None:
    logger.info("closing websocket: %s", reason)
    try:
        await websocket.close(code=4401)
    except Exception:
        pass  # đã bị phía bên kia đóng
