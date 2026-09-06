"""Mã hand-off dùng một lần cho redirect của OAuth.

Callback của provider phải đưa một cặp token vừa được tạo từ backend vào
SPA, và kênh duy nhất mà một 302 cho phép là URL. Đặt token trực tiếp ở đó
sẽ làm lộ chúng vào lịch sử trình duyệt, header `Referer` của bất cứ thứ gì
trang đích tải về, và access log của mọi proxy nằm giữa — tất cả cho
những credential có hiệu lực nhiều ngày.

Vì vậy redirect thay vào đó mang một mã ngẫu nhiên tồn tại ngắn, trỏ tới một entry Redis
giữ các token thật. SPA POST mã đó thẳng trở lại và entry bị
xóa ngay lần đọc đầu tiên: một mã bị bắt từ lịch sử hay log là vô giá trị một khi
client hợp lệ đã dùng nó, và dù sao cũng vô giá trị sau EXCHANGE_TTL_SECONDS.

Chỉ SHA-256 của mã được dùng làm key, nên một bản dump các key Redis không
trao ra những mã có thể sử dụng.
"""
import hashlib
import json
import secrets

from app.core.redis_client import get_redis

EXCHANGE_KEY_PREFIX = "auth:oauth_exchange:"
# Đủ dài cho một redirect và một lần tải trang, đủ ngắn để một mã bị lấy từ
# log gần như chắc chắn đã hết hiệu lực.
EXCHANGE_TTL_SECONDS = 120


def _key(code: str) -> str:
    return f"{EXCHANGE_KEY_PREFIX}{hashlib.sha256(code.encode()).hexdigest()}"


async def issue(access_token: str, refresh_token: str) -> str:
    """Lưu một cặp token và trả về mã dùng để đổi lấy nó.

    Ném lỗi nếu không kết nối được tới store — caller phải hiển thị lỗi đăng nhập
    thay vì quay lại việc đặt token vào URL.
    """
    code = secrets.token_urlsafe(32)
    await get_redis().set(
        _key(code),
        json.dumps({"access_token": access_token, "refresh_token": refresh_token}),
        ex=EXCHANGE_TTL_SECONDS,
    )
    return code


async def redeem(code: str) -> tuple[str, str] | None:
    """Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác định,
    đã hết hạn, hoặc đã được dùng. Việc xóa và đọc là một bước atomic nên hai
    lần đổi mã đồng thời không thể cùng thành công."""
    if not code:
        return None
    raw = await get_redis().getdel(_key(code))
    if not raw:
        return None
    try:
        payload = json.loads(raw)
        return payload["access_token"], payload["refresh_token"]
    except (TypeError, ValueError, KeyError):
        return None
