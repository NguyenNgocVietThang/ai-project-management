"""Context theo từng request mà code ở tầng service cần nhưng không được truyền xuống cho nó.

Service nhận một `db` session và các domain object, không nhận `Request`, nên không có
cách nào luồn IP của caller vào một dòng audit qua chuỗi lời gọi mà không
đụng vào mọi signature. Một ContextVar được middleware trong app/main.py đặt một lần và
đọc tại thời điểm INSERT AuditLog (xem app/models/audit_log.py) bao phủ mọi nơi
ghi, kể cả những nơi được thêm về sau.

Ngoài phạm vi một request — Celery worker, script seed — biến này đơn giản là chưa được đặt và
các dòng audit nhận ip_address là NULL, đó là câu trả lời trung thực.
"""
from contextvars import ContextVar
from typing import Optional

from fastapi import Request

# audit_logs.ip_address là String(45): đủ cho một địa chỉ IPv6 kèm scope id.
MAX_IP_LENGTH = 45

_client_ip: ContextVar[Optional[str]] = ContextVar("client_ip", default=None)


def set_client_ip(value: Optional[str]) -> None:
    _client_ip.set(value)


def get_client_ip() -> Optional[str]:
    return _client_ip.get()


def resolve_client_ip(request: Request, *, trust_proxy_headers: bool) -> Optional[str]:
    """Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng tin.

    X-Forwarded-For do client cung cấp và dễ dàng bị giả mạo khi ứng dụng có thể
    truy cập trực tiếp, điều đó sẽ làm hỏng audit trail — nên nó chỉ được dùng
    khi người vận hành đã khai báo rằng có một reverse proxy đặt nó (TRUST_PROXY_HEADERS).
    """
    if trust_proxy_headers:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            # Mục ngoài cùng bên trái là client gốc; phần còn lại là các chặng proxy.
            return forwarded.split(",")[0].strip()[:MAX_IP_LENGTH] or None
    if request.client is not None:
        return request.client.host[:MAX_IP_LENGTH]
    return None
