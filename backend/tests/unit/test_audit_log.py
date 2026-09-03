from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.services.audit_service import AuditService

NOW = datetime(2026, 8, 20, tzinfo=timezone.utc)


def build_db(*, total, rows):
    execute_result = Mock()
    execute_result.scalars.return_value.unique.return_value.all.return_value = rows
    return SimpleNamespace(
        scalar=AsyncMock(return_value=total),
        execute=AsyncMock(return_value=execute_result),
    )


@pytest.mark.asyncio
async def test_list_returns_empty_page():
    db = build_db(total=0, rows=[])
    service = AuditService(db)

    response = await service.list(page=1, page_size=20)

    assert response.total == 0
    assert response.items == []
    assert response.total_pages == 0


@pytest.mark.asyncio
async def test_list_maps_rows_with_actor():
    log = SimpleNamespace(
        id=1,
        user_id=9,
        user=SimpleNamespace(id=9, full_name="Admin One", email="admin@example.com"),
        action="CREATE",
        entity_type="User",
        entity_id=42,
        old_values=None,
        new_values={"email": "new@example.com"},
        ip_address=None,
        description="Admin created a user",
        created_at=NOW,
    )
    db = build_db(total=1, rows=[log])
    service = AuditService(db)

    response = await service.list(page=1, page_size=20, entity_type="User")

    assert response.total == 1
    assert response.total_pages == 1
    item = response.items[0]
    assert item.action == "CREATE"
    assert item.entity_id == 42
    assert item.user.full_name == "Admin One"
