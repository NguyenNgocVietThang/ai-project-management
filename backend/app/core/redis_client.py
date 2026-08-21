"""Lazy, process-wide async Redis client — shared by ws_manager.py's pub/sub
bridge. Uses the general-purpose REDIS_URL (db 0), distinct from the Celery
broker/result-backend URLs (db 1/2) configured in celery_app.py.
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
