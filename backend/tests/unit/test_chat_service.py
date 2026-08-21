from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - register SQLAlchemy relationships
from app.core.exceptions import ForbiddenException
from app.schemas.chat import ChatMessageCreate
from app.services.chat_service import ChatService

NOW = datetime(2026, 8, 21, tzinfo=timezone.utc)


def build_message(**overrides):
    values = {
        "id": 1,
        "project_id": 7,
        "user_id": 3,
        "content": "hello",
        "created_at": NOW,
        "user": SimpleNamespace(full_name="Alice", avatar_url=None),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def build_actor(**overrides):
    values = {"id": 3, "full_name": "Alice", "avatar_url": None}
    values.update(overrides)
    return SimpleNamespace(**values)


@pytest.mark.asyncio
async def test_history_returns_items_in_chronological_order_and_flags_more():
    # DB returns newest-first, one extra row beyond `limit` to signal has_more.
    rows = [build_message(id=3), build_message(id=2), build_message(id=1)]
    scalars_result = SimpleNamespace(all=Mock(return_value=rows))
    db = SimpleNamespace(scalars=AsyncMock(return_value=scalars_result))
    service = ChatService(db)

    with patch("app.services.chat_service.get_project_context", AsyncMock()):
        result = await service.history(7, build_actor(), limit=2)

    assert [item.id for item in result.items] == [2, 3]  # chronological, oldest first
    assert result.has_more is True
    assert result.next_before_id == 2  # oldest id in this page — cursor for the next call


@pytest.mark.asyncio
async def test_history_no_more_pages_when_under_limit():
    rows = [build_message(id=1)]
    scalars_result = SimpleNamespace(all=Mock(return_value=rows))
    db = SimpleNamespace(scalars=AsyncMock(return_value=scalars_result))
    service = ChatService(db)

    with patch("app.services.chat_service.get_project_context", AsyncMock()):
        result = await service.history(7, build_actor(), limit=50)

    assert result.has_more is False
    assert result.next_before_id is None


@pytest.mark.asyncio
async def test_history_rejects_non_member():
    db = SimpleNamespace(scalars=AsyncMock())
    service = ChatService(db)

    with patch(
        "app.services.chat_service.get_project_context",
        AsyncMock(side_effect=ForbiddenException("You do not have access to this project")),
    ):
        with pytest.raises(ForbiddenException):
            await service.history(7, build_actor(), limit=50)


@pytest.mark.asyncio
async def test_create_message_persists_and_publishes():
    # Simulate what a real flush() against Postgres does: populate the
    # server-generated id/created_at via the INSERT...RETURNING SQLAlchemy
    # issues automatically for server_default columns.
    added = {}

    async def fake_flush():
        message = added["message"]
        message.id = 99
        message.created_at = NOW

    db = SimpleNamespace(add=Mock(side_effect=lambda obj: added.__setitem__("message", obj)), flush=AsyncMock(side_effect=fake_flush))
    service = ChatService(db)
    actor = build_actor()

    with (
        patch("app.services.chat_service.get_project_context", AsyncMock()),
        patch("app.services.chat_service.publish", new=AsyncMock()) as publish_mock,
    ):
        response = await service.create_message(7, actor, ChatMessageCreate(content="  hi team  "))

    db.add.assert_called_once()
    db.flush.assert_awaited_once()
    assert response.content == "hi team"
    assert response.user_name == "Alice"
    publish_mock.assert_awaited_once()
    channel, payload = publish_mock.call_args.args
    assert channel == "chat:project:7"
    assert payload["content"] == "hi team"


@pytest.mark.asyncio
async def test_unread_count_with_no_prior_read_state_counts_all_messages():
    db = SimpleNamespace(scalar=AsyncMock(side_effect=[None, 5]))
    service = ChatService(db)

    with patch("app.services.chat_service.get_project_context", AsyncMock()):
        result = await service.unread_count(7, build_actor())

    assert result.unread_count == 5
    assert result.last_read_message_id is None


@pytest.mark.asyncio
async def test_mark_read_creates_state_when_absent():
    db = SimpleNamespace(
        scalar=AsyncMock(side_effect=[10, None]),  # max(id), then no existing read-state row
        add=Mock(),
        flush=AsyncMock(),
    )
    service = ChatService(db)

    with patch("app.services.chat_service.get_project_context", AsyncMock()):
        result = await service.mark_read(7, build_actor())

    db.add.assert_called_once()
    assert result.last_read_message_id == 10


@pytest.mark.asyncio
async def test_mark_read_only_advances_forward():
    existing_state = SimpleNamespace(last_read_message_id=8, last_read_at=None)
    db = SimpleNamespace(
        scalar=AsyncMock(side_effect=[existing_state]),
        add=Mock(),
        flush=AsyncMock(),
    )
    service = ChatService(db)

    with patch("app.services.chat_service.get_project_context", AsyncMock()):
        result = await service.mark_read(7, build_actor(), message_id=5)  # older than 8

    assert result.last_read_message_id == 8  # unchanged — 5 < 8
