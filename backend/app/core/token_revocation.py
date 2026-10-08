"""Danh sách thu hồi token, dùng Redis hoặc Postgres theo chế độ triển khai.

Database mode lưu tombstone bền vững và fail closed khi DB lỗi. Nhánh Redis
bên dưới giữ hành vi development cũ; phần đánh đổi fail-open chỉ áp dụng nhánh đó.

JWT là tự chứa: một khi đã phát hành, không gì ngăn được nó bị replay cho tới
khi hết hạn. `User.auth_version` xử lý trường hợp cực đoan (đổi mật khẩu thu hồi
mọi phiên cùng lúc), nhưng nó không thể thu hồi *một* token đơn lẻ, đó là điều mà
logout và xoay vòng refresh cần. Module này lấp khoảng trống đó bằng cách nhớ
`jti` của các token không được chấp nhận nữa, mỗi entry tự hết hạn
khi token mà nó chỉ tới dù sao cũng đã hết hạn — nên tập này luôn có giới hạn.

Đánh đổi về tính khả dụng: nếu không kết nối được Redis, `is_revoked()` báo False và
`revoke()` báo thất bại, tức là hệ thống fail OPEN. Fail closed sẽ đăng xuất
mọi người dùng khỏi ứng dụng trong một cú gián đoạn cache, một kết cục tệ hơn
so với một refresh token đã bị thu hồi tồn tại tới khi tự hết hạn. `auth_version`
vẫn có sẵn như một kill switch ngoài luồng không phụ thuộc Redis.
"""
import logging
import math
import time

from app.core.redis_client import get_redis
from app.services import security_state_service as durable_state

logger = logging.getLogger(__name__)

REVOKED_KEY_PREFIX = "auth:revoked_jti:"


def _key(jti: str) -> str:
    return f"{REVOKED_KEY_PREFIX}{jti}"


def _ttl_seconds(expires_at: int | None) -> int:
    """Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.

    Quay lại dùng một ngày khi `exp` thiếu hoặc đã qua, để một token sai định dạng
    vẫn để lại một bản ghi tồn tại ngắn thay vì bị lưu mãi mãi.
    """
    if not expires_at:
        return 86_400
    # Round up so the tombstone cannot expire a fractional second before JWT exp.
    remaining = math.ceil(expires_at - time.time())
    return remaining if remaining > 0 else 86_400


async def revoke(jti: str, expires_at: int | None = None) -> bool:
    """Revoke idempotently; database failures raise 503, legacy Redis failures return False."""
    if not jti:
        return False
    if durable_state.database_enabled():
        await durable_state.put("revocation", _key(jti), {}, _ttl_seconds(expires_at))
        return True
    try:
        await get_redis().set(_key(jti), "1", ex=_ttl_seconds(expires_at))
        return True
    except Exception:
        logger.warning("token revocation failed for jti=%s (redis unavailable?)", jti, exc_info=True)
        return False


async def is_revoked(jti: str | None) -> bool:
    """Lookup revocation; database failures reject, legacy Redis failures return False."""
    if not jti:
        return durable_state.database_enabled()
    if durable_state.database_enabled():
        return await durable_state.contains("revocation", _key(jti))
    try:
        return await get_redis().exists(_key(jti)) == 1
    except Exception:
        logger.warning(
            "token revocation lookup failed for jti=%s (redis unavailable?) — "
            "treating the token as valid",
            jti,
            exc_info=True,
        )
        return False


async def claim_revocation(jti: str | None, expires_at: int | None = None) -> bool:
    """Atomically rotate a refresh token once; False means missing/already used.

    Database failures raise 503, so the caller must never issue new credentials
    after an unsuccessful claim. Legacy revoke remains idempotent for logout.
    """
    if not jti:
        return False
    if durable_state.database_enabled():
        return await durable_state.claim("revocation", _key(jti), _ttl_seconds(expires_at))
    try:
        return bool(await get_redis().set(_key(jti), "1", ex=_ttl_seconds(expires_at), nx=True))
    except Exception:
        logger.warning("Token rotation claim unavailable")
        return False
