"""Shared WebSocket connection registry + Redis pub/sub bridge, used by both
the chat feature (app/api/ws/chat.py) and real-time notification push
(app/api/ws/notifications.py).

Delivery model: `publish()` only publishes to Redis — it deliberately does
NOT also broadcast to this process's local connections directly, because
`redis_listener()` (subscribed to the same channel) already re-broadcasts
every message it receives, including ones this same process published. Doing
both would double-deliver to any locally-connected client. This means Redis
is on the critical path for every chat message and notification; if Redis is
briefly unavailable, WS delivery fails silently (chat still persists via the
DB + REST history endpoint, notifications still land via DB + poll fallback)
rather than raising — a soft-fail by design.
"""
import asyncio
import json
import logging
from typing import Any

from fastapi import WebSocket

from app.core.redis_client import get_redis

logger = logging.getLogger(__name__)

REDIS_CHANNEL_PREFIX = "ws:"


class ConnectionManager:
    """Per-process registry of live WebSocket connections, grouped by an
    arbitrary channel name (e.g. "chat:project:7" or "notif:user:42")."""

    def __init__(self) -> None:
        self._channels: dict[str, set[WebSocket]] = {}

    async def connect(self, channel: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._channels.setdefault(channel, set()).add(websocket)

    def disconnect(self, channel: str, websocket: WebSocket) -> None:
        connections = self._channels.get(channel)
        if connections is not None:
            connections.discard(websocket)
            if not connections:
                self._channels.pop(channel, None)

    async def broadcast_local(self, channel: str, payload: dict) -> None:
        """Send `payload` to every connection on `channel` in THIS process only."""
        for websocket in list(self._channels.get(channel, ())):
            try:
                await websocket.send_json(payload)
            except Exception:
                self.disconnect(channel, websocket)


manager = ConnectionManager()


async def publish(channel: str, payload: dict[str, Any]) -> None:
    """Cross-process broadcast: publish to Redis; delivery to local
    connections happens via redis_listener() picking the message back up,
    even for same-process publishes (see module docstring)."""
    try:
        await get_redis().publish(f"{REDIS_CHANNEL_PREFIX}{channel}", json.dumps(payload, default=str))
    except Exception:
        logger.warning("ws publish failed for channel %s (redis unavailable?)", channel, exc_info=True)


async def redis_listener() -> None:
    """Long-running background task (started in FastAPI's lifespan): subscribes
    to every ws:* channel and re-broadcasts each message to this process's
    local connections. Required so a message published by one uvicorn worker
    reaches clients connected to a different worker.

    Retries with backoff on connection failure (e.g. Redis not up yet, or a
    transient outage) instead of dying permanently — WS delivery degrades to
    "nothing arrives live" in the meantime, which is the same soft-fail as a
    publish() failure (see module docstring), not a crash."""
    delay = 1
    while True:
        try:
            redis = get_redis()
            pubsub = redis.pubsub()
            await pubsub.psubscribe(f"{REDIS_CHANNEL_PREFIX}*")
            delay = 1  # connected successfully — reset backoff
            try:
                async for message in pubsub.listen():
                    if message["type"] != "pmessage":
                        continue
                    channel = message["channel"]
                    if isinstance(channel, bytes):
                        channel = channel.decode()
                    channel = channel[len(REDIS_CHANNEL_PREFIX):]
                    try:
                        payload = json.loads(message["data"])
                    except (TypeError, ValueError):
                        continue
                    await manager.broadcast_local(channel, payload)
            finally:
                await pubsub.punsubscribe(f"{REDIS_CHANNEL_PREFIX}*")
                await pubsub.aclose()
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.warning("ws redis_listener lost connection, retrying in %ss", delay, exc_info=True)
            await asyncio.sleep(delay)
            delay = min(delay * 2, 30)
