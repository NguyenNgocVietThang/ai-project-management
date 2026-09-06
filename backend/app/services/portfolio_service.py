from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio, PortfolioStatus
from app.models.user import User
from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.portfolio import (
    PortfolioCapabilities,
    PortfolioCreate,
    PortfolioDetailResponse,
    PortfolioProjectSummary,
    PortfolioResponse,
    PortfolioUpdate,
)
from app.services.phase2_common import is_admin as _is_admin
from app.services.phase2_common import json_value as _json_value


class PortfolioService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = PortfolioRepository(db)

    @staticmethod
    def _capabilities(portfolio: Portfolio, user: User) -> PortfolioCapabilities:
        allowed = _is_admin(user) or portfolio.owner_id == user.id
        return PortfolioCapabilities(
            can_update=allowed,
            can_delete=allowed,
            can_create_project=allowed,
        )

    def _response(
        self,
        portfolio: Portfolio,
        project_count: int,
        progress_percent: float,
        user: User,
    ) -> PortfolioResponse:
        return PortfolioResponse(
            id=portfolio.id,
            name=portfolio.name,
            description=portfolio.description,
            status=portfolio.status.value,
            start_date=portfolio.start_date,
            end_date=portfolio.end_date,
            budget=portfolio.budget,
            currency=portfolio.currency,
            owner_id=portfolio.owner_id,
            project_count=project_count,
            progress_percent=round(float(progress_percent), 2),
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            capabilities=self._capabilities(portfolio, user),
        )

    def _audit(
        self,
        actor_id: int,
        action: str,
        portfolio: Portfolio,
        *,
        old_values: dict | None = None,
        new_values: dict | None = None,
    ) -> None:
        self.db.add(
            AuditLog(
                user_id=actor_id,
                action=action,
                entity_type="Portfolio",
                entity_id=portfolio.id,
                old_values=old_values,
                new_values=new_values,
                description=f"{action.title()} portfolio {portfolio.name}",
            )
        )

    async def list(
        self,
        user: User,
        *,
        skip: int = 0,
        limit: int = 100,
        status: PortfolioStatus | None = None,
        search: str | None = None,
    ) -> tuple[list[PortfolioResponse], int]:
        rows, total = await self.repo.list_visible(
            user_id=user.id,
            is_admin=_is_admin(user),
            skip=skip,
            limit=limit,
            status=status,
            search=search,
        )
        return [self._response(row[0], row[1], row[2], user) for row in rows], total

    async def _get_owned(self, portfolio_id: int, user: User):
        portfolio = await self.repo.get_active(portfolio_id)
        if portfolio is None:
            raise NotFoundException("Portfolio not found")
        if not _is_admin(user) and portfolio.owner_id != user.id:
            raise ForbiddenException("You do not have access to this portfolio")
        row = await self.repo.get_visible_with_metrics(
            portfolio_id, user.id, _is_admin(user)
        )
        if row is None:
            raise NotFoundException("Portfolio not found")
        return row

    async def get(self, portfolio_id: int, user: User) -> PortfolioDetailResponse:
        portfolio, project_count, progress_percent = await self._get_owned(portfolio_id, user)
        projects = await self.repo.list_active_projects(portfolio_id)
        base = self._response(portfolio, project_count, progress_percent, user)
        return PortfolioDetailResponse(
            **base.model_dump(),
            projects=[
                PortfolioProjectSummary(
                    id=project.id,
                    name=project.name,
                    status=project.status.value,
                    methodology=project.methodology.value,
                    start_date=project.start_date,
                    end_date=project.end_date,
                    progress_percent=project.progress,
                    budget=project.budget,
                )
                for project in projects
            ],
        )

    async def create(self, data: PortfolioCreate, owner: User) -> PortfolioResponse:
        portfolio = Portfolio(
            name=data.name,
            description=data.description,
            start_date=data.start_date,
            end_date=data.end_date,
            budget=data.budget,
            currency=data.currency,
            owner_id=owner.id,
        )
        portfolio = await self.repo.create(portfolio)
        self._audit(
            owner.id,
            "CREATE",
            portfolio,
            new_values={
                "name": portfolio.name,
                "status": portfolio.status.value,
                "owner_id": portfolio.owner_id,
            },
        )
        return self._response(portfolio, 0, 0, owner)

    async def update(
        self, portfolio_id: int, data: PortfolioUpdate, user: User
    ) -> PortfolioResponse:
        portfolio, project_count, progress_percent = await self._get_owned(portfolio_id, user)
        changes = data.model_dump(exclude_unset=True)
        if not changes:
            return self._response(portfolio, project_count, progress_percent, user)
        for required_field in ("name", "currency", "status"):
            if required_field in changes and changes[required_field] is None:
                label = required_field.replace("_", " ").title()
                raise BadRequestException(f"{label} cannot be null")

        start_date = changes.get("start_date", portfolio.start_date)
        end_date = changes.get("end_date", portfolio.end_date)
        if start_date and end_date and end_date < start_date:
            raise BadRequestException("End date must be on or after start date")

        old_values = {field: _json_value(getattr(portfolio, field)) for field in changes}
        await self.repo.update(portfolio, changes)
        self._audit(
            user.id,
            "UPDATE",
            portfolio,
            old_values=old_values,
            new_values={field: _json_value(value) for field, value in changes.items()},
        )
        return self._response(portfolio, project_count, progress_percent, user)

    async def delete(self, portfolio_id: int, user: User) -> None:
        portfolio, _, _ = await self._get_owned(portfolio_id, user)
        now = datetime.now(UTC)
        await self.repo.soft_delete(portfolio, now)
        self._audit(
            user.id,
            "DELETE",
            portfolio,
            old_values={"deleted_at": None},
            new_values={"deleted_at": now.isoformat()},
        )


async def get_portfolio_service(db: Annotated[AsyncSession, Depends(get_db)]) -> PortfolioService:
    return PortfolioService(db)


PortfolioServiceDep = Annotated[PortfolioService, Depends(get_portfolio_service)]
