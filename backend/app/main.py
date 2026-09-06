import asyncio
import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

import app.db.base  # noqa: F401 - đăng ký tất cả models và các bảng liên kết
from app.api.v1.router import api_router
from app.api.ws.router import ws_router
from app.core.config import settings
from app.core.logging_config import (
    REQUEST_ID_HEADER,
    configure_logging,
    set_request_id,
)
from app.core.rate_limit import limiter, rate_limit_exceeded_handler
from app.core.redis_client import close_redis
from app.core.request_context import resolve_client_ip, set_client_ip
from app.core.ws_manager import redis_listener

configure_logging(json_output=settings.APP_ENV != "development")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    listener_task = asyncio.create_task(redis_listener())
    yield
    # Tắt ứng dụng
    listener_task.cancel()
    try:
        await listener_task
    except asyncio.CancelledError:
        pass
    # close_redis() vốn được định nghĩa nhưng chưa từng được gọi ở đâu, nên
    # connection pool bị bỏ lại khi tắt ứng dụng.
    await close_redis()
    logger.info("Shutdown complete")


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
async def attach_request_id(request: Request, call_next):
    """Gắn một id cho mỗi request và trả nó lại trong response.

    Nếu không có nó, không thể nối một dòng log với request sinh ra nó, và một
    báo cáo lỗi từ người dùng ("nó hỏng lúc 14:32") không tra ngược ra được gì.
    Tôn trọng id do reverse proxy đặt sẵn để một chuỗi lời gọi giữ chung một id.
    """
    request_id = request.headers.get(REQUEST_ID_HEADER) or uuid.uuid4().hex
    set_request_id(request_id)
    response = await call_next(request)
    response.headers[REQUEST_ID_HEADER] = request_id
    return response


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
    """Tình trạng sẵn sàng, bao gồm cả các phụ thuộc.

    Kiểm tra thật sự chạm tới Postgres và Redis. Một endpoint chỉ trả "ok" mà
    không kiểm tra gì sẽ báo khoẻ trong khi DB đã sập — nghĩa là load balancer
    vẫn tiếp tục đẩy traffic vào một instance không phục vụ được request nào.
    """
    from sqlalchemy import text

    from app.core.redis_client import get_redis
    from app.db.session import AsyncSessionLocal

    checks: dict[str, str] = {}

    try:
        async with AsyncSessionLocal() as db:
            await db.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception:
        logger.exception("health check: database unreachable")
        checks["database"] = "unavailable"

    try:
        await get_redis().ping()
        checks["redis"] = "ok"
    except Exception:
        logger.warning("health check: redis unreachable", exc_info=True)
        # Redis là soft-fail ở mọi nơi khác trong ứng dụng (thu hồi token, khoá
        # đăng nhập, vé WS, pub/sub), nên nó suy giảm chứ không làm hỏng.
        checks["redis"] = "degraded"

    healthy = checks["database"] == "ok"
    return JSONResponse(
        {"status": "ok" if healthy else "unhealthy", "version": settings.APP_VERSION, "checks": checks},
        status_code=200 if healthy else 503,
    )
