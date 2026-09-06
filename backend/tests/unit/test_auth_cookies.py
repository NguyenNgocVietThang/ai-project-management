"""Credential phiên phải nằm ngoài tầm với của JavaScript.

Trước đây frontend giữ cả access lẫn refresh token trong localStorage và sao access
token vào một cookie JS đọc được, hạn 7 ngày cho một token sống 30 phút. Một lỗ hổng
XSS duy nhất là đủ để chiếm phiên kéo dài nhiều ngày.
"""
from types import SimpleNamespace

from fastapi import Response

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core import auth_cookies
from app.core.auth_cookies import (
    MEDIA_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    SESSION_FLAG_COOKIE_NAME,
    clear_session_cookies,
    read_refresh_token,
    set_session_cookies,
)


def _cookies(response: Response) -> dict[str, str]:
    return {
        header[1].decode().split("=", 1)[0]: header[1].decode()
        for header in response.raw_headers
        if header[0] == b"set-cookie"
    }


def test_refresh_token_cookie_is_httponly_and_scoped_to_auth_routes():
    response = Response()
    set_session_cookies(response, "refresh-value", "access-value")
    header = _cookies(response)[REFRESH_COOKIE_NAME]

    assert "HttpOnly" in header, "refresh token là credential sống lâu nhất ở đây"
    assert "Path=/api/v1/auth" in header, "không có lý do gì để gửi nó kèm mọi request"
    assert "samesite=lax" in header.lower()


def test_media_cookie_is_httponly_and_scoped_to_user_routes():
    response = Response()
    set_session_cookies(response, "refresh-value", "access-value")
    header = _cookies(response)[MEDIA_COOKIE_NAME]

    assert "HttpOnly" in header
    assert "Path=/api/v1/users" in header


def test_session_flag_carries_no_secret():
    """Middleware Edge cần biết CÓ phiên hay không, không cần chính credential."""
    response = Response()
    set_session_cookies(response, "refresh-value", "access-value")
    header = _cookies(response)[SESSION_FLAG_COOKIE_NAME]

    assert "refresh-value" not in header
    assert "access-value" not in header
    # Cờ này phải đọc được bằng JS — middleware ở origin frontend dựa vào nó.
    assert "HttpOnly" not in header


def test_no_cookie_carries_the_access_token_in_a_readable_form():
    response = Response()
    set_session_cookies(response, "refresh-value", "access-value")
    for name, header in _cookies(response).items():
        if "access-value" in header or "refresh-value" in header:
            assert "HttpOnly" in header, f"cookie {name} để lộ token cho JavaScript"


def test_clearing_removes_every_session_cookie():
    response = Response()
    clear_session_cookies(response)
    names = set(_cookies(response))
    assert {REFRESH_COOKIE_NAME, MEDIA_COOKIE_NAME, SESSION_FLAG_COOKIE_NAME} <= names


def test_refresh_token_is_read_from_the_cookie_first():
    request = SimpleNamespace(cookies={REFRESH_COOKIE_NAME: "from-cookie"})
    assert read_refresh_token(request, "from-body") == "from-cookie"


def test_non_browser_clients_may_still_present_it_in_the_body():
    """Script và ứng dụng di động không có kho cookie."""
    request = SimpleNamespace(cookies={})
    assert read_refresh_token(request, "from-body") == "from-body"


def test_missing_everywhere_reads_as_none():
    request = SimpleNamespace(cookies={})
    assert read_refresh_token(request, None) is None


def test_cookies_are_marked_secure_outside_development(monkeypatch):
    """Suy `secure` từ scheme quan sát được sẽ tự hạ cấp phía sau proxy TLS."""
    monkeypatch.setattr(auth_cookies.settings, "APP_ENV", "production")
    response = Response()
    set_session_cookies(response, "r", "a")
    for header in _cookies(response).values():
        assert "Secure" in header
