"""Kênh push: outbox cùng transaction với thông báo, handler `push.send`, thu hồi token."""
from datetime import UTC, datetime

import pytest
import pytest_asyncio
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.config import settings
from app.core.job_runner import JobRunner
from app.models.device_token import DeviceToken
from app.models.job import Job
from app.models.notification import NotificationType
from app.services.durable_handlers import HANDLERS
from app.services.notification_service import NotificationService
from app.utils import push

SECRET_MESSAGE = "NOI-DUNG-CHI-TIET-KHONG-DUOC-GUI"


@pytest.fixture(autouse=True)
def fake_push(monkeypatch):
    monkeypatch.setattr(settings, "PUSH_PROVIDER", "fake")
    # Không có Redis trong test: bỏ qua bước phát WebSocket thay vì để nó ghi log lỗi kết nối.
    async def no_publish(*args, **kwargs):
        return None

    monkeypatch.setattr("app.core.ws_manager.publish", no_publish)
    push.reset_fake()
    yield
    push.reset_fake()


@pytest_asyncio.fixture
async def add_device(session):
    counter = {"n": 0}

    async def factory(user, *, locale="vi", revoked=False) -> DeviceToken:
        counter["n"] += 1
        device = DeviceToken(
            user_id=user.id,
            token=f"fcm-token-{counter['n']:03d}-" + "t" * 40,
            platform="android",
            locale=locale,
            last_seen_at=datetime.now(UTC),
            revoked_at=datetime.now(UTC) if revoked else None,
        )
        session.add(device)
        await session.flush()
        return device

    return factory


async def _notify(session, user, *, title="Công việc mới", **kwargs):
    return await NotificationService.push(
        session,
        user_id=user.id,
        title=title,
        message=SECRET_MESSAGE,
        ntype=NotificationType.TASK_ASSIGNED,
        link="/projects/5/tasks/9",
        entity_type="Task",
        entity_id=9,
        **kwargs,
    )


async def _jobs(session) -> list[Job]:
    statement = (
        select(Job)
        .where(Job.kind == "push.send")
        .order_by(Job.id)
        .execution_options(populate_existing=True)
    )
    return (await session.scalars(statement)).all()


async def _run_jobs(session):
    factory = async_sessionmaker(session.bind, expire_on_commit=False)
    runner = JobRunner(factory, HANDLERS)
    await runner.poll_once()
    await runner.stop()


# ── Outbox ──────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_no_job_when_provider_is_disabled(session, make_user, add_device, monkeypatch):
    monkeypatch.setattr(settings, "PUSH_PROVIDER", "disabled")
    user = await make_user()
    await add_device(user)

    await _notify(session, user)

    assert await _jobs(session) == []


@pytest.mark.asyncio
async def test_no_job_for_user_without_devices(session, make_user):
    user = await make_user()
    await _notify(session, user)
    assert await _jobs(session) == []


@pytest.mark.asyncio
async def test_one_job_per_active_device_and_none_for_revoked(session, make_user, add_device):
    user = await make_user()
    first, second = await add_device(user), await add_device(user)
    await add_device(user, revoked=True)

    notification = await _notify(session, user)

    jobs = await _jobs(session)
    assert [job.dedupe_key for job in jobs] == [
        f"push:{notification.id}:{first.id}",
        f"push:{notification.id}:{second.id}",
    ]
    assert jobs[0].owner_id == user.id
    assert jobs[0].payload == {"notification_id": notification.id, "device_id": first.id}
    assert jobs[0].expires_at is not None


@pytest.mark.asyncio
async def test_push_job_rolls_back_with_the_notification(session, make_user, add_device):
    user = await make_user()
    await add_device(user)
    await session.commit()

    await _notify(session, user)
    assert len(await _jobs(session)) == 1
    await session.rollback()

    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_push_many_queues_only_for_recipients_with_devices(session, make_user, add_device):
    with_device, other, no_device = await make_user(), await make_user(), await make_user()
    await add_device(with_device)
    await add_device(other)
    stranger = await make_user()
    await add_device(stranger)  # không nằm trong danh sách người nhận

    notifications = await NotificationService.push_many(
        session,
        [with_device.id, other.id, no_device.id],
        title="Hạn sắp tới",
        message=SECRET_MESSAGE,
        ntype=NotificationType.TASK_DUE_SOON,
    )

    jobs = await _jobs(session)
    assert len(notifications) == 3
    assert sorted(job.owner_id for job in jobs) == sorted([with_device.id, other.id])


@pytest.mark.asyncio
async def test_queue_failure_never_breaks_the_notification(session, make_user, add_device, monkeypatch):
    user = await make_user()
    await add_device(user)

    async def boom(*args, **kwargs):
        raise RuntimeError("queue down")

    monkeypatch.setattr("app.services.job_service.enqueue", boom)
    notification = await _notify(session, user)

    assert notification.id is not None
    assert await _jobs(session) == []


# ── Handler ─────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_handler_sends_original_title_with_ids_and_no_message_body(
    session, make_user, add_device
):
    user = await make_user()
    device = await add_device(user, locale="en")
    notification = await _notify(session, user, title="Hợp đồng ABC đã duyệt")
    await session.commit()

    await _run_jobs(session)

    (sent,) = push.fake_outbox
    assert sent.token == (await session.get(DeviceToken, device.id)).token
    assert sent.title == "Hợp đồng ABC đã duyệt"
    assert sent.body == "Open the app to see details."
    assert sent.data == {
        "notification_id": str(notification.id),
        "notification_type": "TASK_ASSIGNED",
        "related_entity_type": "Task",
        "related_entity_id": "9",
        "link": "/projects/5/tasks/9",
    }
    assert SECRET_MESSAGE not in repr(sent), "nội dung chi tiết không được rời khỏi server"
    (job,) = await _jobs(session)
    assert job.status == "succeeded" and job.result == {"sent": True}


@pytest.mark.asyncio
async def test_long_titles_are_truncated(session, make_user, add_device):
    user = await make_user()
    await add_device(user)
    await _notify(session, user, title="T" * 500)
    await session.commit()

    await _run_jobs(session)

    assert len(push.fake_outbox[0].title) == 120


@pytest.mark.asyncio
async def test_unregistered_token_revokes_the_device_and_completes(session, make_user, add_device):
    user = await make_user()
    device = await add_device(user)
    push.fake_failures[device.token] = push.PushDeliveryError("gone", unregistered=True)
    await _notify(session, user)
    await session.commit()

    await _run_jobs(session)

    await session.refresh(device)
    assert device.revoked_at is not None
    (job,) = await _jobs(session)
    assert job.status == "succeeded" and job.result == {"revoked": True}


@pytest.mark.asyncio
async def test_transient_failure_is_retried_later(session, make_user, add_device):
    user = await make_user()
    device = await add_device(user)
    push.fake_failures[device.token] = push.PushDeliveryError("busy", retryable=True)
    await _notify(session, user)
    await session.commit()

    await _run_jobs(session)

    (job,) = await _jobs(session)
    assert job.status == "queued" and job.error_code == "provider_error"
    await session.refresh(device)
    assert device.revoked_at is None, "lỗi tạm không được thu hồi thiết bị"


@pytest.mark.asyncio
async def test_permanent_failure_is_not_retried(session, make_user, add_device):
    user = await make_user()
    device = await add_device(user)
    push.fake_failures[device.token] = push.PushDeliveryError("bad")
    await _notify(session, user)
    await session.commit()

    await _run_jobs(session)

    (job,) = await _jobs(session)
    assert job.status == "failed" and job.error_code == "provider_rejected"


@pytest.mark.asyncio
async def test_already_read_notification_is_not_pushed(session, make_user, add_device):
    user = await make_user()
    await add_device(user)
    notification = await _notify(session, user)
    notification.is_read = True
    await session.commit()

    await _run_jobs(session)

    assert push.fake_outbox == []
    (job,) = await _jobs(session)
    assert job.status == "succeeded" and job.result == {"skipped": True}


@pytest.mark.asyncio
async def test_device_that_changed_owner_does_not_receive_the_old_users_push(
    session, make_user, add_device
):
    old_owner, new_owner = await make_user(), await make_user()
    device = await add_device(old_owner)
    await _notify(session, old_owner)
    device.user_id = new_owner.id  # cùng máy, đăng nhập tài khoản khác
    await session.commit()

    await _run_jobs(session)

    assert push.fake_outbox == []


@pytest.mark.asyncio
async def test_revoked_device_and_inactive_user_are_skipped(session, make_user, add_device):
    user, inactive = await make_user(), await make_user()
    device = await add_device(user)
    await add_device(inactive)
    await _notify(session, user)
    await _notify(session, inactive)
    device.revoked_at = datetime.now(UTC)
    inactive.is_active = False
    await session.commit()

    await _run_jobs(session)

    assert push.fake_outbox == []


@pytest.mark.asyncio
async def test_job_fails_cleanly_if_provider_was_disabled_after_queueing(
    session, make_user, add_device, monkeypatch
):
    user = await make_user()
    await add_device(user)
    await _notify(session, user)
    await session.commit()
    monkeypatch.setattr(settings, "PUSH_PROVIDER", "disabled")

    await _run_jobs(session)

    (job,) = await _jobs(session)
    assert job.status == "failed" and job.error_code == "push_unconfigured"
