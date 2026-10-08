import hashlib
import json
from pathlib import Path

import httpx
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

from app.core.config import settings

EMAIL_TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "templates" / "email"
_templates = Environment(
    loader=FileSystemLoader(EMAIL_TEMPLATE_DIR),
    autoescape=select_autoescape(["html"]),
    undefined=StrictUndefined,
)


class EmailDeliveryError(RuntimeError):
    """Safe to persist in job failures; excludes provider response bodies."""

    def __init__(self, message: str, *, retryable: bool = False):
        super().__init__(message)
        self.retryable = retryable


async def _send(message: MessageSchema, template_name: str, idempotency_key: str | None) -> None:
    provider = settings.EMAIL_PROVIDER
    if provider == "smtp":
        if settings.APP_ENV != "development":
            raise EmailDeliveryError("SMTP is supported only in development")
        try:
            await FastMail(_mail_config()).send_message(message, template_name=template_name)
        except Exception:
            raise EmailDeliveryError("SMTP email delivery failed", retryable=True) from None
        return
    if provider != "resend":
        raise EmailDeliveryError("Unsupported email provider configuration")
    if (
        not settings.RESEND_API_KEY
        or not settings.EMAIL_FROM
        or settings.EMAIL_FROM.endswith("@projectmanagement.com")
    ):
        raise EmailDeliveryError("Resend sender/API key configuration is required")
    payload = {
        "from": f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>",
        "to": [str(recipient) for recipient in message.recipients],
        "subject": message.subject,
        "html": _templates.get_template(template_name).render(**message.template_body),
    }
    # Legacy callers have no outbox ID. Durable jobs should supply a stable ID
    # for each delivery; the fallback digest contains no readable personal data.
    key = (
        idempotency_key
        if idempotency_key is not None
        else "email-"
        + hashlib.sha256(
            json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()
        ).hexdigest()
    )
    if (
        not key
        or len(key) > 256
        or not key.isascii()
        or any(ord(char) < 33 or ord(char) > 126 for char in key)
    ):
        raise EmailDeliveryError("Invalid email idempotency key")
    try:
        async with httpx.AsyncClient(timeout=settings.EMAIL_HTTP_TIMEOUT_SECONDS) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Idempotency-Key": key,
                },
                json=payload,
                follow_redirects=False,
            )
    except httpx.HTTPError:
        raise EmailDeliveryError("Resend connection failed", retryable=True) from None
    if not response.is_success:
        retryable = response.status_code in {408, 429} or response.status_code >= 500
        if response.status_code == 409:
            try:
                retryable = response.json().get("name") == "concurrent_idempotent_requests"
            except (ValueError, AttributeError):
                pass
        raise EmailDeliveryError(
            f"Resend delivery failed (HTTP {response.status_code})",
            retryable=retryable,
        )
    try:
        accepted = response.json()
        valid = (
            isinstance(accepted, dict)
            and isinstance(accepted.get("id"), str)
            and bool(accepted["id"])
        )
    except ValueError:
        valid = False
    if not valid:
        raise EmailDeliveryError(
            "Resend returned an invalid delivery acknowledgement", retryable=True
        )


def _mail_config() -> ConnectionConfig:
    return ConnectionConfig(
        MAIL_USERNAME=settings.SMTP_USER,
        MAIL_PASSWORD=settings.SMTP_PASSWORD,
        MAIL_FROM=settings.EMAIL_FROM,
        MAIL_PORT=settings.SMTP_PORT,
        MAIL_SERVER=settings.SMTP_HOST,
        MAIL_FROM_NAME=settings.EMAIL_FROM_NAME,
        MAIL_STARTTLS=settings.SMTP_STARTTLS,
        MAIL_SSL_TLS=settings.SMTP_SSL_TLS,
        USE_CREDENTIALS=settings.SMTP_USE_CREDENTIALS,
        VALIDATE_CERTS=settings.SMTP_VALIDATE_CERTS,
        TEMPLATE_FOLDER=EMAIL_TEMPLATE_DIR,
    )


async def send_password_reset_email(
    to_email: str, reset_link: str, *, idempotency_key: str | None = None
) -> None:
    message = MessageSchema(
        subject="Reset your AI Project Management password",
        recipients=[to_email],
        template_body={
            "reset_link": reset_link,
            "expires_hours": 1,
        },
        subtype=MessageType.html,
    )
    await _send(message, "reset_password.html", idempotency_key)


async def send_email_verification_email(
    to_email: str, verification_link: str, *, idempotency_key: str | None = None
) -> None:
    message = MessageSchema(
        subject="Verify your AI Project Management email",
        recipients=[to_email],
        template_body={
            "verification_link": verification_link,
            "expires_hours": 24,
        },
        subtype=MessageType.html,
    )
    await _send(message, "verify_email.html", idempotency_key)


async def send_project_invitation_email(
    to_email: str,
    inviter_name: str,
    project_name: str,
    role_name: str,
    project_link: str,
    *,
    idempotency_key: str | None = None,
) -> None:
    message = MessageSchema(
        subject=f"You were added to {project_name}",
        recipients=[to_email],
        template_body={
            "inviter_name": inviter_name,
            "project_name": project_name,
            "role_name": role_name,
            "project_link": project_link,
        },
        subtype=MessageType.html,
    )
    await _send(message, "project_invitation.html", idempotency_key)
