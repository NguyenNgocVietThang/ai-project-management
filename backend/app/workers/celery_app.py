from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "ai_project_management",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.ai_tasks",
        "app.workers.report_tasks",
        "app.workers.email_tasks",
        "app.workers.notification_tasks",
        "app.workers.scheduling_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    # Lay tu cung mot nguon voi phan con lai cua ung dung. Hai chuoi mui gio
    # viet tay o hai file la mot cach rat de tao ra lech gio.
    timezone=settings.APP_TIMEZONE,
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    # Các request API đưa email vào hàng đợi theo kiểu best-effort. Fail nhanh khi Redis
    # không sẵn sàng để việc đăng ký/mời vẫn trả về thay vì bị chặn.
    broker_connection_timeout=2,
    broker_connection_retry=False,
    task_publish_retry=False,
    broker_transport_options={
        "socket_connect_timeout": 2,
        "socket_timeout": 2,
        "max_retries": 1,
        "interval_start": 0,
    },
)

# Cần một tiến trình `celery -A app.workers.celery_app beat` chạy riêng
# (xem service celery-beat trong docker-compose.yml) — chỉ mình worker sẽ
# không bao giờ kích hoạt các task theo lịch.
celery_app.conf.beat_schedule = {
    "sweep-task-dates-daily": {
        "task": "notifications.sweep_task_dates",
        "schedule": crontab(hour=8, minute=0),  # 08:00 theo APP_TIMEZONE
    },
}
