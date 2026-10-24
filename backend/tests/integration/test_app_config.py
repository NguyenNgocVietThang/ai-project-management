"""GET /app/config và kiểm tra cấu hình phiên bản."""
import pytest
from pydantic import ValidationError

from app.core.config import Settings, parse_version


@pytest.mark.asyncio
async def test_app_config_is_public_and_has_safe_defaults(client):
    response = await client.get("/api/v1/app/config")

    assert response.status_code == 200
    assert response.json() == {
        "min_supported_version": "0.0.0",
        "latest_version": "0.0.0",
        "maintenance": False,
        "maintenance_message": None,
    }
    assert response.headers["cache-control"] == "no-store"


@pytest.mark.asyncio
async def test_app_config_reflects_environment_settings(client, monkeypatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "APP_MIN_SUPPORTED_VERSION", "1.2.0")
    monkeypatch.setattr(settings, "APP_LATEST_VERSION", "1.4.1")
    monkeypatch.setattr(settings, "MAINTENANCE_MODE", True)
    monkeypatch.setattr(settings, "MAINTENANCE_MESSAGE", "Bảo trì 30 phút")

    body = (await client.get("/api/v1/app/config")).json()

    assert body == {
        "min_supported_version": "1.2.0",
        "latest_version": "1.4.1",
        "maintenance": True,
        "maintenance_message": "Bảo trì 30 phút",
    }


def test_version_parsing_compares_numerically_not_alphabetically():
    assert parse_version("1.10.0") > parse_version("1.9.9")
    with pytest.raises(ValueError):
        parse_version("1.2")
    with pytest.raises(ValueError):
        parse_version("v1.2.3")


@pytest.mark.parametrize(
    "overrides",
    [
        {"APP_MIN_SUPPORTED_VERSION": "abc"},
        {"APP_LATEST_VERSION": "1.0"},
        {"APP_MIN_SUPPORTED_VERSION": "2.0.0", "APP_LATEST_VERSION": "1.9.9"},
    ],
)
def test_invalid_version_settings_fail_at_startup(overrides):
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **overrides)


def test_valid_version_settings_load():
    config = Settings(
        _env_file=None, APP_MIN_SUPPORTED_VERSION="1.0.0", APP_LATEST_VERSION="1.0.0"
    )
    assert config.APP_MIN_SUPPORTED_VERSION == "1.0.0"
