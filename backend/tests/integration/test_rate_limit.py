"""Rate limit phai thuc su kich hoat.

`test_auth_password_recovery.py` truoc day dat `limiter.enabled = False` o cap
module. Viec do ro ri ra toan bo phien pytest, nen bat ky test rate-limit nao
chay sau no deu pass gia - va khong co test rate-limit nao ton tai de phat hien.
Fixture `_disable_rate_limiting` trong conftest gio khoi phuc lai co sau moi test,
va bai test nay chung minh co ay that su co hieu luc.
"""
from unittest.mock import AsyncMock, patch

import pytest

from app.core.rate_limit import limiter


@pytest.fixture
def _rate_limiting_on():
    """Bat lai limiter cho rieng bai test nay, dem trong bo nho.

    Limiter that duoc Redis ho tro (de bo dem duoc chia se giua cac worker
    uvicorn), nhung mot bai test khong nen phu thuoc vao mot server dang chay -
    va neu bo qua bai test khi khong co Redis thi lai quay ve dung van de ban dau:
    khong co gi kiem chung rate limit ca. Doi storage sang bo nho giu cho hanh vi
    duoc kiem tra la that, chi co noi luu dem la khac.
    """
    from limits.storage import MemoryStorage
    from limits.strategies import FixedWindowRateLimiter

    previous_enabled = limiter.enabled
    previous_storage = limiter._storage
    previous_limiter = limiter._limiter

    storage = MemoryStorage()
    limiter._storage = storage
    limiter._limiter = FixedWindowRateLimiter(storage)
    limiter.enabled = True
    # Khoa tai khoan cung dung Redis; o day ta dang kiem tra rate limit theo IP,
    # nen bo qua no de bai test khong phu thuoc vao mot server dang chay.
    with patch(
        "app.services.auth_service.seconds_until_unlocked", AsyncMock(return_value=None)
    ), patch("app.services.auth_service.record_login_failure", AsyncMock()):
        yield
    limiter.enabled = previous_enabled
    limiter._storage = previous_storage
    limiter._limiter = previous_limiter


@pytest.mark.asyncio
async def test_repeated_sign_in_attempts_are_throttled(client, _rate_limiting_on):
    statuses = []
    for _ in range(12):
        response = await client.post(
            "/api/v1/auth/login",
            data={"username": "nobody@example.com", "password": "wrong-password"},
        )
        statuses.append(response.status_code)

    assert 429 in statuses, (
        "khong lan thu nao bi chan; LOGIN_LIMIT khong con hieu luc "
        f"(cac ma tra ve: {sorted(set(statuses))})"
    )


@pytest.mark.asyncio
async def test_the_throttle_response_tells_the_caller_when_to_retry(client, _rate_limiting_on):
    last = None
    for _ in range(12):
        last = await client.post(
            "/api/v1/auth/login",
            data={"username": "nobody@example.com", "password": "wrong-password"},
        )
        if last.status_code == 429:
            break

    assert last is not None and last.status_code == 429
    # Khong co header nay, SPA nhan 429 ma khong biet phai cho bao lau.
    assert "retry-after" in {key.lower() for key in last.headers}


def test_rate_limiting_is_restored_after_each_test():
    """Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day
    deu chay voi limiter da tat."""
    assert limiter.enabled is False, "conftest tat no cho tung test, khong vinh vien"
