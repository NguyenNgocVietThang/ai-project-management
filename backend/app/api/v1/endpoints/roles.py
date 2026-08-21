from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser, require_roles
from app.db.session import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.admin import RoleCreate, RoleDetailResponse, RoleUpdate
from app.services.role_service import RoleServiceDep

router = APIRouter()
PROJECT_ROLES = ("PM", "BA", "PO", "Member", "Customer")

RequireAdmin = Annotated[User, Depends(require_roles("Admin"))]


@router.get("/", response_model=list[RoleDetailResponse])
async def list_roles(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    role_service: RoleServiceDep,
    project_assignable: Annotated[bool, Query()] = False,
):
    if project_assignable:
        result = await db.execute(
            select(Role).where(Role.name.in_(PROJECT_ROLES)).order_by(Role.name)
        )
        return [RoleDetailResponse.model_validate(role) for role in result.scalars().all()]
    rows = await role_service.list_roles()
    responses = []
    for role, user_count in rows:
        item = RoleDetailResponse.model_validate(role)
        item.user_count = user_count
        responses.append(item)
    return responses


@router.post("/", response_model=RoleDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    body: RoleCreate,
    role_service: RoleServiceDep,
    current_user: RequireAdmin,
):
    role = await role_service.create_role(body, current_user)
    return RoleDetailResponse.model_validate(role)


@router.get("/{role_id:int}", response_model=RoleDetailResponse)
async def get_role(
    role_id: int,
    role_service: RoleServiceDep,
    current_user: RequireAdmin,
):
    role, user_count = await role_service.get_role(role_id)
    item = RoleDetailResponse.model_validate(role)
    item.user_count = user_count
    return item


@router.patch("/{role_id:int}", response_model=RoleDetailResponse)
async def update_role(
    role_id: int,
    body: RoleUpdate,
    role_service: RoleServiceDep,
    current_user: RequireAdmin,
):
    role = await role_service.update_role(role_id, body, current_user)
    return RoleDetailResponse.model_validate(role)


@router.delete("/{role_id:int}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    role_service: RoleServiceDep,
    current_user: RequireAdmin,
):
    await role_service.delete_role(role_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
