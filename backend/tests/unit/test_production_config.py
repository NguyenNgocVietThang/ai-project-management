"""Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong docs.

Không mục nào dưới đây tự bộc lộ khi hỏng: một ALLOWED_HOSTS mở toang trông y hệt
một cái đã cấu hình đúng, và CORS_ORIGINS trỏ về localhost chỉ lặng lẽ chặn frontend
thật. Thất bại ngay tại thời điểm import là cách đáng tin cậy duy nhất để bắt chúng.
"""
import pytest

from app.core.config import INSECURE_SECRET_KEY, Settings

SAFE = dict(
    APP_ENV="production",
    SECRET_KEY="k" * 40,
    MINIO_ACCESS_KEY="real-access",
    MINIO_SECRET_KEY="real-secret",
    ALLOWED_HOSTS=["app.example.com"],
    CORS_ORIGINS=["https://app.example.com"],
    FRONTEND_URL="https://app.example.com",
)


def test_a_fully_configured_production_environment_starts():
    Settings(**SAFE)


FREE_SAFE = {
    **SAFE,
    "DEPLOYMENT_PROFILE": "render_free",
    "JOBS_ENABLED": True,
    "EMAIL_PROVIDER": "resend",
    "RESEND_API_KEY": "local-mock-provider-key",
    "EMAIL_FROM": "demo@example.com",
    "STORAGE_PROVIDER": "supabase",
    "SUPABASE_URL": "https://demo.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "local-mock-storage-key",
    "SECURITY_STATE_BACKEND": "database",
    "DATABASE_SSL": True,
    "CRON_SECRET": "c" * 40,
    "XKIRO_API_KEY": "local-mock-ai-key",
}


def test_render_free_settings_accept_complete_local_mock_credentials():
    # Instantiation validates configuration only and performs no provider request.
    configured = Settings(_env_file=None, **FREE_SAFE)
    assert configured.SECURITY_STATE_BACKEND == "database"
    assert configured.JOBS_ENABLED is True


@pytest.mark.parametrize("override, expected", [
    ({"JOBS_ENABLED": False}, "durable job runner"),
    ({"EMAIL_PROVIDER": "smtp"}, "HTTPS"),
    ({"STORAGE_PROVIDER": "minio"}, "Supabase"),
    ({"SECURITY_STATE_BACKEND": "redis"}, "durable authentication"),
    ({"DATABASE_SSL": False}, "TLS"),
    ({"CRON_SECRET": "short"}, "CRON_SECRET"),
    ({"XKIRO_API_KEY": ""}, "XKIRO_API_KEY"),
    ({"SUPABASE_SERVICE_ROLE_KEY": ""}, "SUPABASE_SERVICE_ROLE_KEY"),
    ({"RESEND_API_KEY": ""}, "RESEND_API_KEY"),
])
def test_render_free_refuses_missing_operational_requirements(override, expected):
    with pytest.raises(ValueError, match=expected):
        Settings(_env_file=None, **{**FREE_SAFE, **override})


def test_development_is_never_blocked():
    """Một bản clone mới phải chạy được ngay mà không cần cấu hình gì."""
    Settings(APP_ENV="development")


@pytest.mark.parametrize(
    "override, expected",
    [
        ({"SECRET_KEY": INSECURE_SECRET_KEY}, "SECRET_KEY"),
        ({"SECRET_KEY": "too-short"}, "SECRET_KEY"),
        ({"MINIO_ACCESS_KEY": "minioadmin"}, "MINIO"),
        ({"MINIO_SECRET_KEY": "minioadmin"}, "MINIO"),
        ({"ALLOWED_HOSTS": ["*"]}, "ALLOWED_HOSTS"),
        ({"CORS_ORIGINS": ["http://localhost:3000"]}, "CORS_ORIGINS"),
        ({"CORS_ORIGINS": ["http://127.0.0.1:3000"]}, "CORS_ORIGINS"),
        ({"CORS_ORIGINS": ["*"]}, "CORS_ORIGINS"),
        ({"FRONTEND_URL": "http://app.example.com"}, "FRONTEND_URL"),
    ],
)
def test_production_refuses_to_start_with_insecure_settings(override, expected):
    with pytest.raises(Exception) as error:
        Settings(**{**SAFE, **override})
    assert expected in str(error.value)


def test_every_problem_is_reported_at_once():
    """Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai."""
    with pytest.raises(Exception) as error:
        Settings(
            **{
                **SAFE,
                "SECRET_KEY": INSECURE_SECRET_KEY,
                "ALLOWED_HOSTS": ["*"],
                "FRONTEND_URL": "http://app.example.com",
            }
        )
    message = str(error.value)
    assert "SECRET_KEY" in message
    assert "ALLOWED_HOSTS" in message
    assert "FRONTEND_URL" in message
