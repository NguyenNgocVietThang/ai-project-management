"""Cổng nhà đầu tư: chỉ đọc, mọi route yêu cầu quyền portfolio:read."""
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_permissions
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.investor import (
    InvestorPortfolioItem,
    InvestorPortfolioOverview,
    InvestorProjectDetail,
)
from app.services.investor_service import InvestorServiceDep

router = APIRouter()

PortfolioReader = Annotated[User, Depends(require_permissions("portfolio:read"))]


@router.get("/portfolios", response_model=PaginatedResponse[InvestorPortfolioItem])
async def list_investor_portfolios(
    service: InvestorServiceDep,
    current_user: PortfolioReader,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    items, total = await service.list_portfolios(
        current_user, skip=(page - 1) * page_size, limit=page_size
    )
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if total else 0,
    )


@router.get("/portfolios/{portfolio_id}", response_model=InvestorPortfolioOverview)
async def get_investor_portfolio(
    portfolio_id: int, service: InvestorServiceDep, current_user: PortfolioReader
):
    return await service.portfolio_overview(portfolio_id, current_user)


@router.get("/projects/{project_id}", response_model=InvestorProjectDetail)
async def get_investor_project(
    project_id: int, service: InvestorServiceDep, current_user: PortfolioReader
):
    return await service.project_summary(project_id, current_user)
