from datetime import date, timedelta
from typing import List


def add_working_days(start: date, days: int) -> date:
    """Add N working days (skip weekends) to a date."""
    current = start
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # Mon=0, Fri=4
            added += 1
    return current


def working_days_between(start: date, end: date) -> int:
    """Count working days between two dates."""
    count = 0
    current = start
    while current < end:
        if current.weekday() < 5:
            count += 1
        current += timedelta(days=1)
    return count


def date_range(start: date, end: date) -> List[date]:
    """Generate list of dates between start and end (inclusive)."""
    dates = []
    current = start
    while current <= end:
        dates.append(current)
        current += timedelta(days=1)
    return dates
