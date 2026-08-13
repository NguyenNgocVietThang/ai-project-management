from typing import List, Optional, Tuple
from sqlalchemy import func, select
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

    async def list_filtered(
        self,
        skip: int = 0,
        limit: int = 100,
        project_id: Optional[int] = None,
        sprint_id: Optional[int] = None,
        assignee_id: Optional[int] = None,
        status: Optional[str] = None,
    ) -> Tuple[List[Task], int]:
        stmt = select(Task)
        count_stmt = select(func.count()).select_from(Task)
        for column, value in (
            (Task.project_id, project_id),
            (Task.sprint_id, sprint_id),
            (Task.assignee_id, assignee_id),
            (Task.status, status),
        ):
            if value is not None:
                stmt = stmt.where(column == value)
                count_stmt = count_stmt.where(column == value)

        total = (await self.db.execute(count_stmt)).scalar_one()
        result = await self.db.execute(stmt.order_by(Task.id).offset(skip).limit(limit))
        return list(result.scalars().all()), total
