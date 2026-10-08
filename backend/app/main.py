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
    from app.core.job_runner import JobRunner
    from app.db.session import AsyncSessionLocal
    from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status
    from app.services.cron_service import CRON_HANDLERS, catchup_loop
    from app.services.durable_handlers import HANDLERS
    runner = JobRunner(AsyncSessionLocal, {**AI_HANDLERS, **HANDLERS, **CRON_HANDLERS}, concurrency=settings.JOB_CONCURRENCY, poll_interval=settings.JOB_POLL_SECONDS, lease_seconds=settings.JOB_LEASE_SECONDS, task_timeout=settings.JOB_TIMEOUT_SECONDS, shutdown_timeout=settings.JOB_SHUTDOWN_TIMEOUT_SECONDS, on_transition=mirror_ai_status)
    stop = asyncio.Event()
    catchup_task = None
    if settings.JOBS_ENABLED:
        runner.start()
        catchup_task = asyncio.create_task(catchup_loop(AsyncSessionLocal, stop))
    try:
        yield
    finally:
        stop.set()
        if catchup_task is not None:
            catchup_task.cancel()
            try:
                await catchup_task
            except asyncio.CancelledError:
                pass
        await runner.stop()
        listener_task.cancel()
        try:
            await listener_task
        except asyncio.CancelledError:
            pass
        await close_redis()
        from app.db.session import engine, security_engine
        await engine.dispose()
        await security_engine.dispose()
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

# Limiter gắn theo route bằng decorator ở app/api/v1/endpoints/*; đoạn này chỉ đăng ký
# handler 429 và hook app.state cho slowapi.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Header bị ẩn khỏi JS cross-origin nếu không liệt kê ở đây; thiếu thì SPA không đọc
    # được thời gian chờ khi nhận 429.
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
            await asyncio.wait_for(db.execute(text("SELECT 1")), timeout=5)
        checks["database"] = "ok"
    except Exception:
        logger.warning("health check: database unreachable")
        checks["database"] = "unavailable"

    try:
        await asyncio.wait_for(get_redis().ping(), timeout=3)
        checks["redis"] = "ok"
    except Exception:
        logger.warning("health check: redis unreachable")
        # Redis là soft-fail ở mọi nơi khác trong ứng dụng (thu hồi token, khoá
        # đăng nhập, vé WS, pub/sub), nên nó suy giảm chứ không làm hỏng.
        checks["redis"] = "degraded"

    healthy = checks["database"] == "ok"
    return JSONResponse(
        {"status": "ok" if healthy else "unhealthy", "version": settings.APP_VERSION, "checks": checks},
        status_code=200 if healthy else 503,
    )
