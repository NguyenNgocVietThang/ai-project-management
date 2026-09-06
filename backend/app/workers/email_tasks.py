import asyncio
import logging

from app.utils.email import (
    send_email_verification_email,
    send_password_reset_email,
    send_project_invitation_email,
)
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


# Hai task truoc day o day - emails.send_notification va emails.send_welcome - la
# stub tra ve {"status": "sent"} ma khong gui gi ca. Khong noi nao goi chung, nen
# chung chi la bay: bat ky ai noi day vao mot luong deu nhan mot xac nhan gia.
# Chung da duoc go bo. Thong bao trong ung dung di qua NotificationService; email
# giao dich thi dung cac task ben duoi, deu la that va deu co retry.


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
    """Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn."""
    try:
        asyncio.run(send_password_reset_email(to_email, reset_link))
    except Exception:
        # Không log người nhận hay reset link vì cả hai đều chứa dữ liệu nhạy cảm.
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
    """Gửi thông điệp xác minh email với số lần retry exponential có giới hạn."""
    try:
        asyncio.run(send_email_verification_email(to_email, verification_link))
    except Exception:
        # Địa chỉ và link là dữ liệu nhạy cảm; task ID là đủ để đối chiếu.
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
