import asyncio
import logging

from app.utils.email import (
    send_email_verification_email,
    send_password_reset_email,
    send_project_invitation_email,
)
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="emails.send_notification")
def send_notification_email_task(to_email: str, subject: str, body: str):
    """Send notification email."""
    # TODO: Implement email sending with smtplib or FastMail
    return {"status": "sent"}


@celery_app.task(name="emails.send_welcome")
def send_welcome_email_task(to_email: str, username: str):
    """Send welcome email to new user."""
    # TODO: Implement welcome email
    return {"status": "sent"}


@celery_app.task(
    bind=True,
    name="emails.send_password_reset",
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def send_password_reset_email_task(self, to_email: str, reset_link: str):
    """Send a password-reset email with bounded exponential retries."""
    try:
        asyncio.run(send_password_reset_email(to_email, reset_link))
    except Exception:
        # Do not log the recipient or reset link because both contain sensitive data.
        logger.exception("Password reset email delivery failed for task_id=%s", self.request.id)
        raise
    return {"status": "sent"}


@celery_app.task(
    bind=True,
    name="emails.send_email_verification",
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def send_email_verification_task(self, to_email: str, verification_link: str):
    """Send an email-verification message with bounded exponential retries."""
    try:
        asyncio.run(send_email_verification_email(to_email, verification_link))
    except Exception:
        # The address and link are sensitive; task ID is enough for correlation.
        logger.exception("Email verification delivery failed for task_id=%s", self.request.id)
        raise
    return {"status": "sent"}


@celery_app.task(
    bind=True,
    name="emails.send_project_invitation",
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def send_project_invitation_email_task(
    self,
    to_email: str,
    inviter_name: str,
    project_name: str,
    role_name: str,
    project_link: str,
):
    try:
        asyncio.run(
            send_project_invitation_email(
                to_email,
                inviter_name,
                project_name,
                role_name,
                project_link,
            )
        )
    except Exception:
        logger.exception("Project invitation delivery failed for task_id=%s", self.request.id)
        raise
    return {"status": "sent"}
