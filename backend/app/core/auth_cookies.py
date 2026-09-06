"""Cookie phiên đăng nhập do server đặt.

Trước đây frontend giữ CẢ access token lẫn refresh token trong `localStorage` và
sao access token vào một cookie mà JavaScript đọc được. Bất kỳ lỗ hổng XSS nào
cũng lấy được refresh token, tức là chiếm phiên kéo dài nhiều ngày chứ không phải
vài phút. Ba cookie ở đây chuyển phần nhạy cảm sang chỗ mà script không với tới:

  refresh  — httpOnly, bó path vào chính route auth. Là thứ duy nhất cho phép
             kéo dài phiên, nên cũng là thứ duy nhất đáng để đánh cắp.
  media    — httpOnly, bó path vào route user. Trình duyệt tự gửi nó cho
             `<img src>` của avatar, thứ không thể mang header Authorization.
             XSS không đọc được, và nó không đi kèm bất kỳ request nào khác.
  session  — KHÔNG phải credential và không chứa gì bí mật. Chỉ là một lá cờ để
             Next.js Edge Middleware biết có nên hiển thị trang đăng nhập hay
             không; server không bao giờ tin nó. Nó tồn tại vì middleware chạy ở
             origin của frontend và không đọc được cookie do API đặt.

`secure` bám theo APP_ENV thay vì theo scheme quan sát được: sau một reverse proxy
kết thúc TLS, ứng dụng thấy http và sẽ tự hạ cấp chính nó nếu suy từ scheme.
"""
from typing import Any

from fastapi import Request, Response

from app.core.config import settings

REFRESH_COOKIE_NAME = "refresh-token"
MEDIA_COOKIE_NAME = "media-token"
# Không mang bí mật; chỉ để middleware phía frontend biết có phiên hay không.
SESSION_FLAG_COOKIE_NAME = "has-session"


def _refresh_path() -> str:
    return f"{settings.API_V1_PREFIX}/auth"


def _media_path() -> str:
    return f"{settings.API_V1_PREFIX}/users"


def _base(path: str, max_age: int, *, http_only: bool = True) -> dict[str, Any]:
    return {
        "httponly": http_only,
        "secure": settings.APP_ENV != "development",
        # `lax` chứ không `strict`: `strict` sẽ chặn cookie ở lần điều hướng quay
        # về từ provider OAuth, làm hỏng đăng nhập mạng xã hội.
        "samesite": "lax",
        "path": path,
        "max_age": max_age,
    }


def set_session_cookies(response: Response, refresh_token: str, access_token: str) -> None:
    """Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth."""
    access_ttl = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        refresh_token,
        **_base(_refresh_path(), settings.REFRESH_TOKEN_EXPIRE_DAYS * 86_400),
    )
    response.set_cookie(
        MEDIA_COOKIE_NAME,
        access_token,
        **_base(_media_path(), access_ttl),
    )
    response.set_cookie(
        SESSION_FLAG_COOKIE_NAME,
        "1",
        **_base("/", settings.REFRESH_TOKEN_EXPIRE_DAYS * 86_400, http_only=False),
    )


def clear_session_cookies(response: Response) -> None:
    response.delete_cookie(REFRESH_COOKIE_NAME, path=_refresh_path())
    response.delete_cookie(MEDIA_COOKIE_NAME, path=_media_path())
    response.delete_cookie(SESSION_FLAG_COOKIE_NAME, path="/")


def read_refresh_token(request: Request, fallback: str | None = None) -> str | None:
    """Refresh token của người gọi: ưu tiên cookie, sau đó tới body.

    Body vẫn được chấp nhận cho các client không phải trình duyệt (script, ứng dụng
    di động) vốn không có kho cookie. Trình duyệt thì không bao giờ đi đường đó nữa.
    """
    return request.cookies.get(REFRESH_COOKIE_NAME) or fallback
