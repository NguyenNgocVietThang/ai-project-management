from app.workers.celery_app import celery_app


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
