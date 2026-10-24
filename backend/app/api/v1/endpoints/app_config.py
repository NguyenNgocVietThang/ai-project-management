"""
GET /app/config → Phiên bản tối thiểu/mới nhất và trạng thái bảo trì cho app di động.

Công khai (app gọi trước khi đăng nhập) nên chỉ trả thông tin không nhạy cảm.
"""
from fastapi import APIRouter, Request, Response

from app.core.config import settings
from app.core.rate_limit import APP_CONFIG_LIMIT, limiter
from app.schemas.app_config import AppConfigResponse

router = APIRouter()


@router.get("/config", response_model=AppConfigResponse)
@limiter.limit(APP_CONFIG_LIMIT)
async def get_app_config(request: Request, response: Response):
    """Trả cấu hình phiên bản. Không chặn các API khác khi đang bảo trì."""
    response.headers["Cache-Control"] = "no-store"
    return AppConfigResponse(
        min_supported_version=settings.APP_MIN_SUPPORTED_VERSION,
        latest_version=settings.APP_LATEST_VERSION,
        maintenance=settings.MAINTENANCE_MODE,
        maintenance_message=settings.MAINTENANCE_MESSAGE or None,
    )
