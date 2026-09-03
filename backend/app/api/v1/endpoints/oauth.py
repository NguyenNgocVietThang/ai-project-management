from typing import Optional
from urllib.parse import urlencode

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.core.oauth_exchange import issue as issue_exchange_code
from app.services.oauth_service import OAuthServiceDep

router = APIRouter()


@router.get("/providers", response_model=dict)
async def get_oauth_providers():
    return {
        "google": bool(settings.GOOGLE_CLIENT_ID),
        "facebook": bool(settings.FACEBOOK_APP_ID),
    }


@router.get("/google/login")
async def google_login(oauth_service: OAuthServiceDep):
    state = oauth_service.generate_state("google")
    return RedirectResponse(
        url=oauth_service.get_google_auth_url(state),
        status_code=307,
    )


@router.get("/facebook/login")
async def facebook_login(oauth_service: OAuthServiceDep):
    state = oauth_service.generate_state("facebook")
    return RedirectResponse(
        url=oauth_service.get_facebook_auth_url(state),
        status_code=307,
    )


async def _handle_callback(
    provider: str,
    oauth_service: OAuthServiceDep,
    code: Optional[str],
    state: Optional[str],
    error: Optional[str],
) -> RedirectResponse:
    mode = "login"
    try:
        if not state:
            raise BadRequestException("Missing OAuth state parameter")
        parsed_state = oauth_service.parse_state(state, provider)
        mode = parsed_state.mode
        if error or not code:
            raise BadRequestException(error or "OAuth provider did not return a code")

        _, tokens = await oauth_service.complete_oauth(provider, code, parsed_state)
        if mode == "link":
            query = urlencode({"linked": provider})
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL.rstrip('/')}/profile?{query}",
                status_code=307,
            )
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
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL.rstrip('/')}/oauth-callback?{query}",
            status_code=307,
        )
    except HTTPException as exc:
        message = str(exc.detail)
    except Exception:
        message = "OAuth request failed. Please try again."

    target = "profile" if mode == "link" else "oauth-callback"
    query = urlencode({"error": message})
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL.rstrip('/')}/{target}?{query}",
        status_code=307,
    )


@router.get("/google/callback")
async def google_callback(
    oauth_service: OAuthServiceDep,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
):
    return await _handle_callback("google", oauth_service, code, state, error)


@router.get("/facebook/callback")
async def facebook_callback(
    oauth_service: OAuthServiceDep,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
):
    return await _handle_callback("facebook", oauth_service, code, state, error)
