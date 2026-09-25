"""Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ bởi
cầu nối pub/sub của ws_manager.py. Dùng REDIS_URL đa dụng (db 0), khác với
các URL broker/result-backend của Celery (db 1/2) được cấu hình trong celery_app.py.
"""
from redis.asyncio import Redis

from app.core.config import settings

# Mọi nơi gọi Redis đều soft-fail (thu hồi token, khoá đăng nhập, vé WebSocket, pub/sub) nên
# cần timeout ngắn; nếu không một Redis treo sẽ làm treo mọi lần đăng nhập.
CONNECT_TIMEOUT_SECONDS = 2
OPERATION_TIMEOUT_SECONDS = 2

_redis: Redis | None = None
_redis_pubsub: Redis | None = None


def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=CONNECT_TIMEOUT_SECONDS,
            socket_timeout=OPERATION_TIMEOUT_SECONDS,
        )
    return _redis


def get_redis_pubsub() -> Redis:
    """Client riêng cho `pubsub.listen()` trong ws_manager.py.

    Không được dùng chung client với get_redis(): socket của listen() cố ý
    block vô thời hạn chờ message mới, nên OPERATION_TIMEOUT_SECONDS (2s) ở
    trên sẽ trip TimeoutError giả mỗi khi kênh im lặng quá 2 giây, dù kết nối
    vẫn khoẻ mạnh — gây reconnect loop liên tục.
    """
    global _redis_pubsub
    if _redis_pubsub is None:
        _redis_pubsub = Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=CONNECT_TIMEOUT_SECONDS,
        )
    return _redis_pubsub


async def close_redis() -> None:
    global _redis, _redis_pubsub
    if _redis is not None:
        await _redis.aclose()
        _redis = None
    if _redis_pubsub is not None:
        await _redis_pubsub.aclose()
        _redis_pubsub = None
