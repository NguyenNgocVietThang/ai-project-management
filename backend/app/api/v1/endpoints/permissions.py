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
    """Read-only listing of the fixed, seeded permission catalog (resource:action).

    Permissions are not user-creatable — roles are composed by assigning a subset
    of this catalog (see `POST/PATCH /roles`).
    """
    result = await db.execute(
        select(Permission).order_by(Permission.resource, Permission.action)
    )
    return list(result.scalars().all())
