"""Logging co cau truc, kem request id de noi cac dong log lai voi nhau.

Truoc day khong co cau hinh logging nao trong ung dung: startup/shutdown dung
`print()`, va cac dong log tu service ra theo dinh dang mac dinh cua uvicorn.
Khong co gi noi mot dong log voi request sinh ra no, va khong the doi chieu log
giua API va Celery worker khi mot thao tac di qua ca hai.
"""
import json
import logging
import sys
from contextvars import ContextVar
from typing import Any

# Rieng biet voi request_context.py: id nay ton tai cho MOI request, ke ca khi
# no khong bao gio cham toi mot du an hay ghi mot dong audit nao.
_request_id: ContextVar[str | None] = ContextVar("request_id", default=None)

REQUEST_ID_HEADER = "X-Request-ID"


def set_request_id(value: str | None) -> None:
    _request_id.set(value)


def get_request_id() -> str | None:
    return _request_id.get()


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = get_request_id() or "-"
        return True


class JsonFormatter(logging.Formatter):
    """Mot dong JSON cho moi ban ghi.

    Log co cau truc chu khong phai chuoi tu do: chung duoc doc boi may (tim kiem,
    canh bao) truoc khi duoc doc boi nguoi, va viec ghep chuoi lam mat ranh gioi
    truong ngay khi mot thong diep chua dau cach.
    """

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "-"),
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False, default=str)


def configure_logging(*, json_output: bool) -> None:
    """Cau hinh logging goc. `json_output` tat o development, noi mot dong doc
    duoc bang mat huu ich hon mot dong may doc duoc."""
    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(RequestIdFilter())
    handler.setFormatter(
        JsonFormatter()
        if json_output
        else logging.Formatter("%(levelname)-8s [%(request_id)s] %(name)s: %(message)s")
    )

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(logging.INFO)

    # uvicorn tu cau hinh handler rieng; go chung di de moi thu di qua cung mot
    # dinh dang va cung mot request id.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logger = logging.getLogger(name)
        logger.handlers = []
        logger.propagate = True
