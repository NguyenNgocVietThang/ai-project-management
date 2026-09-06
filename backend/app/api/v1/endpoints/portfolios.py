from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.dependencies import (
    CurrentUser,
    CurrentVerifiedUser,
    require_permissions,
)
from app.models.portfolio import PortfolioStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioDetailResponse,
    PortfolioResponse,
    PortfolioUpdate,
)
from app.services.portfolio_service import PortfolioServiceDep

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[PortfolioResponse])
async def list_portfolios(
    service: PortfolioServiceDep,
    current_user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
    status_: PortfolioStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None, max_length=200),
):
    items, total = await service.list(
        current_user,
        skip=(page - 1) * page_size,
        limit=page_size,
        status=status_,
        search=search,
    )
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if total else 0,
    )


@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio(
    body: PortfolioCreate,
    service: PortfolioServiceDep,
    current_user: Annotated[User, Depends(require_permissions("portfolio:create"))],
    _verified: CurrentVerifiedUser,
):
    return await service.create(body, owner=current_user)


@router.get("/{portfolio_id}", response_model=PortfolioDetailResponse)
async def get_portfolio(
    portfolio_id: int,
    service: PortfolioServiceDep,
    current_user: CurrentUser,
):
    return await service.get(portfolio_id, current_user)


@router.patch("/{portfolio_id}", response_model=PortfolioResponse)
@router.put("/{portfolio_id}", response_model=PortfolioResponse, include_in_schema=False)
async def update_portfolio(
    portfolio_id: int,
    body: PortfolioUpdate,
    service: PortfolioServiceDep,
    current_user: Annotated[User, Depends(require_permissions("portfolio:update"))],
    _verified: CurrentVerifiedUser,
):
    return await service.update(portfolio_id, body, current_user)


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: int,
    service: PortfolioServiceDep,
    current_user: Annotated[User, Depends(require_permissions("portfolio:delete"))],
    _verified: CurrentVerifiedUser,
):
    await service.delete(portfolio_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
