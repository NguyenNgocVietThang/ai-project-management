"""Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ bởi
cầu nối pub/sub của ws_manager.py. Dùng REDIS_URL đa dụng (db 0), khác với
các URL broker/result-backend của Celery (db 1/2) được cấu hình trong celery_app.py.
"""
from redis.asyncio import Redis

from app.core.config import settings

_redis: Redis | None = None


def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None
