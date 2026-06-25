from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)

    async def get_by_pm(self, pm_id: int) -> List[Project]:
        result = await self.db.execute(select(Project).where(Project.pm_id == pm_id))
        return list(result.scalars().all())

    async def get_by_portfolio(self, portfolio_id: int) -> List[Project]:
        result = await self.db.execute(select(Project).where(Project.portfolio_id == portfolio_id))
        return list(result.scalars().all())
