from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Annotated, Optional
from zoneinfo import ZoneInfo

from fastapi import Depends
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.exceptions import BadRequestException, ConflictException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.assignment import Assignment
from app.models.associations import project_members
from app.models.leave import Leave, LeaveStatus
from app.models.task import Task
from app.models.user import User
from app.models.worklog import Worklog
from app.schemas.task import (
    AssignmentCreate,
    AssignmentMutationResponse,
    AssignmentResponse,
    ResourceWarning,
    WorklogCreate,
    WorklogProjectSummary,
    WorklogResponse,
    WorklogUpdate,
)
from app.services.phase2_common import add_audit, get_project_context, get_task_context, serialize_model
from app.services.scheduling_service import recalculate_task_hours


class ResourceService:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def _local_today() -> date:
        return datetime.now(ZoneInfo(settings.APP_TIMEZONE)).date()

    async def _assignment_response(self, item: Assignment, task: Optional[Task] = None):
        if getattr(item, "user", None) is None:
            await self.db.refresh(item, ["user"])
        task = task or await self.db.get(Task, item.task_id)
        return AssignmentResponse(
            **AssignmentResponse.model_validate(item).model_dump(exclude={"user", "is_primary"}),
            user=item.user,
            is_primary=bool(task and task.assignee_id == item.user_id),
        )

    async def _member(self, project_id: int, user_id: int) -> bool:
        return bool(
            await self.db.scalar(
                select(project_members.c.user_id).where(
                    project_members.c.project_id == project_id,
                    project_members.c.user_id == user_id,
                )
            )
        )

    @staticmethod
    def _range(item: Assignment, task: Task) -> tuple[date, date]:
        start = item.start_date or task.start_date or date.today()
        end = item.end_date or task.due_date or start
        return start, max(start, end)

    async def workload_warnings(
        self, user_id: int, start: date, end: date
    ) -> list[ResourceWarning]:
        rows = (
            await self.db.execute(
                select(Assignment, Task)
                .join(Task, Task.id == Assignment.task_id)
                .where(
                    Assignment.user_id == user_id,
                    or_(Assignment.start_date.is_(None), Assignment.start_date <= end),
                    or_(Assignment.end_date.is_(None), Assignment.end_date >= start),
                )
            )
        ).all()
        approved_leaves = list(
            (
                await self.db.scalars(
                    select(Leave).where(
                        Leave.user_id == user_id,
                        Leave.status == LeaveStatus.APPROVED,
                        Leave.start_date <= end,
                        Leave.end_date >= start,
                    )
                )
            ).all()
        )
        daily_hours: dict[date, float] = defaultdict(float)
        task_ids: dict[date, list[int]] = defaultdict(list)
        current = start
        while current <= end:
            for assignment, task in rows:
                item_start, item_end = self._range(assignment, task)
                if item_start <= current <= item_end:
                    days = max(1, (item_end - item_start).days + 1)
                    daily_hours[current] += assignment.allocated_hours / days
                    task_ids[current].append(task.id)
            current += timedelta(days=1)
        warnings = []
        current = start
        while current <= end:
            on_leave = any(leave.start_date <= current <= leave.end_date for leave in approved_leaves)
            if on_leave:
                warnings.append(
                    ResourceWarning(
                        user_id=user_id, date=current, reason="on_leave",
                        total_hours=round(daily_hours[current], 2),
                        max_hours=settings.MAX_DAILY_WORK_HOURS,
                        task_ids=sorted(set(task_ids[current])),
                    )
                )
            elif daily_hours[current] > settings.MAX_DAILY_WORK_HOURS:
                warnings.append(
                    ResourceWarning(
                        user_id=user_id, date=current, reason="overloaded",
                        total_hours=round(daily_hours[current], 2),
                        max_hours=settings.MAX_DAILY_WORK_HOURS,
                        task_ids=sorted(set(task_ids[current])),
                    )
                )
            current += timedelta(days=1)
        return warnings

    async def create_assignment(self, task_id: int, data: AssignmentCreate, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        if not context.is_admin and context.role != "PM":
            raise ForbiddenException("Only PM can manage assignments")
        if not await self._member(task.project_id, data.user_id):
            raise BadRequestException("Assignee must be a project member")
        existing = await self.db.scalar(
            select(Assignment).where(
                Assignment.task_id == task.id, Assignment.user_id == data.user_id
            )
        )
        if existing:
            raise ConflictException("User is already assigned to this task")
        values = data.model_dump(exclude={"is_primary"})
        values["start_date"] = values["start_date"] or task.start_date
        values["end_date"] = values["end_date"] or task.due_date
        item = Assignment(task_id=task.id, **values)
        self.db.add(item)
        await self.db.flush()
        if data.is_primary:
            task.assignee_id = data.user_id
        add_audit(self.db, user.id, "CREATE", "Assignment", item.id, new_values=serialize_model(item))
        start, end = self._range(item, task)
        warnings = await self.workload_warnings(item.user_id, start, end)
        return AssignmentMutationResponse(
            assignment=await self._assignment_response(item, task), warnings=warnings
        )

    async def delete_assignment(self, assignment_id: int, user: User) -> None:
        item = await self.db.get(Assignment, assignment_id)
        if item is None:
            raise NotFoundException("Assignment not found")
        task, context = await get_task_context(self.db, item.task_id, user)
        if not context.is_admin and context.role != "PM":
            raise ForbiddenException("Only PM can manage assignments")
        if task.assignee_id == item.user_id:
            task.assignee_id = None
        snapshot = serialize_model(item)
        await self.db.delete(item)
        add_audit(self.db, user.id, "DELETE", "Assignment", assignment_id, old_values=snapshot)

    async def my_assignments(self, user: User):
        items = list(
            (
                await self.db.scalars(
                    select(Assignment)
                    .options(selectinload(Assignment.user), selectinload(Assignment.task))
                    .where(Assignment.user_id == user.id)
                    .order_by(Assignment.id.desc())
                )
            ).all()
        )
        return [await self._assignment_response(item, item.task) for item in items]

    async def resource_leveling(
        self, project_id: int, user: User, start: Optional[date], end: Optional[date]
    ):
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA"}:
            raise ForbiddenException("Only PM or BA can view resource leveling")
        start = start or context.project.start_date or self._local_today()
        end = end or context.project.end_date or start
        if end < start:
            raise BadRequestException("End date must be on or after start date")
        user_ids = list(
            (
                await self.db.scalars(
                    select(Assignment.user_id)
                    .join(Task, Task.id == Assignment.task_id)
                    .where(Task.project_id == project_id)
                    .distinct()
                )
            ).all()
        )
        warnings = []
        for user_id in user_ids:
            warnings.extend(await self.workload_warnings(user_id, start, end))
        return warnings

    async def _can_log(self, task: Task, user: User, role: str, admin: bool) -> bool:
        if admin or role in {"PM", "BA"}:
            return True
        if role != "Member":
            return False
        if task.assignee_id == user.id:
            return True
        return bool(
            await self.db.scalar(
                select(Assignment.id).where(
                    Assignment.task_id == task.id, Assignment.user_id == user.id
                )
            )
        )

    async def _worklog_response(self, item: Worklog):
        if getattr(item, "user", None) is None:
            await self.db.refresh(item, ["user"])
        return WorklogResponse(
            **WorklogResponse.model_validate(item).model_dump(exclude={"user", "is_running"}),
            user=item.user,
            is_running=item.start_time is not None and item.end_time is None,
        )

    async def create_worklog(self, task_id: int, data: WorklogCreate, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        if not await self._can_log(task, user, context.role, context.is_admin):
            raise ForbiddenException("You cannot log work for this task")
        if data.log_date > self._local_today():
            raise BadRequestException("Worklog date cannot be in the future")
        values = data.model_dump()
        if data.start_time and data.end_time:
            values["hours"] = round((data.end_time - data.start_time).total_seconds() / 3600, 4)
            if values["hours"] > 24:
                raise BadRequestException("A single worklog cannot exceed 24 hours")
        item = Worklog(task_id=task.id, user_id=user.id, **values)
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Worklog", item.id, new_values=serialize_model(item))
        await recalculate_task_hours(self.db, task.id)
        return await self._worklog_response(item)

    async def list_task_worklogs(self, task_id: int, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        if not context.is_admin and context.role not in {"PM", "BA", "Member"}:
            raise ForbiddenException("You cannot view worklogs")
        stmt = select(Worklog).options(selectinload(Worklog.user)).where(Worklog.task_id == task.id)
        if context.role == "Member" and not context.is_admin:
            stmt = stmt.where(Worklog.user_id == user.id)
        items = list((await self.db.scalars(stmt.order_by(Worklog.log_date.desc(), Worklog.id.desc()))).all())
        return [await self._worklog_response(item) for item in items]

    async def project_worklogs(
        self, project_id: int, user: User, user_id: Optional[int], start: Optional[date], end: Optional[date]
    ):
        context = await get_project_context(self.db, project_id, user)
        if not context.is_admin and context.role not in {"PM", "BA", "Member"}:
            raise ForbiddenException("You cannot view worklogs")
        stmt = (
            select(Worklog)
            .join(Task, Task.id == Worklog.task_id)
            .options(selectinload(Worklog.user))
            .where(Task.project_id == project_id)
        )
        if context.role == "Member" and not context.is_admin:
            user_id = user.id
        if user_id is not None:
            stmt = stmt.where(Worklog.user_id == user_id)
        if start:
            stmt = stmt.where(Worklog.log_date >= start)
        if end:
            stmt = stmt.where(Worklog.log_date <= end)
        items = list((await self.db.scalars(stmt.order_by(Worklog.log_date.desc(), Worklog.id.desc()))).all())
        responses = [await self._worklog_response(item) for item in items]
        by_user: dict[int, float] = defaultdict(float)
        for item in items:
            by_user[item.user_id] += item.hours
        return WorklogProjectSummary(
            items=responses,
            total_hours=round(sum(item.hours for item in items), 4),
            by_user={key: round(value, 4) for key, value in by_user.items()},
        )

    async def _owned_worklog(self, worklog_id: int, user: User):
        item = await self.db.get(Worklog, worklog_id)
        if item is None:
            raise NotFoundException("Worklog not found")
        task, context = await get_task_context(self.db, item.task_id, user)
        if not context.is_admin and item.user_id != user.id:
            raise ForbiddenException("You can only modify your own worklogs")
        return item, task, context

    async def update_worklog(self, worklog_id: int, data: WorklogUpdate, user: User):
        item, task, _ = await self._owned_worklog(worklog_id, user)
        if item.start_time is not None and item.end_time is None:
            raise ConflictException("Stop the running timer before editing it")
        values = data.model_dump(exclude_unset=True)
        log_date = values.get("log_date", item.log_date)
        if log_date > self._local_today():
            raise BadRequestException("Worklog date cannot be in the future")
        start = values.get("start_time", item.start_time)
        end = values.get("end_time", item.end_time)
        if (start is None) != (end is None) or (start and end and end <= start):
            raise BadRequestException("A valid start/end time range is required")
        if start and end:
            values["hours"] = round((end - start).total_seconds() / 3600, 4)
            if values["hours"] > 24:
                raise BadRequestException("A single worklog cannot exceed 24 hours")
        old = {key: getattr(item, key) for key in values}
        for key, value in values.items():
            setattr(item, key, value)
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Worklog", item.id, old_values=old, new_values=values)
        await recalculate_task_hours(self.db, task.id)
        return await self._worklog_response(item)

    async def delete_worklog(self, worklog_id: int, user: User):
        item, task, _ = await self._owned_worklog(worklog_id, user)
        snapshot = serialize_model(item)
        await self.db.delete(item)
        await self.db.flush()
        add_audit(self.db, user.id, "DELETE", "Worklog", worklog_id, old_values=snapshot)
        await recalculate_task_hours(self.db, task.id)

    async def start_timer(self, task_id: int, user: User):
        task, context = await get_task_context(self.db, task_id, user)
        if not await self._can_log(task, user, context.role, context.is_admin):
            raise ForbiddenException("You cannot start work for this task")
        active = await self.db.scalar(
            select(Worklog).where(
                Worklog.user_id == user.id,
                Worklog.start_time.is_not(None),
                Worklog.end_time.is_(None),
            )
        )
        if active:
            raise ConflictException("You already have a running timer")
        now = datetime.now(timezone.utc)
        item = Worklog(
            task_id=task.id,
            user_id=user.id,
            hours=0,
            log_date=now.astimezone(ZoneInfo(settings.APP_TIMEZONE)).date(),
            start_time=now,
        )
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "START_TIMER", "Worklog", item.id, new_values=serialize_model(item))
        return await self._worklog_response(item)

    async def stop_timer(self, worklog_id: int, user: User):
        item, task, _ = await self._owned_worklog(worklog_id, user)
        if item.start_time is None or item.end_time is not None:
            raise ConflictException("Worklog is not a running timer")
        now = datetime.now(timezone.utc)
        item.end_time = now
        item.hours = round(max(0, (now - item.start_time).total_seconds()) / 3600, 4)
        await self.db.flush()
        add_audit(self.db, user.id, "STOP_TIMER", "Worklog", item.id, new_values={"end_time": now, "hours": item.hours})
        await recalculate_task_hours(self.db, task.id)
        return await self._worklog_response(item)

    async def active_timer(self, user: User):
        item = await self.db.scalar(
            select(Worklog)
            .options(selectinload(Worklog.user))
            .where(
                Worklog.user_id == user.id,
                Worklog.start_time.is_not(None),
                Worklog.end_time.is_(None),
            )
        )
        return await self._worklog_response(item) if item else None


async def get_resource_service(db: Annotated[AsyncSession, Depends(get_db)]) -> ResourceService:
    return ResourceService(db)


ResourceServiceDep = Annotated[ResourceService, Depends(get_resource_service)]
