"""Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào."""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.schemas.admin import RoleOptionResponse
from app.schemas.project import UserSearchResult
from app.services.user_service import _mask_email


def test_project_role_options_do_not_carry_the_permission_matrix():
    """Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận
    role -> permission của hệ thống, là món quà trinh sát cho leo thang quyền."""
    assert "permissions" not in RoleOptionResponse.model_fields
    assert "user_count" not in RoleOptionResponse.model_fields


def test_user_search_result_never_carries_a_usable_address():
    assert "email" not in UserSearchResult.model_fields
    assert "email_hint" in UserSearchResult.model_fields


@pytest.mark.parametrize(
    "address, expected",
    [
        ("nguyen.van.a@company.com", "ng***@company.com"),
        ("ab@company.com", "a***@company.com"),
        ("a@company.com", "a***@company.com"),
    ],
)
def test_masked_addresses_keep_the_domain_but_drop_the_mailbox(address, expected):
    assert _mask_email(address) == expected


def test_masking_a_malformed_address_reveals_nothing():
    assert _mask_email("") == "***"
    assert _mask_email("not-an-address") == "***"


@pytest.mark.asyncio
async def test_search_results_are_masked_end_to_end():
    from app.services.user_service import UserService

    service = UserService(AsyncMock(), AsyncMock())
    service.users = SimpleNamespace(
        search_active=AsyncMock(
            return_value=[
                SimpleNamespace(
                    id=1,
                    full_name="Nguyen Van A",
                    username="nguyenvana",
                    email="nguyen.van.a@company.com",
                    avatar_url=None,
                )
            ]
        )
    )

    results = await service.search_active_users("nguyen")

    assert results[0].email_hint == "ng***@company.com"
    assert not hasattr(results[0], "email")


def test_customer_role_cannot_read_project_work_items():
    """Customer bị chặn khỏi danh sách task; subtask và đồ thị phụ thuộc là hai
    đường khác dẫn tới cùng thông tin đó."""
    from app.core.exceptions import ForbiddenException
    from app.services.task_service import _require_task_reader

    customer = SimpleNamespace(is_admin=False, role="Customer")
    with pytest.raises(ForbiddenException):
        _require_task_reader(customer)

    for role in ("PM", "BA", "PO", "Member"):
        _require_task_reader(SimpleNamespace(is_admin=False, role=role))
    _require_task_reader(SimpleNamespace(is_admin=True, role="Customer"))
