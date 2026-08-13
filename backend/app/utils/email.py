from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import settings

EMAIL_TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "templates" / "email"


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


async def send_password_reset_email(to_email: str, reset_link: str) -> None:
    message = MessageSchema(
        subject="Reset your AI Project Management password",
        recipients=[to_email],
        template_body={
            "reset_link": reset_link,
            "expires_hours": 1,
        },
        subtype=MessageType.html,
    )
    await FastMail(_mail_config()).send_message(
        message,
        template_name="reset_password.html",
    )


async def send_email_verification_email(to_email: str, verification_link: str) -> None:
    message = MessageSchema(
        subject="Verify your AI Project Management email",
        recipients=[to_email],
        template_body={
            "verification_link": verification_link,
            "expires_hours": 24,
        },
        subtype=MessageType.html,
    )
    await FastMail(_mail_config()).send_message(
        message,
        template_name="verify_email.html",
    )


async def send_project_invitation_email(
    to_email: str,
    inviter_name: str,
    project_name: str,
    role_name: str,
    project_link: str,
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
    await FastMail(_mail_config()).send_message(
        message,
        template_name="project_invitation.html",
    )
