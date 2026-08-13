from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.models.role import Role
from app.schemas.project import RoleSummary

router = APIRouter()
PROJECT_ROLES = ("PM", "BA", "PO", "Member", "Customer")


@router.get("/", response_model=list[RoleSummary])
async def list_roles(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    project_assignable: Annotated[bool, Query()] = False,
):
    stmt = select(Role)
    if project_assignable:
        stmt = stmt.where(Role.name.in_(PROJECT_ROLES))
    result = await db.execute(stmt.order_by(Role.name))
    return list(result.scalars().all())
