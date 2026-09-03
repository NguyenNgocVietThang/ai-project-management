from datetime import date, timedelta
from typing import List


def add_working_days(start: date, days: int) -> date:
    """Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày."""
    current = start
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # Thứ Hai=0, Thứ Sáu=4
            added += 1
    return current


def working_days_between(start: date, end: date) -> int:
    """Đếm số ngày làm việc giữa hai ngày."""
    count = 0
    current = start
    while current < end:
        if current.weekday() < 5:
            count += 1
        current += timedelta(days=1)
    return count


def date_range(start: date, end: date) -> List[date]:
    """Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)."""
    dates = []
    current = start
    while current <= end:
        dates.append(current)
        current += timedelta(days=1)
    return dates
