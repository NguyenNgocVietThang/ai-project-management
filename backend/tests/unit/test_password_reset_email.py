from unittest.mock import AsyncMock, patch

import pytest

from app.utils.email import send_password_reset_email
from app.workers.email_tasks import send_password_reset_email_task


@pytest.mark.asyncio
async def test_password_reset_email_uses_html_template_and_link():
    mailer = AsyncMock()

    with (
        patch("app.utils.email._mail_config", return_value=object()),
        patch("app.utils.email.FastMail", return_value=mailer),
    ):
        await send_password_reset_email(
            "person@example.com",
            "http://localhost:3000/reset-password?token=test-token",
        )

    message = mailer.send_message.await_args.args[0]
    assert message.template_body["reset_link"].endswith("token=test-token")
    assert message.template_body["expires_hours"] == 1
    assert mailer.send_message.await_args.kwargs["template_name"] == "reset_password.html"


def test_password_reset_task_has_bounded_retry_configuration():
    assert send_password_reset_email_task.max_retries == 3
    assert send_password_reset_email_task.autoretry_for == (Exception,)
    assert send_password_reset_email_task.retry_backoff == 2
