import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi.errors import RateLimitExceeded

import app.db.base  # noqa: F401 - đăng ký tất cả models và các bảng liên kết
from app.api.v1.router import api_router
from app.api.ws.router import ws_router
from app.core.config import settings
from app.core.rate_limit import limiter, rate_limit_exceeded_handler
from app.core.request_context import resolve_client_ip, set_client_ip
from app.core.ws_manager import redis_listener


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    listener_task = asyncio.create_task(redis_listener())
    yield
    # Tắt ứng dụng
    listener_task.cancel()
    try:
        await listener_task
    except asyncio.CancelledError:
        pass
    print("Shutting down...")


# Trang tài liệu tương tác liệt kê mọi route, schema và giá trị enum — hữu ích khi
# phát triển, nhưng là nguồn do thám miễn phí khi chạy production.
_DOCS_ENABLED = settings.APP_ENV == "development"

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Project Planning & Portfolio Management API",
    docs_url="/docs" if _DOCS_ENABLED else None,
    redoc_url="/redoc" if _DOCS_ENABLED else None,
    openapi_url="/openapi.json" if _DOCS_ENABLED else None,
    lifespan=lifespan,
)

@app.middleware("http")
async def capture_client_ip(request: Request, call_next):
    """Công bố IP của bên gọi trong suốt vòng đời request để các dòng audit
    được ghi sâu trong tầng service có thể lưu lại (xem core/request_context.py)."""
    set_client_ip(
        resolve_client_ip(request, trust_proxy_headers=settings.TRUST_PROXY_HEADERS)
    )
    return await call_next(request)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Các header gia cố cơ bản trên mọi response của API.

    Không đặt Content-Security-Policy ở đây: ứng dụng này phục vụ JSON và hình ảnh,
    và một CSP hạn chế sẽ làm hỏng Swagger UI khi phát triển. CSP ở cấp trang mới
    thực sự quan trọng và nằm trong frontend/next.config.js.
    """
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    if settings.APP_ENV != "development":
        response.headers.setdefault(
            "Strict-Transport-Security", "max-age=31536000; includeSubDomains"
        )
    return response


# Từ chối các request mang Host header mà chúng ta không phục vụ.
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# Rate limiting — bản thân limiter được gắn theo từng route qua decorator trong
# app/api/v1/endpoints/*; đoạn này đăng ký handler 429 và hook app.state mà
# slowapi dùng để tra cứu limiter.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Response header bị ẩn khỏi JS cross-origin trừ khi được liệt kê ở đây. Nếu
    # thiếu, SPA sẽ nhận 429 mà không giải thích được, vì không đọc được cần chờ
    # bao lâu.
    expose_headers=["Retry-After"],
)

# Routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(ws_router, prefix="/ws")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}
