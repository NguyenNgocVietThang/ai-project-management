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
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Ho_Chi_Minh",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    # API requests enqueue email on a best-effort basis. Fail quickly when Redis is
    # unavailable so registration/invitation still returns instead of blocking.
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

# Requires a separate `celery -A app.workers.celery_app beat` process running
# (see docker-compose.yml's celery-beat service) — the worker alone never
# fires scheduled tasks.
celery_app.conf.beat_schedule = {
    "sweep-task-dates-daily": {
        "task": "notifications.sweep_task_dates",
        "schedule": crontab(hour=8, minute=0),  # 08:00 Asia/Ho_Chi_Minh
    },
}
