from dataclasses import dataclass
from typing import Annotated, Any
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
from app.core.oauth_state_store import (
    code_challenge_for,
    new_code_verifier,
)
from app.core.oauth_state_store import (
    consume as consume_state,
)
from app.core.oauth_state_store import (
    issue as issue_state,
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
    user_id: int | None


class OAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.users = UserRepository(db)

    async def start_flow(
        self,
        provider: str,
        *,
        mode: str = "login",
        user_id: int | None = None,
    ) -> tuple[str, str, str | None]:
        """Bắt đầu một luồng OAuth.

        Trả về `(state, browser_secret, code_challenge)`. `state` đi trên URL tới
        provider; `browser_secret` phải được đặt vào cookie httpOnly và được trình
        ra ở callback; `code_challenge` là phần PKCE (chỉ Google, provider kia
        không hỗ trợ).
        """
        if provider not in SUPPORTED_PROVIDERS or mode not in {"login", "link"}:
            raise BadRequestException("Unsupported OAuth request")
        if mode == "link" and user_id is None:
            raise BadRequestException("A user is required to link an OAuth account")

        verifier = new_code_verifier() if provider == "google" else None
        try:
            state, browser_secret = await issue_state(
                {
                    "provider": provider,
                    "mode": mode,
                    "user_id": user_id,
                    "code_verifier": verifier,
                }
            )
        except Exception as exc:
            # Fail closed: không có store thì không có chống CSRF, và một luồng
            # đăng nhập không được bảo vệ còn tệ hơn là không đăng nhập được.
            raise BadRequestException(
                "Sign-in is temporarily unavailable. Please try again."
            ) from exc
        return state, browser_secret, code_challenge_for(verifier) if verifier else None

    async def consume_flow(
        self, state: str, browser_secret: str | None, expected_provider: str
    ) -> tuple[OAuthState, str | None]:
        """Đổi `state` lấy luồng mà nó đại diện, đúng một lần.

        Trả về `(OAuthState, code_verifier)`. Ném lỗi khi state không xác định, đã
        hết hạn, đã được dùng, thuộc provider khác, hoặc quay lại từ một trình duyệt
        không phải nơi đã khởi tạo luồng.
        """
        try:
            payload = await consume_state(state, browser_secret)
        except Exception as exc:
            raise BadRequestException(
                "Sign-in is temporarily unavailable. Please try again."
            ) from exc
        if payload is None:
            raise BadRequestException("Invalid or expired OAuth state parameter")

        provider = payload.get("provider")
        mode = payload.get("mode")
        user_id = payload.get("user_id")
        if provider != expected_provider or provider not in SUPPORTED_PROVIDERS:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        if mode not in {"login", "link"}:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        if mode == "link" and user_id is None:
            raise BadRequestException("Invalid or expired OAuth state parameter")
        return (
            OAuthState(provider=provider, mode=mode, user_id=user_id),
            payload.get("code_verifier"),
        )

    def get_authorization_url(
        self, provider: str, state: str, code_challenge: str | None = None
    ) -> str:
        if provider == "google":
            return self.get_google_auth_url(state, code_challenge)
        if provider == "facebook":
            return self.get_facebook_auth_url(state)
        raise BadRequestException("Unsupported OAuth provider")

    def get_google_auth_url(self, state: str, code_challenge: str | None = None) -> str:
        if not settings.GOOGLE_CLIENT_ID:
            raise BadRequestException("Google OAuth Client ID is not configured on the server")
        parameters = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        }
        if code_challenge:
            # PKCE: authorization code bị chặn lại sẽ vô dụng nếu không có verifier,
            # thứ không bao giờ rời khỏi server.
            parameters["code_challenge"] = code_challenge
            parameters["code_challenge_method"] = "S256"
        return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(parameters)}"

    async def fetch_google_user(
        self, code: str, code_verifier: str | None = None
    ) -> dict[str, Any]:
        payload = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        if code_verifier:
            payload["code_verifier"] = code_verifier
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data=payload,
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
                # Google trả về cờ này trong mọi response của userinfo. Nếu không đọc
                # nó thì một identity mang email của người khác vẫn được gộp thẳng vào
                # tài khoản local đang tồn tại — xem _get_or_create_social_user.
                "email_verified": bool(profile.get("verified_email")),
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

    async def fetch_facebook_user(self, code: str) -> dict[str, Any]:
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
                # Graph API không công bố trạng thái xác minh email dưới bất kỳ hình
                # thức nào, nên ở đây không có gì để khẳng định. Không suy đoán: người
                # dùng vẫn đăng nhập được, chỉ là không tự động gộp vào một tài khoản
                # local có sẵn (họ có thể liên kết từ trang hồ sơ, nơi danh tính đã
                # được chứng minh bằng phiên đăng nhập).
                "email_verified": False,
                "full_name": profile.get("name") or "Facebook User",
                "avatar_url": picture,
            }

    async def fetch_provider_user(
        self, provider: str, code: str, code_verifier: str | None = None
    ) -> dict[str, Any]:
        if provider == "google":
            return await self.fetch_google_user(code, code_verifier)
        if provider == "facebook":
            return await self.fetch_facebook_user(code)
        raise BadRequestException("Unsupported OAuth provider")

    async def _get_or_create_social_user(
        self,
        email: str | None,
        full_name: str,
        avatar_url: str | None,
        provider: str,
        provider_id: str,
        email_provider_verified: bool,
    ) -> User:
        """Phân giải identity của provider thành một User.

        `email_provider_verified` là khẳng định của provider rằng họ đã kiểm chứng
        quyền sở hữu địa chỉ email này. Nó quyết định việc có được phép gộp identity
        vào một tài khoản local có sẵn hay không: nếu chỉ tin vào chuỗi email, bất kỳ
        ai tạo được một identity mang email của nạn nhân đều chiếm được tài khoản đó
        (kể cả tài khoản Admin) ngay ở lần đăng nhập đầu tiên.
        """
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
            # Chỉ nâng cờ đã-xác-minh khi provider thực sự khẳng định điều đó, và
            # khẳng định ấy nói về địa chỉ mà tài khoản đang giữ.
            if email_provider_verified and email and email == user.email:
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
                if not email_provider_verified:
                    # Vẫn còn một đường an toàn để đi: đăng nhập bằng mật khẩu rồi
                    # liên kết tài khoản mạng xã hội từ trang hồ sơ, ở đó quyền sở hữu
                    # tài khoản đã được chứng minh bằng phiên đăng nhập.
                    raise ConflictException(
                        "An account with this email already exists. Sign in with your "
                        "password and link this provider from your profile settings."
                    )
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

        # users.email là NOT NULL + UNIQUE, nên identity không có email vẫn cần một giá
        # trị. Nó được đánh dấu rõ ràng là chưa xác minh (khác với trước đây) để không
        # có logic nào phía sau tưởng rằng đã kiểm chứng được địa chỉ này.
        effective_email = email or f"{provider}_{provider_id}@social.invalid"
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
                email_verified=bool(email) and email_provider_verified,
            )
        )

    async def link_social_account(
        self,
        state: OAuthState,
        user_info: dict[str, Any],
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
        if user_info.get("email") == user.email and user_info.get("email_verified"):
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
        code_verifier: str | None = None,
    ) -> tuple[User, TokenResponse | None]:
        user_info = await self.fetch_provider_user(provider, code, code_verifier)
        if state.mode == "link":
            return await self.link_social_account(state, user_info), None

        user = await self._get_or_create_social_user(
            email=user_info.get("email"),
            full_name=user_info["full_name"],
            avatar_url=user_info.get("avatar_url"),
            provider=provider,
            provider_id=user_info["id"],
            email_provider_verified=bool(user_info.get("email_verified")),
        )
        return user, self.issue_tokens(user)

    async def authenticate_social_user(
        self,
        provider: str,
        code: str,
        state: str,
        browser_secret: str | None = None,
    ) -> tuple[User, TokenResponse]:
        parsed_state, verifier = await self.consume_flow(state, browser_secret, provider)
        if parsed_state.mode != "login":
            raise BadRequestException("Invalid OAuth login request")
        user, tokens = await self.complete_oauth(provider, code, parsed_state, verifier)
        if tokens is None:
            raise BadRequestException("Invalid OAuth login request")
        return user, tokens


async def get_oauth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> OAuthService:
    return OAuthService(db)


OAuthServiceDep = Annotated[OAuthService, Depends(get_oauth_service)]
