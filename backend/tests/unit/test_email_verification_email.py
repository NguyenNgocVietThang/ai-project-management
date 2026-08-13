from unittest.mock import AsyncMock, patch

import pytest

from app.utils.email import send_email_verification_email
from app.workers.email_tasks import send_email_verification_task


@pytest.mark.asyncio
async def test_verification_email_uses_html_template_and_link():
    mailer = AsyncMock()

    with (
        patch("app.utils.email._mail_config", return_value=object()),
        patch("app.utils.email.FastMail", return_value=mailer),
    ):
        await send_email_verification_email(
            "person@example.com",
            "http://localhost:3000/verify-email?token=test-token",
        )

    message = mailer.send_message.await_args.args[0]
    assert message.template_body["verification_link"].endswith("token=test-token")
    assert message.template_body["expires_hours"] == 24
    assert mailer.send_message.await_args.kwargs["template_name"] == "verify_email.html"


def test_verification_task_has_bounded_retry_configuration():
    assert send_email_verification_task.max_retries == 3
    assert send_email_verification_task.autoretry_for == (Exception,)
    assert send_email_verification_task.retry_backoff == 2
