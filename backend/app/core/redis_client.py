"""Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ bởi
cầu nối pub/sub của ws_manager.py. Dùng REDIS_URL đa dụng (db 0), khác với
các URL broker/result-backend của Celery (db 1/2) được cấu hình trong celery_app.py.
"""
from redis.asyncio import Redis

from app.core.config import settings

# Moi nguoi goi Redis o day deu soft-fail (thu hoi token, khoa dang nhap, ve
# WebSocket, publish pub/sub). Nhung soft-fail chi co y nghia neu loi den NHANH:
# khong co timeout, mot Redis khong phan hoi se khien moi lan dang nhap treo cho
# den khi TCP tu bo - bien mot su co cache thanh su co toan he thong.
CONNECT_TIMEOUT_SECONDS = 2
OPERATION_TIMEOUT_SECONDS = 2

_redis: Redis | None = None


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


async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None
