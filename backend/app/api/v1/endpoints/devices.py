"""
Endpoint thiết bị – đăng ký token push cho app di động.

POST   /devices           → Đăng ký / làm mới token FCM của thiết bị
DELETE /devices/{token}   → Hủy đăng ký (khi đăng xuất)
"""
from fastapi import APIRouter, Request, Response, status

from app.core.dependencies import CurrentUser
from app.core.rate_limit import DEVICE_LIMIT, limiter
from app.schemas.device import DeviceRegisterRequest, DeviceResponse
from app.services.device_service import DeviceServiceDep

router = APIRouter()


@router.post("", response_model=DeviceResponse)
@limiter.limit(DEVICE_LIMIT)
async def register_device(
    request: Request,
    body: DeviceRegisterRequest,
    service: DeviceServiceDep,
    current_user: CurrentUser,
):
    """Đăng ký hoặc làm mới token thiết bị của người dùng hiện tại (idempotent)."""
    return await service.register(current_user.id, body)


@router.delete("/{token}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit(DEVICE_LIMIT)
async def unregister_device(
    request: Request,
    token: str,
    service: DeviceServiceDep,
    current_user: CurrentUser,
):
    """Hủy token của chính người gọi. Luôn trả 204, kể cả khi token không tồn tại
    hoặc thuộc người khác, để không dò được sự tồn tại của token."""
    await service.unregister(current_user.id, token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
