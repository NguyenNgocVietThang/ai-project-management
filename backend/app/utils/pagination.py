from typing import Generic, List, TypeVar
from pydantic import BaseModel
from app.schemas.common import PaginatedResponse

T = TypeVar("T")


def paginate(items: List, page: int, page_size: int):
    total = len(items)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
