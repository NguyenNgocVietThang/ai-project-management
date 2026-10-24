"""Adapter gửi push notification (FCM HTTP v1) với chế độ giả lập cho test.

Chọn provider bằng `PUSH_PROVIDER`:
  disabled — mặc định, không gửi gì (và NotificationService không tạo job).
  fake     — ghi vào `fake_outbox` trong bộ nhớ, không gọi mạng. Chỉ cho test/development.
  fcm      — gọi FCM HTTP v1, xác thực OAuth2 bằng service account (JWT RS256 qua PyJWT).

Lỗi ném ra là `PushDeliveryError`, không chứa nội dung phản hồi của provider (theo mẫu
`EmailDeliveryError`) vì thông điệp có thể bị lưu cùng job.
"""
import json
import time
from dataclasses import dataclass, field

import httpx
import jwt

from app.core.config import settings

FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging"
DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token"
FCM_SEND_URL = "https://fcm.googleapis.com/v1/projects/{project_id}/messages:send"
# Làm mới access token sớm hơn hạn một chút để không gửi bằng token sắp chết.
TOKEN_REFRESH_MARGIN_SECONDS = 120


class PushDeliveryError(RuntimeError):
    """An toàn để lưu vào lỗi của job; không chứa phản hồi của provider."""

    def __init__(self, message: str, *, retryable: bool = False, unregistered: bool = False):
        super().__init__(message)
        self.retryable = retryable
        # Token không còn hợp lệ: caller phải thu hồi thiết bị.
        self.unregistered = unregistered


@dataclass(frozen=True)
class PushMessage:
    token: str
    title: str
    body: str
    # FCM chỉ nhận chuỗi trong `data`.
    data: dict[str, str] = field(default_factory=dict)


# ── Provider giả lập ─────────────────────────────────────────────────────────
fake_outbox: list[PushMessage] = []
# token -> lỗi sẽ ném khi gửi tới token đó (để test UNREGISTERED / lỗi tạm).
fake_failures: dict[str, PushDeliveryError] = {}


def reset_fake() -> None:
    fake_outbox.clear()
    fake_failures.clear()


# ── Provider FCM ─────────────────────────────────────────────────────────────
_token_cache: dict[str, float | str] = {"value": "", "expires_at": 0.0}


def _service_account() -> dict:
    try:
        account = json.loads(settings.FCM_SERVICE_ACCOUNT_JSON)
        if not isinstance(account, dict) or not account["client_email"] or not account["private_key"]:
            raise ValueError
    except (ValueError, KeyError, TypeError):
        raise PushDeliveryError("FCM service account is not configured") from None
    return account


async def _access_token(client: httpx.AsyncClient) -> str:
    now = time.time()
    if _token_cache["value"] and float(_token_cache["expires_at"]) - TOKEN_REFRESH_MARGIN_SECONDS > now:
        return str(_token_cache["value"])
    account = _service_account()
    token_uri = account.get("token_uri") or DEFAULT_TOKEN_URI
    try:
        assertion = jwt.encode(
            {
                "iss": account["client_email"],
                "scope": FCM_SCOPE,
                "aud": token_uri,
                "iat": int(now),
                "exp": int(now) + 3600,
            },
            account["private_key"],
            algorithm="RS256",
        )
    except Exception:
        raise PushDeliveryError("FCM service account key is invalid") from None
    try:
        response = await client.post(
            token_uri,
            data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion},
        )
    except httpx.HTTPError:
        raise PushDeliveryError("FCM authentication connection failed", retryable=True) from None
    if response.status_code != 200:
        # 5xx/429 là lỗi tạm; 4xx khác (khóa sai, bị vô hiệu) thì thử lại cũng vô ích.
        raise PushDeliveryError(
            "FCM authentication failed",
            retryable=response.status_code >= 500 or response.status_code == 429,
        )
    try:
        payload = response.json()
        _token_cache["value"] = payload["access_token"]
        _token_cache["expires_at"] = now + int(payload.get("expires_in", 3600))
    except (ValueError, KeyError, TypeError):
        raise PushDeliveryError("FCM authentication returned an invalid response") from None
    return str(_token_cache["value"])


def _error_status(response: httpx.Response) -> str:
    try:
        return str(response.json().get("error", {}).get("status", ""))
    except (ValueError, AttributeError):
        return ""


def _fcm_error_codes(response: httpx.Response) -> set[str]:
    codes: set[str] = set()
    try:
        for detail in response.json().get("error", {}).get("details", []):
            if isinstance(detail, dict) and "errorCode" in detail:
                codes.add(str(detail["errorCode"]))
    except (ValueError, AttributeError):
        pass
    return codes


async def _send_fcm(message: PushMessage) -> None:
    if not settings.FCM_PROJECT_ID:
        raise PushDeliveryError("FCM project is not configured")
    body = {
        "message": {
            "token": message.token,
            "notification": {"title": message.title, "body": message.body},
            "data": message.data,
            "android": {"priority": "HIGH"},
        }
    }
    async with httpx.AsyncClient(timeout=settings.PUSH_HTTP_TIMEOUT_SECONDS) as client:
        access_token = await _access_token(client)
        try:
            response = await client.post(
                FCM_SEND_URL.format(project_id=settings.FCM_PROJECT_ID),
                headers={"Authorization": f"Bearer {access_token}"},
                json=body,
                follow_redirects=False,
            )
        except httpx.HTTPError:
            raise PushDeliveryError("FCM connection failed", retryable=True) from None
    if response.status_code == 200:
        return
    status = _error_status(response)
    codes = _fcm_error_codes(response)
    if response.status_code == 404 or status == "NOT_FOUND" or "UNREGISTERED" in codes:
        raise PushDeliveryError("FCM token is no longer registered", unregistered=True)
    if response.status_code == 403 or "SENDER_ID_MISMATCH" in codes:
        # Token thuộc dự án Firebase khác: không bao giờ gửi được từ đây.
        raise PushDeliveryError("FCM token belongs to another sender", unregistered=True)
    if response.status_code == 401:
        _token_cache["value"] = ""  # token OAuth có thể đã bị thu hồi; lấy lại ở lần thử sau.
        raise PushDeliveryError("FCM rejected the access token", retryable=True)
    if response.status_code == 429 or response.status_code >= 500:
        raise PushDeliveryError("FCM temporarily unavailable", retryable=True)
    raise PushDeliveryError("FCM rejected the message")


async def send_push(message: PushMessage) -> None:
    """Gửi một push tới một thiết bị. Ném `PushDeliveryError` khi thất bại."""
    provider = settings.PUSH_PROVIDER
    if provider == "fake":
        # Cấu hình production đã từ chối `fake` ngay lúc khởi động (xem config.py).
        failure = fake_failures.get(message.token)
        if failure is not None:
            raise failure
        fake_outbox.append(message)
        return
    if provider == "fcm":
        await _send_fcm(message)
        return
    raise PushDeliveryError("Push provider is not configured")

