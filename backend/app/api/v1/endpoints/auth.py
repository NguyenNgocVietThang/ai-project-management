from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.dependencies import CurrentUser
from app.schemas.auth import (
    ForgotPasswordRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.schemas.common import MessageResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthServiceDep

router = APIRouter()

FORGOT_PASSWORD_MESSAGE = "If the email exists, a reset link has been sent"
EMAIL_VERIFIED_MESSAGE = "Email verified successfully"
VERIFICATION_SENT_MESSAGE = "Verification email sent"
ALREADY_VERIFIED_MESSAGE = "Email is already verified"


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, auth_service: AuthServiceDep):
    """Register a new user account."""
    user = await auth_service.register(body)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: AuthServiceDep,
):
    """Login with email and password, returns JWT tokens."""
    user = await auth_service.authenticate(form_data.username, form_data.password)
    return auth_service.issue_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest, auth_service: AuthServiceDep):
    """Refresh access token using refresh token."""
    return await auth_service.refresh(body.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout - client should discard tokens."""
    return MessageResponse(message="Logged out successfully")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(body: ForgotPasswordRequest, auth_service: AuthServiceDep):
    """Queue a password reset email while preventing email enumeration."""
    await auth_service.request_password_reset(body.email)
    return MessageResponse(message=FORGOT_PASSWORD_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(body: ResetPasswordRequest, auth_service: AuthServiceDep):
    """Consume a valid one-time token and set a new local password."""
    await auth_service.reset_password(body)
    return MessageResponse(message="Password reset successful")


@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(
    auth_service: AuthServiceDep,
    token: str | None = Query(default=None),
):
    """Consume a valid one-time email-verification token."""
    await auth_service.verify_email(token)
    return MessageResponse(message=EMAIL_VERIFIED_MESSAGE)


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(current_user: CurrentUser, auth_service: AuthServiceDep):
    """Queue a fresh verification email for the authenticated user."""
    sent = await auth_service.resend_email_verification(current_user.id)
    message = VERIFICATION_SENT_MESSAGE if sent else ALREADY_VERIFIED_MESSAGE
    return MessageResponse(message=message)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUser):
    """Get the currently authenticated user's profile."""
    return current_user
