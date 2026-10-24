"""Handlers for supported durable work. No Celery worker is required."""
import hashlib
from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit

from app.core.job_runner import JobResult, PermanentJobError, RetryableJobError
from app.models.user import User
from app.services.job_service import aware


async def run_cpm(ctx):
    async def apply(db, job):
        from sqlalchemy import func, select

        from app.core.config import settings
        from app.models.dependency import Dependency
        from app.models.task import Task
        project_id = job.payload["project_id"]
        # Task đã lưu trữ (rollback V3) không tham gia CPM nên không tính vào trần kích thước.
        active = (Task.project_id == project_id, Task.archived_at.is_(None))
        count = await db.scalar(select(func.count()).select_from(Task).where(*active))
        project_tasks = select(Task.id).where(*active)
        edges = await db.scalar(select(func.count()).select_from(Dependency).where(Dependency.predecessor_id.in_(project_tasks), Dependency.successor_id.in_(project_tasks)))
        if count > settings.CPM_MAX_TASKS or edges > settings.CPM_MAX_DEPENDENCIES:
            raise PermanentJobError("resource_limit_exceeded")
        from app.services.scheduling_service import recalculate_project
        await recalculate_project(db, project_id, force_sync=True)
    return JobResult(result={"project_id": ctx.job.payload["project_id"]}, apply=apply)


async def run_email(ctx):
    from app.utils.email import (
        send_email_verification_email,
        send_password_reset_email,
        send_project_invitation_email,
    )
    now = datetime.now(UTC)
    if ctx.job.request_dispatched_at and now >= aware(ctx.job.request_dispatched_at) + timedelta(hours=23):
        raise PermanentJobError("email_expired")
    data = ctx.job.payload
    async with ctx.session_factory() as db:
        user = await db.get(User, data["user_id"])
        if user is None or not user.is_active:
            raise PermanentJobError("invalid_payload")
        recipient = user.email
        if ctx.job.kind in ("email.verify", "email.reset"):
            token = parse_qs(urlsplit(data["link"]).query).get("token", [""])[0]
            expected = hashlib.sha256(token.encode()).hexdigest()
            actual = user.email_verification_token_hash if ctx.job.kind == "email.verify" else user.password_reset_token_hash
            expiry = user.email_verification_expires_at if ctx.job.kind == "email.verify" else user.password_reset_expires_at
            if expected != actual or expiry is None or aware(expiry) <= now:
                raise PermanentJobError("email_expired")
        elif ctx.job.kind == "email.invite":
            from sqlalchemy import select

            from app.models.associations import project_members
            from app.models.project import Project
            project = await db.get(Project, ctx.job.project_id)
            member = await db.scalar(select(project_members.c.user_id).where(project_members.c.project_id == ctx.job.project_id, project_members.c.user_id == user.id))
            if project is None or project.deleted_at is not None or member is None:
                raise PermanentJobError("project_unavailable")
        await db.commit()
    await ctx.mark_dispatched()
    try:
        if ctx.job.kind == "email.verify":
            await send_email_verification_email(recipient, data["link"], idempotency_key=ctx.job.dedupe_key)
        elif ctx.job.kind == "email.reset":
            await send_password_reset_email(recipient, data["link"], idempotency_key=ctx.job.dedupe_key)
        else:
            await send_project_invitation_email(recipient, data["inviter_name"], data["project_name"], data["role_name"], data["link"], idempotency_key=ctx.job.dedupe_key)
    except Exception as exc:
        # Adapter exception text/response may contain tokens or email addresses.
        from app.utils.email import EmailDeliveryError
        if isinstance(exc, EmailDeliveryError) and not exc.retryable:
            raise PermanentJobError("provider_rejected") from exc
        raise RetryableJobError("provider_error") from exc
    return JobResult(result={"sent": True})


# Nội dung thân thông báo push: chỉ chuỗi chung, chi tiết lấy lại khi mở app.
PUSH_BODY = {"vi": "Mở ứng dụng để xem chi tiết.", "en": "Open the app to see details."}
PUSH_TITLE_MAX = 120


def build_push_message(notification, device):
    """Dựng push từ thông báo: tiêu đề gốc (cắt ngắn) + id để app mở đúng màn hình.

    Cố ý KHÔNG gửi `Notification.message`: nội dung chi tiết lấy lại sau khi mở app.
    """
    from app.utils.push import PushMessage

    data = {
        "notification_id": notification.id,
        "notification_type": notification.notification_type.value,
        "related_entity_type": notification.related_entity_type,
        "related_entity_id": notification.related_entity_id,
        "link": notification.link,
    }
    return PushMessage(
        token=device.token,
        title=notification.title[:PUSH_TITLE_MAX],
        body=PUSH_BODY.get(device.locale, PUSH_BODY["vi"]),
        data={key: str(value) for key, value in data.items() if value is not None},
    )


async def run_push(ctx):
    from app.core.config import settings
    from app.models.device_token import DeviceToken
    from app.models.notification import Notification
    from app.utils.push import PushDeliveryError, send_push

    if settings.PUSH_PROVIDER == "disabled":
        raise PermanentJobError("push_unconfigured")
    data = ctx.job.payload
    async with ctx.session_factory() as db:
        notification = await db.get(Notification, data["notification_id"])
        device = await db.get(DeviceToken, data["device_id"])
        user = await db.get(User, device.user_id) if device is not None else None
        # Không còn gì để báo: thông báo đã xóa/đã đọc (xem trên web), thiết bị đã hủy,
        # token đã chuyển sang người khác hoặc tài khoản bị vô hiệu. Coi là hoàn thành.
        if (
            notification is None
            or device is None
            or user is None
            or not user.is_active
            or device.revoked_at is not None
            or device.user_id != notification.user_id
            or notification.is_read
        ):
            return JobResult(result={"skipped": True})
        message = build_push_message(notification, device)
        device_id = device.id
    await ctx.mark_dispatched()
    try:
        await send_push(message)
    except PushDeliveryError as exc:
        if exc.unregistered:
            async with ctx.session_factory() as db, db.begin():
                stale = await db.get(DeviceToken, device_id)
                if stale is not None and stale.revoked_at is None:
                    stale.revoked_at = datetime.now(UTC)
            return JobResult(result={"revoked": True})
        if exc.retryable:
            raise RetryableJobError("provider_error") from exc
        raise PermanentJobError("provider_rejected") from exc
    return JobResult(result={"sent": True})


async def run_document(ctx):
    # Import trễ để tránh vòng import khi nạp danh sách handler.
    from app.services.document_service import run_document_job
    return await run_document_job(ctx)


async def run_report(ctx):
    # Import trễ để tránh vòng import khi nạp danh sách handler.
    from app.services.reports.report_service import run_report_job
    return await run_report_job(ctx)


HANDLERS = {"report.xlsx": run_report, "document.generate": run_document, "scheduling.cpm": run_cpm, "email.verify": run_email, "email.reset": run_email, "email.invite": run_email, "push.send": run_push}
