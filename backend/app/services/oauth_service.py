import hashlib
import hmac
import secrets
import time
from dataclasses import dataclass
from typing import Annotated, Any, Dict, Optional, Tuple
from urllib.parse import urlencode

import httpx
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    UnauthorizedException,
)
from app.core.security import create_access_token, create_refresh_token
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenResponse

SUPPORTED_PROVIDERS = {"google", "facebook"}
STATE_MAX_AGE_SECONDS = 15 * 60


@dataclass(frozen=True)
class OAuthState:
    provider: str
    mode: str
    user_id: Optional[int]


class OAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.users = UserRepository(db)

    def generate_state(
        self,
        provider: str,
        *,
        mode: str = "login",
        user_id: Optional[int] = None,
    ) -> str:
        if provider not in SUPPORTED_PROVIDERS or mode not in {"login", "link"}:
            raise BadRequestException("Unsupported OAuth request")
        if mode == "link" and user_id is None:
            raise BadRequestException("A user is required to link an OAuth account")

        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(8)
        encoded_user_id = str(user_id) if user_id is not None else ""
        raw = f"{provider}:{mode}:{encoded_user_id}:{timestamp}:{nonce}"
        signature = hmac.new(
            settings.SECRET_KEY.encode(),
            raw.encode(),
            hashlib.sha256,
        ).hexdigest()
        return f"{raw}:{signature}"

    def parse_state(self, state: str, expected_provider: str) -> OAuthState:
        parts = state.split(":")
        if len(parts) != 6:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        provider, mode, encoded_user_id, timestamp_text, nonce, signature = parts
        if provider != expected_provider or provider not in SUPPORTED_PROVIDERS:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        if mode not in {"login", "link"}:
            raise BadRequestException("Invalid or expired OAuth state parameter")

        try:
            timestamp = int(timestamp_text)
        except ValueError as exc:
            raise BadRequestException("Invalid or expired OAuth state parameter") from exc
        now = time.time()
        if timestamp > now + 30 or now - timestamp > STATE_MAX_AGE_SECONDS:
            raise BadRequestException("Invalid or expired OAuth state parameter")

        raw = f"{provider}:{mode}:{encoded_user_id}:{timestamp_text}:{nonce}"
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode(),
            raw.encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            raise BadRequestException("Invalid or expired OAuth state parameter")

        user_id: Optional[int] = None
        if encoded_user_id:
            try:
                user_id = int(encoded_user_id)
            except ValueError as exc:
                raise BadRequestException("Invalid or expired OAuth state parameter") from exc
        if mode == "link" and user_id is None:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        return OAuthState(provider=provider, mode=mode, user_id=user_id)

    def verify_state(self, state: str, expected_provider: str) -> bool:
        try:
            self.parse_state(state, expected_provider)
            return True
        except BadRequestException:
            return False

    def get_authorization_url(self, provider: str, state: str) -> str:
        if provider == "google":
            return self.get_google_auth_url(state)
        if provider == "facebook":
            return self.get_facebook_auth_url(state)
        raise BadRequestException("Unsupported OAuth provider")

    def get_google_auth_url(self, state: str) -> str:
        if not settings.GOOGLE_CLIENT_ID:
            raise BadRequestException("Google OAuth Client ID is not configured on the server")
        query = urlencode(
            {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "response_type": "code",
                "scope": "openid email profile",
                "state": state,
                "access_type": "offline",
                "prompt": "select_account",
            }
        )
        return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"

    async def fetch_google_user(self, code: str) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
            if token_response.status_code != 200:
                raise UnauthorizedException("Failed to exchange authorization code with Google")

            access_token = token_response.json().get("access_token")
            if not access_token:
                raise UnauthorizedException("No access token returned from Google")

            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_response.status_code != 200:
                raise UnauthorizedException("Failed to fetch user profile from Google")

            profile = user_response.json()
            provider_id = profile.get("id")
            if not provider_id:
                raise UnauthorizedException("Google did not return a user identifier")
            return {
                "id": provider_id,
                "email": profile.get("email"),
                "full_name": profile.get("name") or profile.get("email", "").split("@")[0],
                "avatar_url": profile.get("picture"),
            }

    def get_facebook_auth_url(self, state: str) -> str:
        if not settings.FACEBOOK_APP_ID:
            raise BadRequestException("Facebook OAuth App ID is not configured on the server")
        query = urlencode(
            {
                "client_id": settings.FACEBOOK_APP_ID,
                "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
                "state": state,
                "scope": "email,public_profile",
            }
        )
        return f"https://www.facebook.com/v19.0/dialog/oauth?{query}"

    async def fetch_facebook_user(self, code: str) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_response = await client.get(
                "https://graph.facebook.com/v19.0/oauth/access_token",
                params={
                    "client_id": settings.FACEBOOK_APP_ID,
                    "client_secret": settings.FACEBOOK_APP_SECRET,
                    "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
                    "code": code,
                },
            )
            if token_response.status_code != 200:
                raise UnauthorizedException("Failed to exchange authorization code with Facebook")

            access_token = token_response.json().get("access_token")
            if not access_token:
                raise UnauthorizedException("No access token returned from Facebook")

            user_response = await client.get(
                "https://graph.facebook.com/v19.0/me",
                params={
                    "fields": "id,name,email,picture.type(large)",
                    "access_token": access_token,
                },
            )
            if user_response.status_code != 200:
                raise UnauthorizedException("Failed to fetch user profile from Facebook")

            profile = user_response.json()
            provider_id = profile.get("id")
            if not provider_id:
                raise UnauthorizedException("Facebook did not return a user identifier")
            picture = profile.get("picture", {}).get("data", {}).get("url")
            return {
                "id": provider_id,
                "email": profile.get("email"),
                "full_name": profile.get("name") or "Facebook User",
                "avatar_url": picture,
            }

    async def fetch_provider_user(self, provider: str, code: str) -> Dict[str, Any]:
        if provider == "google":
            return await self.fetch_google_user(code)
        if provider == "facebook":
            return await self.fetch_facebook_user(code)
        raise BadRequestException("Unsupported OAuth provider")

    async def _get_or_create_social_user(
        self,
        email: Optional[str],
        full_name: str,
        avatar_url: Optional[str],
        provider: str,
        provider_id: str,
    ) -> User:
        user = (
            await self.users.get_by_google_id(provider_id)
            if provider == "google"
            else await self.users.get_by_facebook_id(provider_id)
        )
        if user:
            if user.is_active is False:
                raise UnauthorizedException("Account is inactive")
            if avatar_url and not user.avatar_url:
                user.avatar_url = avatar_url
            user.email_verified = True
            user.email_verification_token_hash = None
            user.email_verification_expires_at = None
            await self.db.flush()
            return user

        if email:
            user = await self.users.get_by_email(email)
            if user:
                if user.is_active is False:
                    raise UnauthorizedException("Account is inactive")
                if provider == "google":
                    user.google_id = provider_id
                else:
                    user.facebook_id = provider_id
                if avatar_url and not user.avatar_url:
                    user.avatar_url = avatar_url
                user.email_verified = True
                user.email_verification_token_hash = None
                user.email_verification_expires_at = None
                await self.db.flush()
                return user

        base_username = (email.split("@")[0] if email else f"{provider}_{provider_id[:8]}").lower()
        base_username = "".join(
            character if character.isalnum() or character == "_" else "_"
            for character in base_username
        )
        base_username = (base_username or provider).ljust(3, "_")[:50]
        username = base_username
        counter = 1
        while await self.users.get_by_username(username):
            suffix = f"_{counter}"
            username = f"{base_username[: 50 - len(suffix)]}{suffix}"
            counter += 1

        effective_email = email or f"{provider}_{provider_id}@social.user"
        return await self.users.create(
            User(
                email=effective_email,
                username=username,
                full_name=full_name,
                hashed_password=None,
                avatar_url=avatar_url,
                auth_provider=provider,
                google_id=provider_id if provider == "google" else None,
                facebook_id=provider_id if provider == "facebook" else None,
                is_active=True,
                email_verified=True,
            )
        )

    async def link_social_account(
        self,
        state: OAuthState,
        user_info: Dict[str, Any],
    ) -> User:
        if state.mode != "link" or state.user_id is None:
            raise BadRequestException("Invalid OAuth account-link request")
        user = await self.users.get_by_id_for_update(state.user_id)
        if user is None or not user.is_active:
            raise UnauthorizedException("Account is inactive")

        provider_id = user_info["id"]
        existing = (
            await self.users.get_by_google_id(provider_id)
            if state.provider == "google"
            else await self.users.get_by_facebook_id(provider_id)
        )
        if existing and existing.id != user.id:
            raise ConflictException("This social account is already linked to another user")

        if state.provider == "google":
            user.google_id = provider_id
        else:
            user.facebook_id = provider_id
        if user_info.get("avatar_url") and not user.avatar_url:
            user.avatar_url = user_info["avatar_url"]
        if user_info.get("email") == user.email:
            user.email_verified = True
            user.email_verification_token_hash = None
            user.email_verification_expires_at = None
        await self.db.flush()
        await self.db.refresh(user)
        self.db.add(
            AuditLog(
                user_id=user.id,
                action="CONNECT_OAUTH",
                entity_type="User",
                entity_id=user.id,
                new_values={"provider": state.provider},
            )
        )
        return user

    def issue_tokens(self, user: User) -> TokenResponse:
        token_data = {"sub": str(user.id), "ver": user.auth_version or 0}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )

    async def complete_oauth(
        self,
        provider: str,
        code: str,
        state: OAuthState,
    ) -> Tuple[User, Optional[TokenResponse]]:
        user_info = await self.fetch_provider_user(provider, code)
        if state.mode == "link":
            return await self.link_social_account(state, user_info), None

        user = await self._get_or_create_social_user(
            email=user_info.get("email"),
            full_name=user_info["full_name"],
            avatar_url=user_info.get("avatar_url"),
            provider=provider,
            provider_id=user_info["id"],
        )
        return user, self.issue_tokens(user)

    async def authenticate_social_user(
        self,
        provider: str,
        code: str,
        state: str,
    ) -> Tuple[User, TokenResponse]:
        parsed_state = self.parse_state(state, provider)
        if parsed_state.mode != "login":
            raise BadRequestException("Invalid OAuth login request")
        user, tokens = await self.complete_oauth(provider, code, parsed_state)
        if tokens is None:
            raise BadRequestException("Invalid OAuth login request")
        return user, tokens


async def get_oauth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> OAuthService:
    return OAuthService(db)


OAuthServiceDep = Annotated[OAuthService, Depends(get_oauth_service)]
