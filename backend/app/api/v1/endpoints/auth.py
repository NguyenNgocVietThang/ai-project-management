from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, verify_password
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse
from app.schemas.common import MessageResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Login with email and password, returns JWT tokens."""
    from app.repositories.user_repository import UserRepository
    repo = UserRepository(db)
    user = await repo.get_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    """Refresh access token using refresh token."""
    from app.core.security import decode_token
    payload = decode_token(body.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    access_token = create_access_token({"sub": payload["sub"]})
    new_refresh = create_refresh_token({"sub": payload["sub"]})
    return TokenResponse(access_token=access_token, refresh_token=new_refresh)


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout - client should discard tokens."""
    return MessageResponse(message="Logged out successfully")
