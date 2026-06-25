from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task
from app.repositories.base_repository import BaseRepository


class TaskRepository(BaseRepository[Task]):
    def __init__(self, db: AsyncSession):
        super().__init__(Task, db)

    async def get_by_project(self, project_id: int) -> List[Task]:
        result = await self.db.execute(select(Task).where(Task.project_id == project_id))
        return list(result.scalars().all())

    async def get_critical_tasks(self, project_id: int) -> List[Task]:
        result = await self.db.execute(
            select(Task).where(Task.project_id == project_id, Task.is_critical == True)
        )
        return list(result.scalars().all())
