from typing import Annotated, List, Optional, Tuple

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException
from app.db.session import get_db
from app.models.task import Task, TaskPriority, TaskStatus
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = TaskRepository(db)
        self.projects = ProjectRepository(db)
        self.users = UserRepository(db)

    async def list(
        self,
        skip: int = 0,
        limit: int = 100,
        project_id: Optional[int] = None,
        sprint_id: Optional[int] = None,
        assignee_id: Optional[int] = None,
        status: Optional[str] = None,
    ) -> Tuple[List[Task], int]:
        return await self.repo.list_filtered(
            skip=skip,
            limit=limit,
            project_id=project_id,
            sprint_id=sprint_id,
            assignee_id=assignee_id,
            status=status,
        )

    async def get(self, task_id: int) -> Task:
        task = await self.repo.get_by_id(task_id)
        if task is None:
            raise NotFoundException("Task not found")
        return task

    async def create(self, data: TaskCreate) -> Task:
        project = await self.projects.get_by_id(data.project_id)
        if project is None:
            raise NotFoundException("Project not found")

        if data.assignee_id is not None:
            assignee = await self.users.get_by_id(data.assignee_id)
            if assignee is None:
                raise NotFoundException("Assignee not found")

        try:
            priority = TaskPriority(data.priority)
        except ValueError:
            raise BadRequestException(f"Invalid priority: {data.priority}")

        task = Task(
            name=data.name,
            description=data.description,
            project_id=data.project_id,
            phase_id=data.phase_id,
            sprint_id=data.sprint_id,
            epic_id=data.epic_id,
            assignee_id=data.assignee_id,
            priority=priority,
            estimated_hours=data.estimated_hours,
            start_date=data.start_date,
            due_date=data.due_date,
        )
        return await self.repo.create(task)

    async def update(self, task_id: int, data: TaskUpdate) -> Task:
        task = await self.get(task_id)
        updates = data.model_dump(exclude_unset=True)

        if updates.get("assignee_id") is not None:
            assignee = await self.users.get_by_id(updates["assignee_id"])
            if assignee is None:
                raise NotFoundException("Assignee not found")

        if "status" in updates and updates["status"] is not None:
            try:
                updates["status"] = TaskStatus(updates["status"])
            except ValueError:
                raise BadRequestException(f"Invalid status: {updates['status']}")

        if "priority" in updates and updates["priority"] is not None:
            try:
                updates["priority"] = TaskPriority(updates["priority"])
            except ValueError:
                raise BadRequestException(f"Invalid priority: {updates['priority']}")

        return await self.repo.update(task, updates)

    async def delete(self, task_id: int) -> None:
        deleted = await self.repo.delete(task_id)
        if not deleted:
            raise NotFoundException("Task not found")


async def get_task_service(db: Annotated[AsyncSession, Depends(get_db)]) -> TaskService:
    return TaskService(db)


TaskServiceDep = Annotated[TaskService, Depends(get_task_service)]
