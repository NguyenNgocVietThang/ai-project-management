from datetime import date

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dependency import Dependency
from app.models.project import Project
from app.models.sprint import Sprint
from app.models.task import Task, TaskStatus
from app.utils.cpm import compute_cpm_for_project, offsets_to_dates


async def recalculate_project(db: AsyncSession, project_id: int) -> None:
    project = await db.get(Project, project_id)
    if project is None:
        return
    tasks = list(
        (await db.scalars(select(Task).where(Task.project_id == project_id))).all()
    )
    task_ids = [task.id for task in tasks]
    dependencies = []
    if task_ids:
        dependencies = list(
            (
                await db.scalars(
                    select(Dependency).where(
                        Dependency.predecessor_id.in_(task_ids),
                        Dependency.successor_id.in_(task_ids),
                    )
                )
            ).all()
        )
    if tasks:
        result = compute_cpm_for_project(tasks, dependencies)
        anchor = project.start_date or min(
            (task.start_date for task in tasks if task.start_date),
            default=date.today(),
        )
        dates = offsets_to_dates(result, anchor)
        for task in tasks:
            node = result.nodes[task.id]
            task.early_start = dates[task.id]["early_start"]
            task.early_finish = dates[task.id]["early_finish"]
            task.late_start = dates[task.id]["late_start"]
            task.late_finish = dates[task.id]["late_finish"]
            task.float_days = node.float_days
            task.is_critical = node.is_critical
    total = len(tasks)
    completed = sum(task.status == TaskStatus.DONE for task in tasks)
    project.progress = round(completed / total * 100, 2) if total else 0.0

    sprints = list(
        (await db.scalars(select(Sprint).where(Sprint.project_id == project_id))).all()
    )
    for sprint in sprints:
        sprint_tasks = [task for task in tasks if task.sprint_id == sprint.id]
        sprint.story_points_committed = sum(task.story_points or 0 for task in sprint_tasks)
        sprint.story_points_completed = sum(
            task.story_points or 0
            for task in sprint_tasks
            if task.status == TaskStatus.DONE
        )
        sprint.velocity = float(sprint.story_points_completed)
    await db.flush()


async def recalculate_task_hours(db: AsyncSession, task_id: int) -> float:
    from app.models.worklog import Worklog

    total = float(
        await db.scalar(
            select(func.coalesce(func.sum(Worklog.hours), 0.0)).where(
                Worklog.task_id == task_id,
                Worklog.end_time.is_not(None) | Worklog.start_time.is_(None),
            )
        )
        or 0.0
    )
    task = await db.get(Task, task_id)
    if task is not None:
        task.actual_hours = round(total, 4)
        await db.flush()
    return total
