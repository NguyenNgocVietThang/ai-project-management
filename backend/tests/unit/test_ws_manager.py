from unittest.mock import AsyncMock

import pytest

from app.core.ws_manager import ConnectionManager


class FakeWebSocket:
    """Stand-in for a Starlette WebSocket. Deliberately NOT a SimpleNamespace:
    SimpleNamespace defines __eq__ without __hash__, making instances
    unhashable — but ConnectionManager stores connections in a set(), same as
    real WebSocket objects (which use default identity hashing)."""

    def __init__(self, *, send_fails: bool = False):
        self.accept = AsyncMock()

        async def _send_json(payload):
            if send_fails:
                raise RuntimeError("connection closed")

        self.send_json = _send_json


def fake_ws(*, send_fails: bool = False) -> FakeWebSocket:
    return FakeWebSocket(send_fails=send_fails)


@pytest.mark.asyncio
async def test_connect_registers_websocket_on_channel():
    manager = ConnectionManager()
    ws = fake_ws()

    await manager.connect("chat:project:1", ws)

    assert ws in manager._channels["chat:project:1"]
    ws.accept.assert_awaited_once()


@pytest.mark.asyncio
async def test_disconnect_removes_websocket_and_empty_channel():
    manager = ConnectionManager()
    ws = fake_ws()
    await manager.connect("chat:project:1", ws)

    manager.disconnect("chat:project:1", ws)

    assert "chat:project:1" not in manager._channels


def test_disconnect_on_unknown_channel_is_a_noop():
    manager = ConnectionManager()
    # Should not raise even though nothing was ever connected.
    manager.disconnect("nope", fake_ws())


@pytest.mark.asyncio
async def test_broadcast_local_sends_to_every_connection_on_channel():
    manager = ConnectionManager()
    ws1, ws2 = fake_ws(), fake_ws()
    await manager.connect("chat:project:1", ws1)
    await manager.connect("chat:project:1", ws2)
    await manager.connect("chat:project:2", fake_ws())  # different channel, must not receive

    received = []
    ws1.send_json = AsyncMock(side_effect=lambda p: received.append((1, p)))
    ws2.send_json = AsyncMock(side_effect=lambda p: received.append((2, p)))

    await manager.broadcast_local("chat:project:1", {"content": "hi"})

    assert len(received) == 2
    assert all(payload == {"content": "hi"} for _, payload in received)


@pytest.mark.asyncio
async def test_broadcast_local_drops_connection_that_fails_to_send():
    manager = ConnectionManager()
    ws = fake_ws(send_fails=True)
    await manager.connect("chat:project:1", ws)

    await manager.broadcast_local("chat:project:1", {"content": "hi"})

    assert "chat:project:1" not in manager._channels
