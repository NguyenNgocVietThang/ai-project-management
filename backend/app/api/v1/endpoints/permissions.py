from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_roles
from app.db.session import get_db
from app.models.permission import Permission
from app.models.user import User
from app.schemas.admin import PermissionResponse

router = APIRouter()


@router.get("/", response_model=list[PermissionResponse])
async def list_permissions(
    current_user: Annotated[User, Depends(require_roles("Admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action).

    Người dùng không thể tạo quyền — vai trò được cấu thành bằng cách gán một tập con
    của danh mục này (xem `POST/PATCH /roles`).
    """
    result = await db.execute(
        select(Permission).order_by(Permission.resource, Permission.action)
    )
    return list(result.scalars().all())
