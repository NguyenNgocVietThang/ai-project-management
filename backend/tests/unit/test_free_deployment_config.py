import pytest

from app.core.config import Settings

FREE = {
    "APP_ENV": "production", "DEPLOYMENT_PROFILE": "render_free",
    "SECRET_KEY": "test-only-signing-value-" * 2, "CRON_SECRET": "test-only-cron-value-" * 2,
    "ALLOWED_HOSTS": ["backend.onrender.com"], "CORS_ORIGINS": ["https://frontend.onrender.com"],
    "FRONTEND_URL": "https://frontend.onrender.com", "DATABASE_SSL": True,
    "DATABASE_POOL_SIZE": 3, "DATABASE_MAX_OVERFLOW": 1,
    "SECURITY_STATE_BACKEND": "database", "STORAGE_PROVIDER": "supabase",
    "SUPABASE_URL": "https://test.supabase.co", "SUPABASE_SERVICE_ROLE_KEY": "test-only-storage-value",
    "EMAIL_PROVIDER": "resend", "EMAIL_FROM": "demo@example.org", "RESEND_API_KEY": "test-only-email-value",
    "XKIRO_API_KEY": "test-only-ai-value", "JOBS_ENABLED": True,
}


def test_free_profile_accepts_complete_https_configuration():
    config = Settings(_env_file=None, **FREE)
    assert config.JOB_CONCURRENCY == 1
    assert config.JOB_TIMEOUT_SECONDS < config.JOB_LEASE_SECONDS


@pytest.mark.parametrize("override", [
    {"JOBS_ENABLED": False}, {"EMAIL_PROVIDER": "smtp"}, {"STORAGE_PROVIDER": "minio"},
    {"SECURITY_STATE_BACKEND": "redis"}, {"DATABASE_SSL": False}, {"CRON_SECRET": ""},
    {"XKIRO_API_KEY": ""}, {"RESEND_API_KEY": ""}, {"SUPABASE_SERVICE_ROLE_KEY": ""},
    {"SUPABASE_URL": "http://test.supabase.co"}, {"JOB_TIMEOUT_SECONDS": 240},
])
def test_free_profile_refuses_disabled_features_or_insecure_configuration(override):
    with pytest.raises(ValueError):
        Settings(_env_file=None, **{**FREE, **override})


def test_configuration_errors_do_not_echo_credentials():
    with pytest.raises(ValueError) as error:
        Settings(_env_file=None, **{**FREE, "DATABASE_SSL": False})
    rendered = str(error.value)
    for field in ("SECRET_KEY", "RESEND_API_KEY", "SUPABASE_SERVICE_ROLE_KEY", "XKIRO_API_KEY"):
        assert FREE[field] not in rendered
