from urllib.parse import urlencode

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.core.oauth_exchange import issue as issue_exchange_code
from app.core.oauth_state_store import (
    STATE_COOKIE_NAME,
    state_cookie_kwargs,
    state_cookie_path,
)
from app.core.rate_limit import OAUTH_CALLBACK_LIMIT, OAUTH_START_LIMIT, limiter
from app.services.oauth_service import OAuthServiceDep

router = APIRouter()


@router.get("/providers", response_model=dict)
async def get_oauth_providers():
    return {
        "google": bool(settings.GOOGLE_CLIENT_ID),
        "facebook": bool(settings.FACEBOOK_APP_ID),
    }


async def _start(provider: str, oauth_service: OAuthServiceDep) -> RedirectResponse:
    state, browser_secret, challenge = await oauth_service.start_flow(provider)
    response = RedirectResponse(
        url=oauth_service.get_authorization_url(provider, state, challenge),
        status_code=307,
    )
    response.set_cookie(STATE_COOKIE_NAME, browser_secret, **state_cookie_kwargs())
    return response


# Callback thực hiện hai lời gọi HTTP ra ngoài tới provider; nếu không giới hạn,
# một kẻ chưa xác thực có thể ép server tạo request outbound không giới hạn và
# làm cạn connection pool.
@router.get("/google/login")
@limiter.limit(OAUTH_START_LIMIT)
async def google_login(request: Request, oauth_service: OAuthServiceDep):
    return await _start("google", oauth_service)


@router.get("/facebook/login")
@limiter.limit(OAUTH_START_LIMIT)
async def facebook_login(request: Request, oauth_service: OAuthServiceDep):
    return await _start("facebook", oauth_service)


async def _handle_callback(
    provider: str,
    oauth_service: OAuthServiceDep,
    code: str | None,
    state: str | None,
    error: str | None,
    browser_secret: str | None,
) -> RedirectResponse:
    mode = "login"
    try:
        if not state:
            raise BadRequestException("Missing OAuth state parameter")
        parsed_state, verifier = await oauth_service.consume_flow(
            state, browser_secret, provider
        )
        mode = parsed_state.mode
        if error or not code:
            # `error` do provider (và qua đó, do kẻ tấn công) kiểm soát. Nó KHÔNG
            # được phản chiếu vào URL của SPA — làm vậy là biến callback thành một
            # kênh chèn văn bản tuỳ ý vào giao diện của chính mình.
            raise BadRequestException("OAuth provider did not return a code")

        _, tokens = await oauth_service.complete_oauth(
            provider, code, parsed_state, verifier
        )
        if mode == "link":
            query = urlencode({"linked": provider})
            return _finish(f"/profile?{query}")
        if tokens is None:
            raise BadRequestException("OAuth login did not return tokens")
        # Redirect chỉ mang theo một mã dùng một lần, không bao giờ mang chính các token —
        # xem app/core/oauth_exchange.py để biết lý do.
        try:
            code = await issue_exchange_code(tokens.access_token, tokens.refresh_token)
        except Exception as exc:
            raise BadRequestException(
                "Sign-in is temporarily unavailable. Please try again."
            ) from exc
        query = urlencode({"code": code})
        return _finish(f"/oauth-callback?{query}")
    except HTTPException as exc:
        message = str(exc.detail)
    except Exception:
        message = "OAuth request failed. Please try again."

    target = "profile" if mode == "link" else "oauth-callback"
    query = urlencode({"error": message})
    return _finish(f"/{target}?{query}")


def _finish(path: str) -> RedirectResponse:
    """Chuyển hướng về SPA và dọn cookie state — luồng đã kết thúc dù thành hay bại."""
    response = RedirectResponse(
        url=f"{settings.FRONTEND_URL.rstrip('/')}{path}",
        status_code=307,
    )
    response.delete_cookie(STATE_COOKIE_NAME, path=state_cookie_path())
    return response


@router.get("/google/callback")
@limiter.limit(OAUTH_CALLBACK_LIMIT)
async def google_callback(
    request: Request,
    oauth_service: OAuthServiceDep,
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
):
    return await _handle_callback(
        "google", oauth_service, code, state, error, request.cookies.get(STATE_COOKIE_NAME)
    )


@router.get("/facebook/callback")
@limiter.limit(OAUTH_CALLBACK_LIMIT)
async def facebook_callback(
    request: Request,
    oauth_service: OAuthServiceDep,
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
):
    return await _handle_callback(
        "facebook", oauth_service, code, state, error, request.cookies.get(STATE_COOKIE_NAME)
    )
