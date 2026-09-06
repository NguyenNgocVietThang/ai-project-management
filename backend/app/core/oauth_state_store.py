"""Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt và PKCE.

Trước đây `state` là một chuỗi tự mô tả được ký bằng HMAC. Chữ ký chứng minh
được rằng *server này* đã tạo ra nó, nhưng không chứng minh được nó được tạo ra
cho *trình duyệt đang quay lại*, và không có gì đánh dấu là đã dùng. Hai hệ quả:

  * Login CSRF. Kẻ tấn công tự gọi /oauth/google/login để lấy một state hợp lệ,
    rồi dụ nạn nhân mở URL callback kèm `code` của kẻ tấn công. Nạn nhân bị đăng
    nhập vào tài khoản của kẻ tấn công và những gì họ làm tiếp theo đổ vào đó.
  * Một state dùng lại được nhiều lần trong suốt cửa sổ 15 phút.

Bây giờ state là một token đục (opaque), sự thật nằm ở Redis: xoá-khi-đọc nên chỉ
dùng được một lần, và bên đổi phải trình ra bí mật nằm trong một cookie mà chỉ
trình duyệt đã khởi tạo luồng mới có. Cùng chỗ đó giữ luôn `code_verifier` của
PKCE, thứ không bao giờ rời khỏi server.

Chỉ SHA-256 được dùng làm key và để so bí mật, nên một bản dump key Redis không
trao ra thứ gì dùng lại được.

Store này cố tình fail CLOSED. Một cơ chế chống CSRF mà im lặng bỏ qua khi Redis
gián đoạn thì không phải là cơ chế bảo vệ — nó chỉ là cảm giác an toàn.
"""
import hashlib
import json
import secrets
from base64 import urlsafe_b64encode
from typing import Any

from app.core.config import settings
from app.core.redis_client import get_redis

STATE_KEY_PREFIX = "auth:oauth_state:"
# Đủ dài cho một vòng chuyển hướng tới provider kèm màn hình chọn tài khoản,
# đủ ngắn để một state bị rò rỉ nhanh chóng trở nên vô dụng.
STATE_TTL_SECONDS = 15 * 60
# Tên cookie mang bí mật ràng buộc luồng với trình duyệt đã khởi tạo nó.
STATE_COOKIE_NAME = "oauth_state"


def _key(state: str, browser_secret: str) -> str:
    """Key Redis cho một luồng, dẫn xuất từ CẢ state lẫn bí mật trong cookie.

    Ràng buộc theo cách này thay vì lưu bí mật rồi so sánh sau: bên không có cookie
    thậm chí không tính ra được key, nên lần getdel của họ trỏ vào một key không tồn
    tại và không thể phá huỷ luồng thật. Nếu so sánh sau khi getdel, chỉ cần biết
    `state` (nó nằm ngay trên URL) là đủ để đốt luồng của nạn nhân trước khi callback
    hợp lệ kịp về — một cách chặn đăng nhập rất rẻ.
    """
    material = f"{state}:{browser_secret}".encode()
    return f"{STATE_KEY_PREFIX}{hashlib.sha256(material).hexdigest()}"


def new_code_verifier() -> str:
    """Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved."""
    return secrets.token_urlsafe(64)


def code_challenge_for(verifier: str) -> str:
    """Challenge S256 tương ứng với `verifier`."""
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")


async def issue(payload: dict[str, Any]) -> tuple[str, str]:
    """Lưu `payload` và trả về `(state, browser_secret)`.

    `state` đi qua provider và quay lại trên URL. `browser_secret` được đặt vào
    một cookie httpOnly và không bao giờ rời khỏi trình duyệt của người dùng —
    callback chỉ được chấp nhận khi trình ra được cả hai.

    Ném lỗi nếu không kết nối được store; nơi gọi phải báo lỗi đăng nhập chứ
    không được tiếp tục mà bỏ qua bước bảo vệ.
    """
    state = secrets.token_urlsafe(32)
    browser_secret = secrets.token_urlsafe(32)
    await get_redis().set(
        _key(state, browser_secret),
        json.dumps(payload),
        ex=STATE_TTL_SECONDS,
    )
    return state, browser_secret


async def consume(state: str, browser_secret: str | None) -> dict[str, Any] | None:
    """Trả về payload cho `state` rồi vô hiệu hoá nó, hoặc None nếu không hợp lệ.

    None có nghĩa: state không xác định, đã hết hạn, đã dùng, hoặc quay lại từ một
    trình duyệt không phải nơi khởi tạo luồng. Nơi gọi không cần phân biệt các
    trường hợp này — và cũng không nên nói cho ai biết là trường hợp nào.

    Việc đọc-và-xoá là atomic nên hai lần đổi đồng thời không thể cùng thành công.
    """
    if not state or not browser_secret:
        return None
    raw = await get_redis().getdel(_key(state, browser_secret))
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return None


def state_cookie_kwargs() -> dict[str, Any]:
    """Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt.

    `lax` chứ không phải `strict`: cookie phải sống sót qua bước điều hướng trở về
    từ tên miền của provider, mà `strict` sẽ chặn. `httpOnly` vì không có mã
    JavaScript nào cần đọc nó — nó chỉ tồn tại để chứng minh callback quay lại đúng
    trình duyệt đã bắt đầu luồng. Path bó hẹp vào chính các route OAuth để cookie
    không đi kèm mọi request khác.
    """
    return {
        "httponly": True,
        "secure": settings.APP_ENV != "development",
        "samesite": "lax",
        "path": f"{settings.API_V1_PREFIX}/oauth",
        "max_age": STATE_TTL_SECONDS,
    }


def state_cookie_path() -> str:
    return f"{settings.API_V1_PREFIX}/oauth"
