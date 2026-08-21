from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - register SQLAlchemy relationships
from app.models.notification import NotificationType
from app.services.notification_service import NotificationService


@pytest.mark.asyncio
async def test_push_persists_and_broadcasts_over_websocket():
    added = {}

    async def fake_flush():
        notification = added["notification"]
        notification.id = 42
        from datetime import datetime, timezone

        notification.created_at = datetime(2026, 8, 21, tzinfo=timezone.utc)

    db = SimpleNamespace(
        add=Mock(side_effect=lambda obj: added.__setitem__("notification", obj)),
        flush=AsyncMock(side_effect=fake_flush),
    )

    with patch("app.core.ws_manager.publish", new=AsyncMock()) as publish_mock:
        result = await NotificationService.push(
            db,
            user_id=7,
            title="Task due soon",
            message="Task X is due tomorrow",
            ntype=NotificationType.TASK_DUE_SOON,
            link="/projects/1/tasks/2",
            entity_type="Task",
            entity_id=2,
        )

    db.add.assert_called_once()
    db.flush.assert_awaited_once()
    assert result.id == 42

    publish_mock.assert_awaited_once()
    channel, payload = publish_mock.call_args.args
    assert channel == "notif:user:7"
    assert payload["id"] == 42
    assert payload["notification_type"] == "TASK_DUE_SOON"
    assert payload["title"] == "Task due soon"
    assert payload["created_at"] == "2026-08-21T00:00:00+00:00"


@pytest.mark.asyncio
async def test_push_does_not_shield_callers_from_a_broadcast_exception():
    """push() does not wrap publish() in its own try/except — the guarantee
    that a Redis outage can't take down notification creation lives entirely
    in ws_manager.publish()'s own soft-fail (it catches everything and only
    logs). This test documents that contract: if publish() ever stopped
    swallowing its own errors, a WS blip would propagate here and roll back
    the notification row along with it, so ws_manager.publish() must keep
    catching broadly."""
    added = {}

    async def fake_flush():
        notification = added["notification"]
        notification.id = 1
        from datetime import datetime, timezone

        notification.created_at = datetime(2026, 8, 21, tzinfo=timezone.utc)

    db = SimpleNamespace(
        add=Mock(side_effect=lambda obj: added.__setitem__("notification", obj)),
        flush=AsyncMock(side_effect=fake_flush),
    )

    with patch("app.core.ws_manager.publish", new=AsyncMock(side_effect=RuntimeError("redis down"))):
        with pytest.raises(RuntimeError):
            await NotificationService.push(
                db, user_id=7, title="t", message="m", ntype=NotificationType.SYSTEM
            )

    # The row was still added/flushed before the broadcast attempt.
    db.add.assert_called_once()
    db.flush.assert_awaited_once()
