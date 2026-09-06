"""Làm sạch nội dung do người dùng nhập trước khi lưu.

Tin nhắn chat trước đây được lưu nguyên trạng. Frontend hiện render chúng dưới
dạng text, nên chưa có lỗ hổng — nhưng đó là một bất biến không được viết ra ở
đâu cả, và chỉ cần một lần đổi sang `dangerouslySetInnerHTML` (hoặc một client
khác, hoặc một bản xuất báo cáo) là biến lịch sử chat thành stored XSS.

Việc làm sạch được đặt ở tầng lưu trữ chứ không phải tầng render vì có nhiều
đường ghi (REST và WebSocket) và sẽ còn nhiều đường đọc hơn nữa.
"""
import re

# Scheme trông như link nhưng thực chất là thực thi mã khi được đặt vào href.
DANGEROUS_SCHEME = re.compile(r"(?i)\b(javascript|vbscript|data)\s*:")
# Ký tự điều khiển C0/C1 trừ tab và xuống dòng: chúng không hiển thị được, và
# được dùng để che giấu nội dung hoặc phá vỡ log.
CONTROL_CHARACTERS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]")


def sanitize_message(content: str) -> str:
    """Chuẩn hoá một tin nhắn chat do người dùng gửi.

    Cố tình KHÔNG escape HTML: nội dung được lưu ở dạng text thuần và việc escape
    thuộc về nơi render. Escape tại đây sẽ khiến "a < b" hiện ra là "a &lt; b" cho
    người đọc và tự làm hỏng dữ liệu.
    """
    cleaned = CONTROL_CHARACTERS.sub("", content or "")
    cleaned = DANGEROUS_SCHEME.sub("", cleaned)
    return cleaned.strip()
