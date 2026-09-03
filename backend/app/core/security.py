import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt có giới hạn cứng 72 byte đầu vào; từ chối ngay bất cứ thứ gì dài hơn
# thay vì để passlib âm thầm cắt bớt (hoặc ném lỗi) tại lúc hash.
MIN_PASSWORD_LENGTH = 12
MAX_PASSWORD_LENGTH = 72

# Độ dài mới là thuộc tính thực sự chống lại việc crack offline, nên mức yêu cầu là
# 12 ký tự thay vì một mớ quy tắc về lớp ký tự. Danh sách ngắn này
# chỉ bắt được số ít mật khẩu xuất hiện đầu tiên trong mọi lần credential
# stuffing; nó không thay thế được việc kiểm tra với breach-corpus (range API
# k-anonymity của Have I Been Pwned là bước nâng cấp tự nhiên).
COMMON_PASSWORDS = frozenset(
    {
        "123456789012", "111111111111", "123123123123", "password1234",
        "passw0rd1234", "qwerty123456", "qwertyuiop12", "1q2w3e4r5t6y",
        "iloveyou1234", "administrator", "adminadmin12", "welcome12345",
        "letmein12345", "monkey123456", "football1234", "baseball1234",
        "dragon123456", "sunshine1234", "princess1234", "trustno112345",
    }
)


def validate_password_policy(password: str) -> str:
    """Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu."""
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
    if len(password.encode("utf-8")) > MAX_PASSWORD_LENGTH:
        raise ValueError(f"Password must not exceed {MAX_PASSWORD_LENGTH} bytes")
    if not any(
        character.isdigit()
        or (not character.isalnum() and not character.isspace())
        for character in password
    ):
        raise ValueError("Password must contain at least one number or special character")
    if password.lower() in COMMON_PASSWORDS:
        raise ValueError("This password is too common. Please choose a different one")
    return password


def hash_password(password: str) -> str:
    if len(password.encode("utf-8")) > MAX_PASSWORD_LENGTH:
        raise ValueError(f"Password must not exceed {MAX_PASSWORD_LENGTH} bytes")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, TypeError):
        # Hash sai định dạng/không rõ, đầu vào quá lớn, v.v. -> coi như không khớp
        # thay vì ném lỗi và làm lộ một 500 ra cho caller.
        return False


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = _utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    # jti: một id ổn định cho từng token để có thể thu hồi một token đơn lẻ (logout,
    # xoay vòng refresh) mà không cần chờ nó hết hạn — xem
    # app/core/token_revocation.py.
    to_encode.update(
        {"exp": expire, "iat": _utcnow(), "type": "access", "jti": uuid.uuid4().hex}
    )
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = _utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update(
        {"exp": expire, "iat": _utcnow(), "type": "refresh", "jti": uuid.uuid4().hex}
    )
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict[str, Any]]:
    """Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết hạn/sai định dạng.

    `algorithms` được ghim vào đúng thuật toán được cấu hình và `exp`/`iat` là
    bắt buộc, nên một token thiếu chúng (hoặc khai một alg khác) sẽ bị
    từ chối thay vì được chấp nhận âm thầm.
    """
    if not token:
        return None
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "iat"]},
        )
        return payload
    except jwt.PyJWTError:
        return None
