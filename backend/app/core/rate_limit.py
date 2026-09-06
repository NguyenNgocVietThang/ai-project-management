"""Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).

Được hỗ trợ bởi cùng một instance Redis với bus pub/sub của WebSocket (REDIS_URL, db 0)
để bộ đếm được chia sẻ giữa các worker uvicorn — một limiter trong tiến trình sẽ cho phép
kẻ tấn công nhân hạn mức của họ lên theo số lượng worker.

Được áp dụng theo từng route qua `@limiter.limit(...)` thay vì như một middleware bao trùm,
vì các hạn mức hữu ích khác nhau tới vài bậc độ lớn (một lần thử login so với một
lần poll dashboard). Các route mang một hạn mức phải khai báo tham số `request: Request`
— slowapi đọc client key từ nó.
"""
import time

from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import Response

from app.core.config import settings

# Các hạn mức, được đặt tên để nơi gọi đọc ra ý định thay vì là các magic string.
LOGIN_LIMIT = "5/minute"
REGISTER_LIMIT = "3/hour"
PASSWORD_RESET_LIMIT = "3/hour"
RESET_CONSUME_LIMIT = "10/hour"
REFRESH_LIMIT = "20/minute"
EMAIL_VERIFY_LIMIT = "10/hour"
USER_SEARCH_LIMIT = "30/minute"
AVATAR_UPLOAD_LIMIT = "5/hour"
# Bắt đầu luồng OAuth thì rẻ, nhưng callback thực hiện hai lời gọi HTTP ra ngoài
# tới provider, nên nó là một cách để bên chưa xác thực tiêu tài nguyên của ta.
OAUTH_START_LIMIT = "10/minute"
OAUTH_CALLBACK_LIMIT = "10/minute"
# Vé WebSocket rẻ nhưng được xin lại ở mỗi lần kết nối lại; hạn mức này đủ rộng
# cho việc chuyển tab và mạng chập chờn, đủ chặt để một vòng lặp kết nối lại bị lộ.
WS_TICKET_LIMIT = "60/minute"
# Chat qua WebSocket đã có budget riêng theo từng socket (10 tin/10 giây, xem
# app/api/ws/chat.py). Đường REST dự phòng thì không có gì, nên client chỉ cần đổi
# sang nó là spam thoải mái — hạn mức này khớp với budget của socket.
CHAT_POST_LIMIT = "60/minute"
# Ghi hàng loạt: mỗi lần gọi có thể chạm tới hàng trăm task và kéo theo một lần
# tính lại lịch trình toàn dự án.
BULK_WRITE_LIMIT = "20/minute"


def client_key(request: Request) -> str:
    """Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì là IP.

    Bearer token được đọc thẳng từ header thay vì đi qua dependency
    `get_current_user` — việc giới hạn phải xảy ra trước khi ta tốn một
    round-trip DB, và kẻ tấn công xoay vòng token vẫn quy về IP của họ.
    """
    authorization = request.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        return f"token:{authorization[7:][:64]}"
    return f"ip:{get_remote_address(request)}"


limiter = Limiter(
    key_func=client_key,
    storage_uri=settings.REDIS_URL,
    strategy="fixed-window",
    # Tắt vì slowapi chèn các header X-RateLimit-* của nó bằng cách sửa đổi giá trị
    # mà endpoint trả về, điều này chỉ hoạt động với handler trả về một Response
    # object — của chúng ta trả về Pydantic model. Đường 429 vẫn mang
    # Retry-After, được thêm bởi rate_limit_exceeded_handler bên dưới.
    headers_enabled=False,
    # Redis sập phải suy giảm về đếm cục bộ, không bao giờ thành lỗi 500 khi
    # thử login — bus WS cũng đã coi Redis là soft-fail vì lý do tương tự.
    in_memory_fallback_enabled=True,
    swallow_errors=True,
)


def _retry_after_seconds(request: Request, exc: RateLimitExceeded) -> int:
    """Số giây cho tới khi cửa sổ của caller được reset.

    Ưu tiên số liệu cửa sổ trực tiếp để giá trị thu nhỏ khi cửa sổ vơi dần;
    quay lại dùng toàn bộ chu kỳ của hạn mức nếu không truy vấn được storage
    (fallback trong bộ nhớ sau một cú gián đoạn Redis chẳng hạn).
    """
    view_limit = getattr(request.state, "view_rate_limit", None)
    if view_limit is not None:
        try:
            reset_at, _remaining = limiter.limiter.get_window_stats(
                view_limit[0], *view_limit[1]
            )
            return max(1, int(reset_at - time.time()))
        except Exception:  # không kết nối được storage — rơi xuống dùng chu kỳ tĩnh
            pass
    return max(1, int(exc.limit.limit.get_expiry()))


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này.

    Cố tình không cho biết hạn mức nào đã bị chạm — điều đó nói cho kẻ tấn công biết
    họ có thể retry nhanh đến đâu mà không kích hoạt nó.
    """
    return JSONResponse(
        {"detail": "Too many requests. Please slow down and try again later."},
        status_code=429,
        headers={"Retry-After": str(_retry_after_seconds(request, exc))},
    )
