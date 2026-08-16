from datetime import date
from typing import Annotated, Optional

from fastapi import Depends
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import BadRequestException, ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.assignment import Assignment
from app.models.associations import project_members
from app.models.comment import Comment
from app.models.dependency import Dependency, DependencyType
from app.models.epic import Epic
from app.models.notification import NotificationType
from app.models.phase import Phase
from app.models.sprint import Sprint
from app.models.subtask import Subtask, SubtaskStatus
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.task import (
    AssignmentResponse,
    DependencyCreate,
    DependencyResponse,
    SubtaskCreate,
    SubtaskResponse,
    SubtaskUpdate,
    TaskBulkUpdate,
    TaskCapabilities,
    TaskCreate,
    TaskDetailResponse,
    TaskResponse,
    TaskStatusUpdate,
    TaskUpdate,
)
from app.services.phase2_common import add_audit, get_project_context, get_task_context, serialize_model
from app.services.scheduling_service import recalculate_project
from app.utils.cpm import CPMEdge, build_graph, topological_sort


STATUS_TRANSITIONS = {
    TaskStatus.TODO: {TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED},
    TaskStatus.IN_PROGRESS: {TaskStatus.TODO, TaskStatus.IN_REVIEW, TaskStatus.BLOCKED},
    TaskStatus.IN_REVIEW: {TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.BLOCKED},
    TaskStatus.DONE: {TaskStatus.IN_REVIEW},
    TaskStatus.BLOCKED: {TaskStatus.TODO, TaskStatus.IN_PROGRESS},
}


class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _assigned(self, task: Task, user_id: int) -> bool:
        if task.assignee_id == user_id:
            return True
        return bool(
            await self.db.scalar(
                select(Assignment.id).where(
                    Assignment.task_id == task.id, Assignment.user_id == user_id
                )
            )
        )

    async def _capabilities(self, task: Task, user: User, role: str, admin: bool):
        assigned = await self._assigned(task, user.id)
        manager = admin or role == "PM"
        editor = manager or role == "BA"
        return TaskCapabilities(
            can_update=editor,
            can_delete=manager,
            can_change_status=editor or (role == "Member" and assigned),
            can_manage_dependencies=editor,
            can_manage_assignments=manager,
            can_log_work=admin or role in {"PM", "BA"} or (role == "Member" and assigned),
            can_read_worklogs=admin or role in {"PM", "BA", "Member"},
        )

    async def _response(self, task: Task, user: User, role: str, admin: bool) -> TaskResponse:
        response = TaskResponse.model_validate(task)
        response.primary_assignee = getattr(task, "assignee", None)
        response.capabilities = await self._capabilities(task, user, role, admin)
        return response

    async def _validate_relations(self, project_id: int, values: dict) -> dict:
        phase = None
        if values.get("phase_id") is not None:
            phase = await self.db.get(Phase, values["phase_id"])
            if phase is None or phase.project_id != project_id:
                raise BadRequestException("Phase must belong to the task project")
        if values.get("sprint_id") is not None:
            sprint = await self.db.get(Sprint, values["sprint_id"])
            if sprint is None or sprint.project_id != project_id:
                raise BadRequestException("Sprint must belong to the task project")
            if sprint.phase_id is not None:
                if phase is not None and phase.id != sprint.phase_id:
                    raise BadRequestException("Task phase must match the sprint phase")
                values["phase_id"] = sprint.phase_id
        if values.get("epic_id") is not None:
            epic = await self.db.get(Epic, values["epic_id"])
            if epic is None or epic.project_id != project_id:
                raise BadRequestException("Epic must belong to the task project")
        primary_id = values.pop("primary_assignee_id", None) if "primary_assignee_id" in values else ...
        if primary_id is not ...:
            if primary_id is not None:
                member = await self.db.scalar(
                    select(project_members.c.user_id).where(
                        project_members.c.project_id == project_id,
                        project_members.c.user_id == primary_id,
                    )
                )
                if member is None:
                    raise BadRequestException("Primary assignee must be a project member")
            values["assignee_id"] = primary_id
        return values

    @staticmethod
    def _validate_dates(values: dict, task: Optional[Task] = None) -> None:
        start = values.get("start_date", task.start_date if task else None)
        due = values.get("due_date", task.due_date if task else None)
        if start and due and due < start:
            raise BadRequestException("Due date must be on or after start date")

    async def list(
        self,
        project_id: int,
        user: User,
        *,
        page: int = 1,
        page_size: int = 50,
        search: Optional[str] = None,
        phase_id: Optional[int] = None,
        sprint_id: Optional[int] = None,
        epic_id: Optional[int] = None,
        assignee_id: Optional[int] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        labels: Optional[list[str]] = None,
        due_date_from: Optional[date] = None,
        due_date_to: Optional[date] = None,
    ):
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA", "PO", "Member"}:
            raise ForbiddenException("Task access is not allowed for this project role")
        filters = [Task.project_id == project_id]
        if search:
            pattern = f"%{search.strip()}%"
            filters.append(or_(Task.name.ilike(pattern), Task.description.ilike(pattern)))
        for column, value in (
            (Task.phase_id, phase_id), (Task.sprint_id, sprint_id), (Task.epic_id, epic_id),
            (Task.status, status), (Task.priority, priority),
        ):
            if value is not None:
                filters.append(column == value)
        if assignee_id is not None:
            filters.append(
                or_(
                    Task.assignee_id == assignee_id,
                    Task.id.in_(select(Assignment.task_id).where(Assignment.user_id == assignee_id)),
                )
            )
        if labels:
            filters.append(Task.labels.contains(labels))
        if due_date_from:
            filters.append(Task.due_date >= due_date_from)
        if due_date_to:
            filters.append(Task.due_date <= due_date_to)
        total = int(await self.db.scalar(select(func.count()).select_from(Task).where(*filters)) or 0)
        tasks = list(
            (
                await self.db.scalars(
                    select(Task)
                    .options(selectinload(Task.assignee), selectinload(Task.assignments))
                    .where(*filters)
                    .order_by(Task.id)
                    .offset((page - 1) * page_size)
                    .limit(page_size)
                )
            ).all()
        )
        items = [await self._response(task, user, context.role, context.is_admin) for task in tasks]
        return PaginatedResponse(
            items=items, total=total, page=page, page_size=page_size,
            total_pages=(total + page_size - 1) // page_size if total else 0,
        )

    async def _loaded_task(self, task_id: int) -> Task:
        task = await self.db.scalar(
            select(Task)
            .options(
                selectinload(Task.assignee),
                selectinload(Task.subtasks),
                selectinload(Task.assignments).selectinload(Assignment.user),
                selectinload(Task.predecessor_links).selectinload(Dependency.predecessor),
                selectinload(Task.successor_links).selectinload(Dependency.successor),
                selectinload(Task.comments),
            )
            .where(Task.id == task_id)
        )
        if task is None:
            raise NotFoundException("Task not found")
        return task

    async def get(self, task_id: int, user: User) -> TaskDetailResponse:
        task = await self._loaded_task(task_id)
        context = await get_project_context(self.db, task.project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA", "PO", "Member"}:
            raise ForbiddenException("Task access is not allowed for this project role")
        base = await self._response(task, user, context.role, context.is_admin)
        assignments = [
            AssignmentResponse(
                **AssignmentResponse.model_validate(item).model_dump(exclude={"user", "is_primary"}),
                user=item.user,
                is_primary=item.user_id == task.assignee_id,
            )
            for item in task.assignments
        ]
        predecessors = [
            DependencyResponse(
                **DependencyResponse.model_validate(dep).model_dump(),
                predecessor_name=dep.predecessor.name,
                successor_name=task.name,
            )
            for dep in task.predecessor_links
        ]
        successors = [
            DependencyResponse(
                **DependencyResponse.model_validate(dep).model_dump(),
                predecessor_name=task.name,
                successor_name=dep.successor.name,
            )
            for dep in task.successor_links
        ]
        return TaskDetailResponse(
            **base.model_dump(),
            subtasks=[SubtaskResponse.model_validate(item) for item in task.subtasks],
            assignments=assignments,
            predecessor_dependencies=predecessors,
            successor_dependencies=successors,
            total_logged_hours=task.actual_hours,
            comments_count=len(task.comments),
        )

    async def create(self, project_id: int, data: TaskCreate, user: User) -> TaskResponse:
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can create tasks")
        values = await self._validate_relations(project_id, data.model_dump())
        self._validate_dates(values)
        values["priority"] = TaskPriority(values["priority"])
        task = Task(project_id=project_id, **values)
        self.db.add(task)
        await self.db.flush()
        if task.assignee_id is not None:
            self.db.add(
                Assignment(
                    task_id=task.id,
                    user_id=task.assignee_id,
                    allocated_hours=task.estimated_hours or 0,
                    start_date=task.start_date,
                    end_date=task.due_date,
                )
            )
            # Phase 3.3 – notify the assignee
            if task.assignee_id != user.id:
                from app.services.notification_service import NotificationService
                await NotificationService.push(
                    self.db,
                    user_id=task.assignee_id,
                    title="New task assigned",
                    message=f"You have been assigned to task '{task.name}'",
                    ntype=NotificationType.TASK_ASSIGNED,
                    link=f"/projects/{project_id}/tasks/{task.id}",
                    entity_type="Task",
                    entity_id=task.id,
                )
        add_audit(self.db, user.id, "CREATE", "Task", task.id, new_values=serialize_model(task))
        await recalculate_project(self.db, project_id)
        task = await self._loaded_task(task.id)
        return await self._response(task, user, context.role, context.is_admin)

    async def update(self, task_id: int, data: TaskUpdate, user: User) -> TaskResponse:
        task, context = await get_task_context(self.db, task_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can update task details")
        values = await self._validate_relations(task.project_id, data.model_dump(exclude_unset=True))
        if "phase_id" in values and "sprint_id" not in values and task.sprint_id is not None:
            current_sprint = await self.db.get(Sprint, task.sprint_id)
            if current_sprint and current_sprint.phase_id != values["phase_id"]:
                values["sprint_id"] = None
        self._validate_dates(values, task)
        old = {key: getattr(task, key) for key in values}
        if "priority" in values and values["priority"] is not None:
            values["priority"] = TaskPriority(values["priority"])
        for key, value in values.items():
            setattr(task, key, value)
        new_assignee_id = values.get("assignee_id")
        old_assignee_id = old.get("assignee_id")
        if new_assignee_id is not None:
            assignment = await self.db.scalar(
                select(Assignment).where(
                    Assignment.task_id == task.id,
                    Assignment.user_id == new_assignee_id,
                )
            )
            if assignment is None:
                self.db.add(
                    Assignment(
                        task_id=task.id,
                        user_id=new_assignee_id,
                        allocated_hours=task.estimated_hours or 0,
                        start_date=task.start_date,
                        end_date=task.due_date,
                    )
                )
        await self.db.flush()
        # Phase 3.3 – notify new assignee if assignee changed
        if (
            "assignee_id" in values
            and new_assignee_id is not None
            and new_assignee_id != old_assignee_id
            and new_assignee_id != user.id
        ):
            from app.services.notification_service import NotificationService
            await NotificationService.push(
                self.db,
                user_id=new_assignee_id,
                title="Task assigned to you",
                message=f"You have been assigned to task '{task.name}'",
                ntype=NotificationType.TASK_ASSIGNED,
                link=f"/projects/{task.project_id}/tasks/{task.id}",
                entity_type="Task",
                entity_id=task.id,
            )
        add_audit(self.db, user.id, "UPDATE", "Task", task.id, old_values=old, new_values=values)
        await recalculate_project(self.db, task.project_id)
        loaded = await self._loaded_task(task.id)
        return await self._response(loaded, user, context.role, context.is_admin)

    async def change_status(self, task_id: int, data: TaskStatusUpdate, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        capabilities = await self._capabilities(task, user, context.role, context.is_admin)
        if not capabilities.can_change_status:
            raise ForbiddenException("You cannot change this task status")
        target = TaskStatus(data.status)
        if target != task.status and target not in STATUS_TRANSITIONS[task.status]:
            raise ConflictException(f"Cannot transition task from {task.status.value} to {target.value}")
        old = task.status
        task.status = target
        task.progress = 100.0 if target == TaskStatus.DONE else min(task.progress, 99.0)
        await self.db.flush()
        add_audit(self.db, user.id, "STATUS", "Task", task.id, old_values={"status": old}, new_values={"status": target})
        await recalculate_project(self.db, task.project_id)
        loaded = await self._loaded_task(task.id)
        return await self._response(loaded, user, context.role, context.is_admin)

    async def bulk_update(self, project_id: int, data: TaskBulkUpdate, user: User):
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can bulk update tasks")
        results = []
        for task_id in data.task_ids:
            task = await self.db.get(Task, task_id)
            if task is None or task.project_id != project_id:
                raise BadRequestException(f"Task {task_id} does not belong to the project")
            if data.status is not None:
                results.append(await self.change_status(task_id, TaskStatusUpdate(status=data.status), user))
            else:
                update_data = TaskUpdate(**data.model_dump(exclude={"task_ids", "status"}, exclude_none=True))
                results.append(await self.update(task_id, update_data, user))
        return results

    async def delete(self, task_id: int, user: User) -> None:
        task, context = await get_task_context(self.db, task_id, user)
        if not context.is_admin and context.role != "PM":
            raise ForbiddenException("Only PM can delete tasks")
        project_id = task.project_id
        snapshot = serialize_model(task)
        await self.db.delete(task)
        await self.db.flush()
        add_audit(self.db, user.id, "DELETE", "Task", task_id, old_values=snapshot)
        await recalculate_project(self.db, project_id)

    async def list_subtasks(self, task_id: int, user: User):
        await get_task_context(self.db, task_id, user)
        return [SubtaskResponse.model_validate(item) for item in (await self.db.scalars(select(Subtask).where(Subtask.task_id == task_id).order_by(Subtask.id))).all()]

    async def create_subtask(self, task_id: int, data: SubtaskCreate, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        capabilities = await self._capabilities(task, user, context.role, context.is_admin)
        if not (capabilities.can_update or capabilities.can_change_status):
            raise ForbiddenException("You cannot add subtasks to this task")
        values = data.model_dump()
        values["status"] = SubtaskStatus(values["status"])
        values["is_completed"] = values["status"] == SubtaskStatus.DONE
        item = Subtask(task_id=task_id, **values)
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Subtask", item.id, new_values=serialize_model(item))
        return SubtaskResponse.model_validate(item)

    async def update_subtask(self, item_id: int, data: SubtaskUpdate, user: User):
        item = await self.db.get(Subtask, item_id)
        if item is None:
            raise NotFoundException("Subtask not found")
        task, context = await get_task_context(self.db, item.task_id, user)
        capabilities = await self._capabilities(task, user, context.role, context.is_admin)
        if not (capabilities.can_update or capabilities.can_change_status):
            raise ForbiddenException("You cannot update this subtask")
        values = data.model_dump(exclude_unset=True)
        old = {key: getattr(item, key) for key in values}
        if "status" in values:
            values["status"] = SubtaskStatus(values["status"])
            values["is_completed"] = values["status"] == SubtaskStatus.DONE
        for key, value in values.items():
            setattr(item, key, value)
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Subtask", item.id, old_values=old, new_values=values)
        return SubtaskResponse.model_validate(item)

    async def delete_subtask(self, item_id: int, user: User):
        item = await self.db.get(Subtask, item_id)
        if item is None:
            raise NotFoundException("Subtask not found")
        task, context = await get_task_context(self.db, item.task_id, user)
        capabilities = await self._capabilities(task, user, context.role, context.is_admin)
        if not (capabilities.can_update or capabilities.can_change_status):
            raise ForbiddenException("You cannot delete this subtask")
        snapshot = serialize_model(item)
        await self.db.delete(item)
        add_audit(self.db, user.id, "DELETE", "Subtask", item_id, old_values=snapshot)

    async def add_dependency(self, task_id: int, data: DependencyCreate, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can manage dependencies")
        predecessor = await self.db.get(Task, data.depends_on_task_id)
        if predecessor is None or predecessor.project_id != task.project_id:
            raise BadRequestException("Dependency tasks must belong to the same project")
        if predecessor.id == task.id:
            raise BadRequestException("Task cannot depend on itself")
        existing = await self.db.scalar(
            select(Dependency).where(
                Dependency.predecessor_id == predecessor.id,
                Dependency.successor_id == task.id,
            )
        )
        if existing:
            raise ConflictException("Dependency already exists")
        tasks = list((await self.db.scalars(select(Task).where(Task.project_id == task.project_id))).all())
        task_ids = [item.id for item in tasks]
        dependencies = list((await self.db.scalars(select(Dependency).where(Dependency.predecessor_id.in_(task_ids), Dependency.successor_id.in_(task_ids)))).all())
        edges = [
            CPMEdge(dep.predecessor_id, dep.successor_id, dep.dependency_type.value, dep.lag_days)
            for dep in dependencies
        ] + [CPMEdge(predecessor.id, task.id, data.dependency_type, data.lag_days)]
        try:
            nodes = build_graph([(item.id, 1.0) for item in tasks], edges)
            topological_sort(nodes)
        except ValueError as error:
            raise ConflictException(str(error)) from error
        item = Dependency(
            predecessor_id=predecessor.id,
            successor_id=task.id,
            dependency_type=DependencyType(data.dependency_type),
            lag_days=data.lag_days,
        )
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Dependency", item.id, new_values=serialize_model(item))
        await recalculate_project(self.db, task.project_id)
        return DependencyResponse(
            **DependencyResponse.model_validate(item).model_dump(),
            predecessor_name=predecessor.name,
            successor_name=task.name,
        )

    async def delete_dependency(self, dependency_id: int, user: User):
        item = await self.db.get(Dependency, dependency_id)
        if item is None:
            raise NotFoundException("Dependency not found")
        successor = await self.db.get(Task, item.successor_id)
        context = await get_project_context(self.db, successor.project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can manage dependencies")
        snapshot = serialize_model(item)
        await self.db.delete(item)
        await self.db.flush()
        add_audit(self.db, user.id, "DELETE", "Dependency", dependency_id, old_values=snapshot)
        await recalculate_project(self.db, successor.project_id)

    async def list_dependencies(self, project_id: int, user: User):
        await get_project_context(self.db, project_id, user)
        tasks = list((await self.db.scalars(select(Task).where(Task.project_id == project_id))).all())
        task_map = {task.id: task for task in tasks}
        if not task_map:
            return []
        items = list((await self.db.scalars(select(Dependency).where(Dependency.predecessor_id.in_(task_map), Dependency.successor_id.in_(task_map)).order_by(Dependency.id))).all())
        return [
            DependencyResponse(
                **DependencyResponse.model_validate(item).model_dump(),
                predecessor_name=task_map[item.predecessor_id].name,
                successor_name=task_map[item.successor_id].name,
            )
            for item in items
        ]


async def get_task_service(db: Annotated[AsyncSession, Depends(get_db)]) -> TaskService:
    return TaskService(db)


TaskServiceDep = Annotated[TaskService, Depends(get_task_service)]
