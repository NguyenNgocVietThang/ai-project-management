"""Authentication for WebSocket endpoints.

Browsers cannot set custom headers on a WebSocket handshake, so the JWT
access token travels as a query parameter (`?token=...`) instead of the
`Authorization` header used by REST. This is acceptable here because the
frontend already keeps the access token client-readable (Zustand store +
a non-httpOnly `auth-token` cookie) — it is not upgrading exposure.
"""
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.models.user import User


class WSAuthError(Exception):
    """Raised when a WebSocket connection's token/user fails validation.
    Callers should catch this and close the socket with code 4401."""


async def authenticate_ws(token: str, db: AsyncSession) -> User:
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise WSAuthError("Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise WSAuthError("Invalid token payload")
    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise WSAuthError("Invalid token payload")

    from app.repositories.user_repository import UserRepository  # avoid circular imports

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id_int)
    if user is None:
        raise WSAuthError("User not found")
    if payload.get("ver", 0) != (user.auth_version or 0):
        raise WSAuthError("Token has been invalidated")
    if not user.is_active:
        raise WSAuthError("Inactive user")
    return user
