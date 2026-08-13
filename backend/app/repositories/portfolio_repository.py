from datetime import datetime
from typing import Optional

from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.portfolio import Portfolio, PortfolioStatus
from app.models.project import Project
from app.repositories.base_repository import BaseRepository


class PortfolioRepository(BaseRepository[Portfolio]):
    def __init__(self, db: AsyncSession):
        super().__init__(Portfolio, db)

    @staticmethod
    def _metrics_statement():
        return (
            select(
                Portfolio,
                func.count(Project.id).label("project_count"),
                func.coalesce(func.avg(Project.progress), 0.0).label("progress_percent"),
            )
            .outerjoin(
                Project,
                and_(Project.portfolio_id == Portfolio.id, Project.deleted_at.is_(None)),
            )
            .where(Portfolio.deleted_at.is_(None))
            .group_by(Portfolio.id)
        )

    async def list_visible(
        self,
        *,
        user_id: int,
        is_admin: bool,
        skip: int,
        limit: int,
        status: Optional[PortfolioStatus] = None,
        search: Optional[str] = None,
    ):
        stmt = self._metrics_statement()
        count_stmt = select(func.count()).select_from(Portfolio).where(
            Portfolio.deleted_at.is_(None)
        )
        if not is_admin:
            stmt = stmt.where(Portfolio.owner_id == user_id)
            count_stmt = count_stmt.where(Portfolio.owner_id == user_id)
        if status is not None:
            stmt = stmt.where(Portfolio.status == status)
            count_stmt = count_stmt.where(Portfolio.status == status)
        if search:
            pattern = f"%{search.strip()}%"
            search_filter = or_(
                Portfolio.name.ilike(pattern),
                Portfolio.description.ilike(pattern),
            )
            stmt = stmt.where(search_filter)
            count_stmt = count_stmt.where(search_filter)

        total = (await self.db.execute(count_stmt)).scalar_one()
        rows = (
            await self.db.execute(
                stmt.order_by(Portfolio.created_at.desc()).offset(skip).limit(limit)
            )
        ).all()
        return rows, total

    async def get_visible_with_metrics(self, portfolio_id: int, user_id: int, is_admin: bool):
        stmt = self._metrics_statement().where(Portfolio.id == portfolio_id)
        if not is_admin:
            stmt = stmt.where(Portfolio.owner_id == user_id)
        return (await self.db.execute(stmt)).one_or_none()

    async def get_active(self, portfolio_id: int) -> Optional[Portfolio]:
        result = await self.db.execute(
            select(Portfolio).where(
                Portfolio.id == portfolio_id,
                Portfolio.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()

    async def list_active_projects(self, portfolio_id: int):
        result = await self.db.execute(
            select(Project)
            .where(Project.portfolio_id == portfolio_id, Project.deleted_at.is_(None))
            .order_by(Project.created_at.desc())
        )
        return list(result.scalars().all())

    async def soft_delete(self, portfolio: Portfolio, deleted_at: datetime) -> None:
        portfolio.deleted_at = deleted_at
        await self.db.execute(
            update(Project)
            .where(Project.portfolio_id == portfolio.id, Project.deleted_at.is_(None))
            .values(deleted_at=deleted_at)
        )
        await self.db.flush()
