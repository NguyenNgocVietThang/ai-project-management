"""Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.

`LOGIN_LIMIT` của slowapi khoá theo IP của bên gọi. Điều đó chặn được một máy thử
nhiều mật khẩu, nhưng không chặn được kiểu tấn công thực tế hơn: một botnet thử
cùng một tài khoản từ hàng nghìn địa chỉ, mỗi địa chỉ chỉ vài lần và không bao giờ
chạm ngưỡng của riêng nó. Nhìn từ phía tài khoản, số lần thử là không giới hạn.

Ở đây khoá đi theo email, nên mọi lần thử vào một tài khoản đều cộng dồn vào cùng
một ngân sách bất kể chúng đến từ đâu. Thời gian khoá tăng dần theo số lần thất bại
để một người dùng gõ nhầm mật khẩu chỉ phải chờ vài giây, còn một cuộc tấn công
kéo dài thì nhanh chóng trở nên vô ích.

Đánh đổi về tính khả dụng giống hệt token_revocation: Redis không dùng được thì
hệ thống fail OPEN. Fail closed sẽ khoá toàn bộ người dùng khỏi ứng dụng trong một
cú gián đoạn cache — biến sự cố cache thành sự cố toàn hệ thống, trong khi rate
limit theo IP vẫn còn đó như một lớp phòng thủ thứ hai.
"""
import hashlib
import logging

from app.core.redis_client import get_redis

logger = logging.getLogger(__name__)

FAILURE_KEY_PREFIX = "auth:login_fail:"
LOCK_KEY_PREFIX = "auth:login_lock:"

# Số lần sai liên tiếp được bỏ qua trước khi bắt đầu khoá. Đặt ở mức người dùng
# thật hiếm khi chạm tới khi gõ nhầm.
FAILURE_THRESHOLD = 5
# Cửa sổ đếm các lần thất bại. Đủ dài để một cuộc tấn công rải chậm vẫn bị cộng dồn.
FAILURE_WINDOW_SECONDS = 15 * 60
# Thời gian khoá theo bậc, tính từ lần thất bại thứ FAILURE_THRESHOLD trở đi.
LOCK_STEPS_SECONDS = (60, 5 * 60, 15 * 60, 60 * 60)


def _identity_key(prefix: str, email: str) -> str:
    """Băm email: một bản dump key Redis không nên trở thành danh sách người dùng."""
    digest = hashlib.sha256(email.strip().lower().encode()).hexdigest()
    return f"{prefix}{digest}"


def _lock_seconds(failures: int) -> int:
    step = min(failures - FAILURE_THRESHOLD, len(LOCK_STEPS_SECONDS) - 1)
    return LOCK_STEPS_SECONDS[max(0, step)]


async def seconds_until_unlocked(email: str) -> int | None:
    """Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá."""
    if not email:
        return None
    try:
        ttl = await get_redis().ttl(_identity_key(LOCK_KEY_PREFIX, email))
    except Exception:
        logger.warning("login lockout lookup failed (redis unavailable?)", exc_info=True)
        return None
    return ttl if ttl and ttl > 0 else None


async def record_failure(email: str) -> None:
    """Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng."""
    if not email:
        return
    try:
        redis = get_redis()
        key = _identity_key(FAILURE_KEY_PREFIX, email)
        failures = await redis.incr(key)
        if failures == 1:
            await redis.expire(key, FAILURE_WINDOW_SECONDS)
        if failures >= FAILURE_THRESHOLD:
            await redis.set(
                _identity_key(LOCK_KEY_PREFIX, email),
                "1",
                ex=_lock_seconds(failures),
            )
    except Exception:
        logger.warning("login failure accounting failed (redis unavailable?)", exc_info=True)


async def clear(email: str) -> None:
    """Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu."""
    if not email:
        return
    try:
        await get_redis().delete(
            _identity_key(FAILURE_KEY_PREFIX, email),
            _identity_key(LOCK_KEY_PREFIX, email),
        )
    except Exception:
        logger.warning("clearing login failures failed (redis unavailable?)", exc_info=True)
