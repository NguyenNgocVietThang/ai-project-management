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
