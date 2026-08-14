from datetime import datetime, timezone
from typing import Annotated, Optional, Type, TypeVar

from fastapi import Depends
from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.db.session import get_db
from app.models.assignment import Assignment
from app.models.comment import Comment
from app.models.dependency import Dependency
from app.models.epic import Epic, EpicStatus
from app.models.milestone import Milestone, MilestoneStatus
from app.models.phase import Phase, PhaseStatus
from app.models.sprint import Sprint, SprintStatus
from app.models.subtask import Subtask
from app.models.task import Task
from app.models.user import User
from app.models.worklog import Worklog
from app.schemas.task import TaskCapabilities, TaskResponse
from app.schemas.wbs import (
    EpicCreate,
    EpicResponse,
    EpicUpdate,
    MilestoneCreate,
    MilestoneResponse,
    MilestoneUpdate,
    PhaseCreate,
    PhaseDeleteImpact,
    PhaseNode,
    PhaseResponse,
    PhaseUpdate,
    SprintCreate,
    SprintNode,
    SprintResponse,
    SprintUpdate,
    WBSTree,
)
from app.services.phase2_common import (
    add_audit,
    get_project_context,
    require_project_roles,
    serialize_model,
)
from app.services.scheduling_service import recalculate_project

ModelT = TypeVar("ModelT")


class WBSService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _project_item(self, model: Type[ModelT], item_id: int) -> ModelT:
        item = await self.db.get(model, item_id)
        if item is None:
            raise NotFoundException(f"{model.__name__} not found")
        return item

    async def list_phases(self, project_id: int, user: User) -> list[PhaseResponse]:
        await get_project_context(self.db, project_id, user)
        items = list(
            (
                await self.db.scalars(
                    select(Phase)
                    .where(Phase.project_id == project_id)
                    .order_by(Phase.order_index, Phase.id)
                )
            ).all()
        )
        return [PhaseResponse.model_validate(item) for item in items]

    async def get_phase(self, item_id: int, user: User):
        item = await self._project_item(Phase, item_id)
        await get_project_context(self.db, item.project_id, user)
        return PhaseResponse.model_validate(item)

    async def create_phase(self, project_id: int, data: PhaseCreate, user: User):
        await require_project_roles(self.db, project_id, user, "PM")
        order_index = data.order_index
        if order_index is None:
            order_index = int(
                await self.db.scalar(
                    select(func.coalesce(func.max(Phase.order_index), -1)).where(
                        Phase.project_id == project_id
                    )
                )
            ) + 1
        item = Phase(project_id=project_id, **data.model_dump(exclude={"order_index"}), order_index=order_index)
        self.db.add(item)
        await self.db.flush()
        add_audit(
            self.db, user.id, "CREATE", "Phase", item.id,
            new_values=serialize_model(item), description=f"Created phase {item.name}",
        )
        return PhaseResponse.model_validate(item)

    async def update_phase(self, item_id: int, data: PhaseUpdate, user: User):
        item = await self._project_item(Phase, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        values = data.model_dump(exclude_unset=True)
        start = values.get("start_date", item.start_date)
        end = values.get("end_date", item.end_date)
        if start and end and end < start:
            raise BadRequestException("End date must be on or after start date")
        old = {key: getattr(item, key) for key in values}
        if "status" in values:
            values["status"] = PhaseStatus(values["status"])
        for key, value in values.items():
            setattr(item, key, value)
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Phase", item.id, old_values=old, new_values=values)
        return PhaseResponse.model_validate(item)

    async def list_sprints(self, phase_id: int, user: User):
        phase = await self._project_item(Phase, phase_id)
        await get_project_context(self.db, phase.project_id, user)
        items = list(
            (await self.db.scalars(select(Sprint).where(Sprint.phase_id == phase_id).order_by(Sprint.id))).all()
        )
        return [SprintResponse.model_validate(item) for item in items]

    async def create_sprint(self, phase_id: int, data: SprintCreate, user: User):
        phase = await self._project_item(Phase, phase_id)
        await require_project_roles(self.db, phase.project_id, user, "PM")
        item = Sprint(project_id=phase.project_id, phase_id=phase.id, **data.model_dump())
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Sprint", item.id, new_values=serialize_model(item))
        return SprintResponse.model_validate(item)

    async def get_sprint(self, item_id: int, user: User):
        item = await self._project_item(Sprint, item_id)
        await get_project_context(self.db, item.project_id, user)
        return SprintResponse.model_validate(item)

    async def update_sprint(self, item_id: int, data: SprintUpdate, user: User):
        item = await self._project_item(Sprint, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        values = data.model_dump(exclude_unset=True)
        if values.get("phase_id") is not None:
            phase = await self._project_item(Phase, values["phase_id"])
            if phase.project_id != item.project_id:
                raise BadRequestException("Sprint and phase must belong to the same project")
        start = values.get("start_date", item.start_date)
        end = values.get("end_date", item.end_date)
        if start and end and end < start:
            raise BadRequestException("End date must be on or after start date")
        old = {key: getattr(item, key) for key in values}
        if "status" in values:
            values["status"] = SprintStatus(values["status"])
        for key, value in values.items():
            setattr(item, key, value)
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Sprint", item.id, old_values=old, new_values=values)
        return SprintResponse.model_validate(item)

    async def transition_sprint(self, item_id: int, target: SprintStatus, user: User):
        item = await self._project_item(Sprint, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        allowed = {
            SprintStatus.ACTIVE: {SprintStatus.PLANNED},
            SprintStatus.COMPLETED: {SprintStatus.ACTIVE},
        }
        if item.status not in allowed[target]:
            raise ConflictException(f"Cannot transition sprint from {item.status.value} to {target.value}")
        old = item.status
        item.status = target
        await self.db.flush()
        add_audit(self.db, user.id, "STATUS", "Sprint", item.id, old_values={"status": old}, new_values={"status": target})
        return SprintResponse.model_validate(item)

    async def list_epics(self, project_id: int, user: User):
        await get_project_context(self.db, project_id, user)
        return [
            EpicResponse.model_validate(item)
            for item in (await self.db.scalars(select(Epic).where(Epic.project_id == project_id).order_by(Epic.id))).all()
        ]

    async def create_epic(self, project_id: int, data: EpicCreate, user: User):
        await require_project_roles(self.db, project_id, user, "PM")
        item = Epic(project_id=project_id, **data.model_dump())
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Epic", item.id, new_values=serialize_model(item))
        return EpicResponse.model_validate(item)

    async def get_epic(self, item_id: int, user: User):
        item = await self._project_item(Epic, item_id)
        await get_project_context(self.db, item.project_id, user)
        return EpicResponse.model_validate(item)

    async def update_epic(self, item_id: int, data: EpicUpdate, user: User):
        item = await self._project_item(Epic, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        values = data.model_dump(exclude_unset=True)
        old = {key: getattr(item, key) for key in values}
        if "status" in values:
            values["status"] = EpicStatus(values["status"])
        for key, value in values.items():
            setattr(item, key, value)
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Epic", item.id, old_values=old, new_values=values)
        return EpicResponse.model_validate(item)

    async def list_milestones(self, project_id: int, user: User):
        await get_project_context(self.db, project_id, user)
        return [
            MilestoneResponse.model_validate(item)
            for item in (await self.db.scalars(select(Milestone).where(Milestone.project_id == project_id).order_by(Milestone.due_date, Milestone.id))).all()
        ]

    async def create_milestone(self, project_id: int, data: MilestoneCreate, user: User):
        await require_project_roles(self.db, project_id, user, "PM")
        item = Milestone(project_id=project_id, **data.model_dump())
        self.db.add(item)
        await self.db.flush()
        add_audit(self.db, user.id, "CREATE", "Milestone", item.id, new_values=serialize_model(item))
        return MilestoneResponse.model_validate(item)

    async def get_milestone(self, item_id: int, user: User):
        item = await self._project_item(Milestone, item_id)
        await get_project_context(self.db, item.project_id, user)
        return MilestoneResponse.model_validate(item)

    async def update_milestone(self, item_id: int, data: MilestoneUpdate, user: User):
        item = await self._project_item(Milestone, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        values = data.model_dump(exclude_unset=True)
        old = {key: getattr(item, key) for key in values}
        if "status" in values:
            values["status"] = MilestoneStatus(values["status"])
        for key, value in values.items():
            setattr(item, key, value)
        if item.status == MilestoneStatus.COMPLETED and item.completed_at is None:
            item.completed_at = datetime.now(timezone.utc)
        elif item.status != MilestoneStatus.COMPLETED:
            item.completed_at = None
        await self.db.flush()
        add_audit(self.db, user.id, "UPDATE", "Milestone", item.id, old_values=old, new_values=values)
        return MilestoneResponse.model_validate(item)

    async def complete_milestone(self, item_id: int, user: User):
        return await self.update_milestone(
            item_id, MilestoneUpdate(status="COMPLETED"), user
        )

    async def delete_simple(self, model: Type[ModelT], item_id: int, user: User) -> None:
        item = await self._project_item(model, item_id)
        await require_project_roles(self.db, item.project_id, user, "PM")
        snapshot = serialize_model(item)
        await self.db.delete(item)
        await self.db.flush()
        add_audit(self.db, user.id, "DELETE", model.__name__, item_id, old_values=snapshot)
        await recalculate_project(self.db, snapshot["project_id"])

    async def _phase_task_ids(self, phase_id: int) -> tuple[list[int], list[int]]:
        sprint_ids = list(
            (await self.db.scalars(select(Sprint.id).where(Sprint.phase_id == phase_id))).all()
        )
        task_filter = Task.phase_id == phase_id
        if sprint_ids:
            task_filter = or_(task_filter, Task.sprint_id.in_(sprint_ids))
        task_ids = list((await self.db.scalars(select(Task.id).where(task_filter))).all())
        return sprint_ids, task_ids

    async def delete_impact(self, phase_id: int, user: User) -> PhaseDeleteImpact:
        phase = await self._project_item(Phase, phase_id)
        await require_project_roles(self.db, phase.project_id, user, "PM")
        sprint_ids, task_ids = await self._phase_task_ids(phase_id)
        if not task_ids:
            return PhaseDeleteImpact(
                phase_id=phase.id, phase_name=phase.name, sprint_count=len(sprint_ids),
                task_count=0, subtask_count=0, internal_dependency_count=0,
                external_dependency_count=0, assignment_count=0, worklog_count=0,
                comment_count=0,
            )
        dep_filter = or_(Dependency.predecessor_id.in_(task_ids), Dependency.successor_id.in_(task_ids))
        internal = await self.db.scalar(
            select(func.count()).select_from(Dependency).where(
                Dependency.predecessor_id.in_(task_ids), Dependency.successor_id.in_(task_ids)
            )
        )
        total_dependencies = await self.db.scalar(select(func.count()).select_from(Dependency).where(dep_filter))
        async def count(model, column):
            return int(await self.db.scalar(select(func.count()).select_from(model).where(column.in_(task_ids))) or 0)
        return PhaseDeleteImpact(
            phase_id=phase.id,
            phase_name=phase.name,
            sprint_count=len(sprint_ids),
            task_count=len(task_ids),
            subtask_count=await count(Subtask, Subtask.task_id),
            internal_dependency_count=int(internal or 0),
            external_dependency_count=int(total_dependencies or 0) - int(internal or 0),
            assignment_count=await count(Assignment, Assignment.task_id),
            worklog_count=await count(Worklog, Worklog.task_id),
            comment_count=await count(Comment, Comment.task_id),
        )

    async def _phase_snapshot(self, phase: Phase, sprint_ids: list[int], task_ids: list[int]) -> dict:
        async def rows(model, condition):
            return [serialize_model(item) for item in (await self.db.scalars(select(model).where(condition))).all()]
        snapshot = {
            "schema_version": 1,
            "phase": serialize_model(phase),
            "sprints": await rows(Sprint, Sprint.id.in_(sprint_ids)) if sprint_ids else [],
            "tasks": await rows(Task, Task.id.in_(task_ids)) if task_ids else [],
            "subtasks": await rows(Subtask, Subtask.task_id.in_(task_ids)) if task_ids else [],
            "assignments": await rows(Assignment, Assignment.task_id.in_(task_ids)) if task_ids else [],
            "worklogs": await rows(Worklog, Worklog.task_id.in_(task_ids)) if task_ids else [],
            "comments": await rows(Comment, Comment.task_id.in_(task_ids)) if task_ids else [],
            "dependencies": [],
        }
        if task_ids:
            snapshot["dependencies"] = await rows(
                Dependency,
                or_(Dependency.predecessor_id.in_(task_ids), Dependency.successor_id.in_(task_ids)),
            )
        return snapshot

    async def delete_phase(
        self,
        phase_id: int,
        strategy: str,
        user: User,
        target_phase_id: Optional[int] = None,
    ) -> None:
        phase = await self._project_item(Phase, phase_id)
        await require_project_roles(self.db, phase.project_id, user, "PM")
        if strategy not in {"cascade", "reassign", "unlink"}:
            raise BadRequestException("Unknown phase delete strategy")
        sprint_ids, task_ids = await self._phase_task_ids(phase_id)
        snapshot = await self._phase_snapshot(phase, sprint_ids, task_ids)
        if strategy == "reassign":
            if target_phase_id is None or target_phase_id == phase_id:
                raise BadRequestException("A different target phase is required")
            target = await self._project_item(Phase, target_phase_id)
            if target.project_id != phase.project_id:
                raise BadRequestException("Target phase must belong to the same project")
            if sprint_ids:
                await self.db.execute(update(Sprint).where(Sprint.id.in_(sprint_ids)).values(phase_id=target.id))
            if task_ids:
                await self.db.execute(update(Task).where(Task.id.in_(task_ids)).values(phase_id=target.id))
        elif strategy == "unlink":
            if sprint_ids:
                await self.db.execute(update(Sprint).where(Sprint.id.in_(sprint_ids)).values(phase_id=None))
            if task_ids:
                await self.db.execute(update(Task).where(Task.id.in_(task_ids)).values(phase_id=None))
        else:
            if task_ids:
                await self.db.execute(delete(Task).where(Task.id.in_(task_ids)))
            if sprint_ids:
                await self.db.execute(delete(Sprint).where(Sprint.id.in_(sprint_ids)))
        await self.db.delete(phase)
        await self.db.flush()
        add_audit(
            self.db, user.id, "DELETE", "Phase", phase_id,
            old_values=snapshot,
            new_values={"strategy": strategy, "target_phase_id": target_phase_id},
            description=f"Deleted phase {snapshot['phase']['name']} using {strategy}",
        )
        await recalculate_project(self.db, phase.project_id)

    async def tree(self, project_id: int, user: User) -> WBSTree:
        context = await get_project_context(self.db, project_id, user)
        phases = list((await self.db.scalars(select(Phase).where(Phase.project_id == project_id).order_by(Phase.order_index, Phase.id))).all())
        sprints = list((await self.db.scalars(select(Sprint).where(Sprint.project_id == project_id).order_by(Sprint.id))).all())
        epics = list((await self.db.scalars(select(Epic).where(Epic.project_id == project_id).order_by(Epic.id))).all())
        milestones = list((await self.db.scalars(select(Milestone).where(Milestone.project_id == project_id).order_by(Milestone.due_date, Milestone.id))).all())
        tasks = list((await self.db.scalars(select(Task).options(selectinload(Task.assignee)).where(Task.project_id == project_id).order_by(Task.id))).all())
        capabilities = TaskCapabilities(
            can_update=context.is_admin or context.role in {"PM", "BA"},
            can_delete=context.is_admin or context.role == "PM",
            can_change_status=context.is_admin or context.role in {"PM", "BA"},
            can_manage_dependencies=context.is_admin or context.role in {"PM", "BA"},
            can_manage_assignments=context.is_admin or context.role == "PM",
            can_log_work=context.is_admin or context.role in {"PM", "BA", "Member"},
            can_read_worklogs=context.is_admin or context.role in {"PM", "BA", "Member"},
        )

        def task_response(task: Task):
            response = TaskResponse.model_validate(task)
            response.primary_assignee = task.assignee
            response.capabilities = capabilities
            return response

        sprint_nodes = {
            sprint.id: SprintNode(
                **SprintResponse.model_validate(sprint).model_dump(),
                tasks=[task_response(task) for task in tasks if task.sprint_id == sprint.id],
            )
            for sprint in sprints
        }
        phase_nodes = [
            PhaseNode(
                **PhaseResponse.model_validate(phase).model_dump(),
                sprints=[sprint_nodes[s.id] for s in sprints if s.phase_id == phase.id],
                tasks=[task_response(task) for task in tasks if task.phase_id == phase.id and task.sprint_id is None],
            )
            for phase in phases
        ]
        return WBSTree(
            project_id=project_id,
            phases=phase_nodes,
            unphased_sprints=[sprint_nodes[s.id] for s in sprints if s.phase_id is None],
            unphased_tasks=[task_response(task) for task in tasks if task.phase_id is None and task.sprint_id is None],
            epics=[EpicResponse.model_validate(item) for item in epics],
            milestones=[MilestoneResponse.model_validate(item) for item in milestones],
        )


async def get_wbs_service(db: Annotated[AsyncSession, Depends(get_db)]) -> WBSService:
    return WBSService(db)


WBSServiceDep = Annotated[WBSService, Depends(get_wbs_service)]
