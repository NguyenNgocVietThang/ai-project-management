"""Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).

Database mode dùng counter Postgres bền vững và không fallback khi DB lỗi.
Nhánh Redis dưới đây giữ chế độ development hiện có.

Được hỗ trợ bởi cùng một instance Redis với bus pub/sub của WebSocket (REDIS_URL, db 0)
để bộ đếm được chia sẻ giữa các worker uvicorn — một limiter trong tiến trình sẽ cho phép
kẻ tấn công nhân hạn mức của họ lên theo số lượng worker.

Được áp dụng theo từng route qua `@limiter.limit(...)` thay vì như một middleware bao trùm,
vì các hạn mức hữu ích khác nhau tới vài bậc độ lớn (một lần thử login so với một
lần poll dashboard). Các route mang một hạn mức phải khai báo tham số `request: Request`
— slowapi đọc client key từ nó.
"""
import functools
import inspect
import time

from fastapi import Request
from fastapi.responses import JSONResponse
from limits.util import parse_many
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import Response

from app.core.config import settings
from app.core.exceptions import TooManyRequestsException
from app.core.request_context import resolve_client_ip
from app.services import security_state_service as durable_state

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
# Chat WebSocket đã có budget riêng theo socket (10 tin/10 giây, xem app/api/ws/chat.py);
# hạn mức của đường REST dự phòng khớp với budget đó.
CHAT_POST_LIMIT = "60/minute"
# Ghi hàng loạt: mỗi lần gọi có thể chạm tới hàng trăm task và kéo theo một lần
# tính lại lịch trình toàn dự án.
BULK_WRITE_LIMIT = "20/minute"


def client_key(request: Request) -> str:
    """Use a stable IP; unverified Bearer strings must not create new budgets."""
    address = resolve_client_ip(request, trust_proxy_headers=settings.TRUST_PROXY_HEADERS)
    return f"ip:{address or get_remote_address(request)}"


class SecurityLimiter(Limiter):
    """Preserve Slowapi decorators, with an async durable path in database mode.

    Slowapi's storage contract is synchronous. Using its Redis fallback here would
    reset security counters across restart; the database branch calls the original
    async endpoint only after a committed atomic counter update instead.
    """

    def limit(self, limit_value, key_func=None, per_method=False, methods=None,
              error_message=None, exempt_when=None, cost=1, override_defaults=True):
        redis_decorator = super().limit(
            limit_value, key_func=key_func, per_method=per_method, methods=methods,
            error_message=error_message, exempt_when=exempt_when, cost=cost,
            override_defaults=override_defaults,
        )

        def decorator(endpoint):
            redis_endpoint = redis_decorator(endpoint)
            signature = inspect.signature(endpoint)
            scope = f"{endpoint.__module__}.{endpoint.__qualname__}"
            if not inspect.iscoroutinefunction(endpoint):
                raise TypeError("Security-limited endpoints must be async")

            @functools.wraps(endpoint)
            async def wrapper(*args, **kwargs):
                if not durable_state.database_enabled():
                    return await redis_endpoint(*args, **kwargs)
                if not self.enabled:
                    return await endpoint(*args, **kwargs)
                request = signature.bind_partial(*args, **kwargs).arguments.get("request")
                if not isinstance(request, Request):
                    raise TypeError("Rate-limited endpoints require request: Request")
                if methods and request.method.upper() not in {m.upper() for m in methods}:
                    return await endpoint(*args, **kwargs)
                if exempt_when and (exempt_when(request) if inspect.signature(
                    exempt_when
                ).parameters else exempt_when()):
                    return await endpoint(*args, **kwargs)
                value = limit_value() if callable(limit_value) else limit_value
                identity = (key_func or client_key)(request)
                method = request.method if per_method else ""
                hits = cost() if callable(cost) else cost
                if hits != 1:
                    raise ValueError("Durable rate limits support cost=1")
                for budget in parse_many(value):
                    key = f"{scope}:{method}:{budget}:{identity}"
                    count, retry_after = await durable_state.increment(
                        "rate-limit", key, int(budget.get_expiry())
                    )
                    if count > budget.amount:
                        raise TooManyRequestsException(
                            "Too many requests. Please slow down and try again later.",
                            retry_after=retry_after,
                        )
                return await endpoint(*args, **kwargs)

            return wrapper

        return decorator


limiter = SecurityLimiter(
    key_func=client_key,
    storage_uri=settings.REDIS_URL,
    strategy="fixed-window",
    # Tắt vì slowapi chèn header X-RateLimit-* bằng cách sửa giá trị endpoint trả về, chỉ
    # chạy với handler trả Response (ở đây là Pydantic model). Đường 429 vẫn có Retry-After
    # từ rate_limit_exceeded_handler.
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
