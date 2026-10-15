"""Các endpoint danh sách phải nhận cả dạng có và không có dấu '/' cuối.

Next.js proxy có thể gửi `/api/v1/portfolios` (đã cắt '/'). Nếu FastAPI trả 307
sang URL tuyệt đối của backend, trình duyệt sẽ đi cross-origin và bị chặn
(CORS/CSP), người dùng chỉ thấy "Network Error".
"""

import pytest
from starlette.routing import Match

from app.main import app

LIST_COLLECTIONS = [
    "users",
    "roles",
    "permissions",
    "portfolios",
    "projects",
    "notifications",
    "audit",
]


def _is_routed(method: str, path: str) -> bool:
    """Kiểm tra có route khớp hoàn toàn mà không cần redirect.

    FastAPI mới nạp router con theo kiểu lazy nên `app.routes` không còn liệt kê phẳng
    từng đường dẫn; khớp trực tiếp qua bộ định tuyến không phụ thuộc cấu trúc nội bộ đó.
    """
    scope = {"type": "http", "method": method, "path": path, "root_path": ""}
    return any(route.matches(scope)[0] == Match.FULL for route in app.routes)


@pytest.mark.parametrize("collection", LIST_COLLECTIONS)
def test_list_endpoint_accepts_both_slash_forms(collection: str) -> None:
    assert _is_routed("GET", f"/api/v1/{collection}")
    assert _is_routed("GET", f"/api/v1/{collection}/")


@pytest.mark.parametrize("collection", ["users", "roles", "portfolios", "projects"])
def test_create_endpoint_accepts_both_slash_forms(collection: str) -> None:
    assert _is_routed("POST", f"/api/v1/{collection}")
    assert _is_routed("POST", f"/api/v1/{collection}/")
