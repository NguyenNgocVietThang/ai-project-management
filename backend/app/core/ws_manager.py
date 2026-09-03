"""Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả
tính năng chat (app/api/ws/chat.py) và việc đẩy notification thời gian thực
(app/api/ws/notifications.py).

Mô hình phân phối: `publish()` chỉ publish tới Redis — nó cố tình
KHÔNG đồng thời broadcast trực tiếp tới các kết nối cục bộ của tiến trình này, vì
`redis_listener()` (đã subscribe cùng channel) đã re-broadcast
mọi message nó nhận được, kể cả những message do chính tiến trình này publish. Làm cả
hai sẽ phân phối trùng lặp tới bất kỳ client nào kết nối cục bộ. Điều này nghĩa là Redis
nằm trên đường tới hạn của mọi message chat và notification; nếu Redis
tạm thời không khả dụng, việc phân phối qua WS thất bại âm thầm (chat vẫn được lưu qua
DB + endpoint lịch sử REST, notification vẫn tới qua DB + fallback poll)
thay vì ném lỗi — một soft-fail có chủ đích.
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
    """Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm theo một
    tên channel tùy ý (ví dụ "chat:project:7" hoặc "notif:user:42")."""

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
        """Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY."""
        for websocket in list(self._channels.get(channel, ())):
            try:
                await websocket.send_json(payload)
            except Exception:
                self.disconnect(channel, websocket)


manager = ConnectionManager()


async def publish(channel: str, payload: dict[str, Any]) -> None:
    """Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối
    cục bộ diễn ra qua redis_listener() nhận lại message đó,
    kể cả với các publish trong cùng tiến trình (xem docstring của module)."""
    try:
        await get_redis().publish(f"{REDIS_CHANNEL_PREFIX}{channel}", json.dumps(payload, default=str))
    except Exception:
        logger.warning("ws publish failed for channel %s (redis unavailable?)", channel, exc_info=True)


async def redis_listener() -> None:
    """Task nền chạy dài (được khởi động trong lifespan của FastAPI): subscribe
    mọi channel ws:* và re-broadcast từng message tới các kết nối cục bộ của
    tiến trình này. Cần thiết để một message do một uvicorn worker publish
    tới được các client kết nối vào một worker khác.

    Retry với backoff khi kết nối thất bại (ví dụ Redis chưa lên, hoặc một
    sự cố tạm thời) thay vì chết vĩnh viễn — trong lúc đó việc phân phối WS suy giảm về
    "không có gì tới theo thời gian thực", đây cũng là soft-fail giống như một
    lần publish() thất bại (xem docstring của module), không phải crash."""
    delay = 1
    while True:
        try:
            redis = get_redis()
            pubsub = redis.pubsub()
            await pubsub.psubscribe(f"{REDIS_CHANNEL_PREFIX}*")
            delay = 1  # kết nối thành công — reset backoff
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
