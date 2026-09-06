"""Xác thực và giám sát vòng đời cho các WebSocket endpoint.

Handshake trình ra một vé dùng một lần chứ không phải JWT trên query string —
xem app/core/ws_tickets.py để biết vì sao.

Hai điều một socket sống lâu phải liên tục chứng minh lại, vì cả hai đều có thể
thay đổi sau khi kết nối đã mở và một socket có thể mở nhiều ngày:
  * token/tài khoản còn hợp lệ (đổi mật khẩu, vô hiệu hoá tài khoản)
  * người dùng vẫn còn là thành viên của dự án mà kênh này thuộc về
"""
import asyncio
import logging
from collections.abc import Awaitable, Callable

from app.core.ws_tickets import redeem as redeem_ticket
from app.db.session import AsyncSessionLocal
from app.models.user import User

logger = logging.getLogger(__name__)

# Tần suất một socket đang mở kiểm tra lại xem nó còn được phép mở hay không.
REAUTH_INTERVAL_SECONDS = 60


class WSAuthError(Exception):
    """Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ.
    Bên gọi nên bắt lỗi này và đóng socket với code 4401."""


async def authenticate_ws(ticket: str) -> User:
    """Phân giải một vé handshake thành một User đang active.

    Dùng session DB riêng, tồn tại đúng bằng thời gian truy vấn. Trước đây endpoint
    WS nhận session qua `Depends(get_db)`, khiến mỗi socket đang mở giữ một
    connection trong pool suốt vòng đời của nó — với pool_size 10 + overflow 20 thì
    khoảng 30 socket đồng thời là làm cạn pool và mọi request HTTP đứng chờ.
    """
    payload = await _redeem(ticket)
    if payload is None:
        raise WSAuthError("Invalid or expired connection ticket")

    user_id = payload.get("user_id")
    if not isinstance(user_id, int):
        raise WSAuthError("Invalid connection ticket")

    from app.repositories.user_repository import UserRepository  # tránh circular import

    async with AsyncSessionLocal() as db:
        user = await UserRepository(db).get_by_id(user_id)
        if user is None:
            raise WSAuthError("User not found")
        if payload.get("auth_version") != (user.auth_version or 0):
            raise WSAuthError("Ticket has been invalidated")
        if not user.is_active:
            raise WSAuthError("Inactive user")
        # Tách khỏi session trước khi nó đóng: nơi gọi chỉ đọc các thuộc tính vô
        # hướng, và giữ nó gắn với session đã đóng sẽ gây lỗi lazy-load.
        db.expunge(user)
        return user


async def _redeem(ticket: str) -> dict | None:
    try:
        return await redeem_ticket(ticket)
    except Exception:
        # Fail closed: không có store thì không có cách nào chứng minh bên gọi là ai.
        logger.warning("ws ticket redemption failed (redis unavailable?)", exc_info=True)
        return None


async def enforce_connection_validity(
    websocket,
    user_id: int,
    auth_version: int,
    *,
    still_allowed: Callable[[], Awaitable[bool]] | None = None,
    interval: int = REAUTH_INTERVAL_SECONDS,
) -> None:
    """Watchdog: đóng `websocket` khi nó không còn được phép mở.

    Chạy song song với vòng lặp receive của endpoint, vì notification socket không
    bao giờ nhận gì từ client — một kiểm tra dựa trên tin nhắn đến sẽ không bao giờ
    được kích hoạt ở đó.

    `still_allowed` là kiểm tra bổ sung theo từng kênh (ví dụ: người dùng còn là
    thành viên dự án không). Nếu không có nó, một người bị xoá khỏi dự án vẫn tiếp
    tục nhận mọi tin nhắn của kênh cho tới khi họ tự đóng tab.

    Đóng socket làm cho lời gọi receive() đang chờ của endpoint ném lỗi, từ đó đi
    vào luồng ngắt kết nối bình thường.
    """
    from app.repositories.user_repository import UserRepository

    while True:
        await asyncio.sleep(interval)
        try:
            async with AsyncSessionLocal() as db:
                user = await UserRepository(db).get_by_id(user_id)
                if user is None or not user.is_active:
                    await _close_unauthorized(websocket, "account is no longer active")
                    return
                if (user.auth_version or 0) != auth_version:
                    await _close_unauthorized(websocket, "session was invalidated")
                    return
            if still_allowed is not None and not await still_allowed():
                await _close_unauthorized(websocket, "access to this channel was revoked")
                return
        except Exception:
            # Một sự cố DB tạm thời không được đăng xuất người dùng; thử lại ở tick kế tiếp.
            logger.warning("ws re-authorisation check failed, will retry", exc_info=True)


async def _close_unauthorized(websocket, reason: str) -> None:
    logger.info("closing websocket: %s", reason)
    try:
        await websocket.close(code=4401)
    except Exception:
        pass  # đã bị phía bên kia đóng
