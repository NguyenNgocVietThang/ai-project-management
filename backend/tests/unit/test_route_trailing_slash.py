"""Các endpoint danh sách phải nhận cả dạng có và không có dấu '/' cuối.

Next.js proxy có thể gửi `/api/v1/portfolios` (đã cắt '/'). Nếu FastAPI trả 307
sang URL tuyệt đối của backend, trình duyệt sẽ đi cross-origin và bị chặn
(CORS/CSP), người dùng chỉ thấy "Network Error".
"""

import pytest

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


def _paths_for(method: str) -> set[str]:
    return {
        route.path
        for route in app.routes
        if getattr(route, "methods", None) and method in route.methods
    }


@pytest.mark.parametrize("collection", LIST_COLLECTIONS)
def test_list_endpoint_accepts_both_slash_forms(collection: str) -> None:
    paths = _paths_for("GET")
    assert f"/api/v1/{collection}" in paths
    assert f"/api/v1/{collection}/" in paths


@pytest.mark.parametrize("collection", ["users", "roles", "portfolios", "projects"])
def test_create_endpoint_accepts_both_slash_forms(collection: str) -> None:
    paths = _paths_for("POST")
    assert f"/api/v1/{collection}" in paths
    assert f"/api/v1/{collection}/" in paths
