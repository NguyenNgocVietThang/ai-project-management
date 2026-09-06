"""Context theo từng request mà code ở tầng service cần nhưng không được truyền xuống cho nó.

Service nhận một `db` session và các domain object, không nhận `Request`, nên không có
cách nào luồn IP của caller vào một dòng audit qua chuỗi lời gọi mà không
đụng vào mọi signature. Một ContextVar được đặt một lần (middleware trong app/main.py cho IP, và
get_project_context() cho project id) rồi đọc tại thời điểm INSERT AuditLog
(xem app/models/audit_log.py) bao phủ mọi nơi ghi, kể cả những nơi được thêm về sau.

Ngoài phạm vi một request — Celery worker, script seed — biến này đơn giản là chưa được đặt và
các dòng audit nhận ip_address / project_id là NULL, đó là câu trả lời trung thực.
"""
from contextvars import ContextVar

from fastapi import Request

# audit_logs.ip_address là String(45): đủ cho một địa chỉ IPv6 kèm scope id.
MAX_IP_LENGTH = 45

_client_ip: ContextVar[str | None] = ContextVar("client_ip", default=None)

# Dự án mà request hiện tại đang thao tác. Được get_project_context() đặt (xem
# app/services/phase2_common.py) — tức là mọi đường vào tài nguyên phạm vi dự án
# đều đi qua đó — và được đọc tại thời điểm INSERT AuditLog. Nhờ vậy audit_logs
# có project_id để lọc mà không phải thêm tham số vào 30+ nơi gọi add_audit.
_project_id: ContextVar[int | None] = ContextVar("project_id", default=None)


def set_client_ip(value: str | None) -> None:
    _client_ip.set(value)


def get_client_ip() -> str | None:
    return _client_ip.get()


def set_current_project_id(value: int | None) -> None:
    _project_id.set(value)


def get_current_project_id() -> int | None:
    """Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào
    (quản trị người dùng, vai trò) và với code chạy ngoài request (Celery, seed)."""
    return _project_id.get()


def resolve_client_ip(request: Request, *, trust_proxy_headers: bool) -> str | None:
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
