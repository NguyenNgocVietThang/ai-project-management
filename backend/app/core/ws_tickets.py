"""Vé dùng một lần cho WebSocket handshake.

Trình duyệt không đặt được header tuỳ ý trên một WebSocket handshake, nên trước đây
access token được truyền thẳng trên query string. Ba vấn đề đi kèm:

  * uvicorn, nginx và mọi load balancer ở giữa đều ghi nguyên request line vào
    access log, thường được ship sang một hệ thống log tập trung. JWT còn hiệu lực
    30 phút nằm đó ở dạng plaintext.
  * URL socket được tính đúng một lần lúc mount. Khi access token được làm mới,
    socket vẫn kết nối lại bằng URL cũ — nên sau khi token hết hạn, mọi lần thử
    đều bị từ chối và client quay vòng mãi mãi.
  * Với refresh token đã chuyển sang cookie httpOnly, access token cũng không còn
    nằm sẵn ở nơi mà mã dựng URL có thể lấy một cách bền vững.

Vé giải quyết cả ba: client xin một vé qua REST (đường đã xác thực bằng header
Authorization) ngay trước mỗi lần kết nối, rồi tiêu nó ở handshake. Vé sống 60 giây
và chỉ dùng được một lần, nên một vé bị lấy từ log là vô giá trị.

Chỉ SHA-256 của vé được dùng làm key, nên một bản dump key Redis không trao ra
những vé còn dùng được.
"""
import hashlib
import json
import secrets
from typing import Any

from app.core.redis_client import get_redis

TICKET_KEY_PREFIX = "auth:ws_ticket:"
# Đủ cho một lần điều hướng và bắt tay, đủ ngắn để vé lọt vào log gần như chắc
# chắn đã chết trước khi ai đó đọc được log.
TICKET_TTL_SECONDS = 60


def _key(ticket: str) -> str:
    return f"{TICKET_KEY_PREFIX}{hashlib.sha256(ticket.encode()).hexdigest()}"


async def issue(user_id: int, auth_version: int) -> str:
    """Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store."""
    ticket = secrets.token_urlsafe(32)
    await get_redis().set(
        _key(ticket),
        json.dumps({"user_id": user_id, "auth_version": auth_version}),
        ex=TICKET_TTL_SECONDS,
    )
    return ticket


async def redeem(ticket: str) -> dict[str, Any] | None:
    """Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được.

    Đọc-và-xoá là atomic, nên hai lần bắt tay đồng thời với cùng một vé không thể
    cùng thành công. Fail CLOSED: nếu store không phản hồi thì không có kết nối nào
    được chấp nhận, vì không có cách nào khác để chứng minh danh tính bên gọi.
    """
    if not ticket:
        return None
    raw = await get_redis().getdel(_key(ticket))
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return None
