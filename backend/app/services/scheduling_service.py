import logging
from datetime import date
from typing import Annotated

from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ConflictException
from app.db.session import get_db
from app.models.dependency import Dependency
from app.models.epic import Epic
from app.models.project import Project
from app.models.sprint import Sprint
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.cpm import CPMResponse, CPMTask
from app.utils.cpm import compute_cpm_for_project, offsets_to_dates

logger = logging.getLogger(__name__)


async def recalculate_project(
    db: AsyncSession, project_id: int, *, force_sync: bool = False
) -> None:
    """Tính lại đường găng, tiến độ dự án và số liệu sprint.

    Đây là thao tác toàn dự án — nạp mọi task và dependency rồi ghi lại sáu cột
    trên từng dòng — nhưng nó được gọi từ mọi thao tác ghi, kể cả những thao tác
    nhỏ như đổi tên một task. Với dự án lớn, chi phí đó không thuộc về vòng đời của
    một request, nên trên CPM_SYNC_TASK_THRESHOLD nó được đẩy sang Celery và gộp
    trùng (xem app/workers/scheduling_tasks.py).

    `force_sync` là đường mà chính worker dùng; nếu không thì nó sẽ tự đẩy việc
    sang chính mình mãi mãi.
    """
    project = await db.get(Project, project_id)
    if project is None:
        return

    if not force_sync:
        total = await db.scalar(
            select(func.count()).select_from(Task).where(Task.project_id == project_id)
        )
        if (total or 0) > settings.CPM_SYNC_TASK_THRESHOLD:
            from app.workers.scheduling_tasks import schedule_recalculation

            await schedule_recalculation(project_id)
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
        try:
            result = compute_cpm_for_project(tasks, dependencies)
        except ValueError:
            # Chu trình trong đồ thị phụ thuộc. add_dependency đã kiểm tra trước khi
            # ghi, nhưng kiểm tra đó không có khoá, nên hai request đồng thời vẫn có
            # thể tạo ra chu trình. Nếu để lỗi này nổi lên, MỌI thao tác ghi trên dự
            # án sẽ trả 500 vĩnh viễn — kể cả thao tác xoá dependency vốn là cách
            # duy nhất để thoát ra.
            logger.exception(
                "Cycle detected while recalculating project_id=%s; leaving previous "
                "schedule values in place so the graph can still be repaired",
                project_id,
            )
            result = None
    else:
        result = None

    if result is not None:
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

    # Epic.story_points chua tung duoc tinh o dau: khong co schema ghi nao nhan no
    # va khong service nao cong don tu task con, nen EpicResponse.story_points luon
    # tra ve 0. Cong don o day, cung cho voi so lieu sprint.
    epics = list(
        (await db.scalars(select(Epic).where(Epic.project_id == project_id))).all()
    )
    for epic in epics:
        epic.story_points = sum(
            task.story_points or 0 for task in tasks if task.epic_id == epic.id
        )

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
        await recalculate_project_cost(db, task.project_id)
    return total


async def recalculate_project_cost(db: AsyncSession, project_id: int) -> float:
    """Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.

    `actual_cost` truoc day CHI duoc doc, khong noi nao ghi - nen phan theo doi
    ngan sach o dashboard luon bao 0% da dung, tren moi du an, du co worklog hay
    khong. `User.hourly_rate` von da ton tai; chi thieu buoc cong don nay.

    Nguoi chua dat don gia gio duoc tinh la 0, chu khong lam hong ca phep cong:
    mot chi phi thieu sot van tot hon mot con so bia ra.
    """
    from app.models.user import User
    from app.models.worklog import Worklog

    project = await db.get(Project, project_id)
    if project is None:
        return 0.0

    total = float(
        await db.scalar(
            select(
                func.coalesce(func.sum(Worklog.hours * func.coalesce(User.hourly_rate, 0.0)), 0.0)
            )
            .select_from(Worklog)
            .join(Task, Task.id == Worklog.task_id)
            .join(User, User.id == Worklog.user_id)
            .where(Task.project_id == project_id)
        )
        or 0.0
    )
    project.actual_cost = round(total, 2)
    await db.flush()
    return project.actual_cost


class SchedulingService:
    """Truy vấn chỉ đọc trên lịch trình đã được tính ra.

    Bản thân việc tính toán chạy nội tuyến ở mỗi thao tác ghi (recalculate_project
    phía trên); lớp này chỉ đọc kết quả và trình bày nó.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def critical_path(self, project_id: int, user: User) -> CPMResponse:
        from app.services.phase2_common import get_project_context
        from app.services.task_service import _require_task_reader

        context = await get_project_context(self.db, project_id, user)
        _require_task_reader(context)
        project = context.project

        tasks = list(
            (await self.db.scalars(select(Task).where(Task.project_id == project_id))).all()
        )
        if not tasks:
            return CPMResponse(
                project_id=project_id,
                project_duration_days=0.0,
                anchor_date=project.start_date,
                critical_path=[],
                tasks=[],
            )

        task_ids = [task.id for task in tasks]
        dependencies = list(
            (
                await self.db.scalars(
                    select(Dependency).where(
                        Dependency.predecessor_id.in_(task_ids),
                        Dependency.successor_id.in_(task_ids),
                    )
                )
            ).all()
        )

        predecessors: dict[int, list[int]] = {task_id: [] for task_id in task_ids}
        for dependency in dependencies:
            predecessors[dependency.successor_id].append(dependency.predecessor_id)

        try:
            result = compute_cpm_for_project(tasks, dependencies)
        except ValueError as exc:
            # Do thi co chu trinh: khong the tinh duong gang. Bao ro thay vi tra ve
            # mot ket qua trong nhu that.
            raise ConflictException(str(exc)) from exc

        anchor = project.start_date or min(
            (task.start_date for task in tasks if task.start_date),
            default=date.today(),
        )
        dates = offsets_to_dates(result, anchor)

        return CPMResponse(
            project_id=project_id,
            project_duration_days=result.project_duration,
            anchor_date=anchor,
            critical_path=result.critical_path,
            tasks=[
                CPMTask(
                    id=task.id,
                    name=task.name,
                    status=task.status.value,
                    duration_days=result.nodes[task.id].duration,
                    early_start=dates[task.id]["early_start"],
                    early_finish=dates[task.id]["early_finish"],
                    late_start=dates[task.id]["late_start"],
                    late_finish=dates[task.id]["late_finish"],
                    float_days=result.nodes[task.id].float_days,
                    is_critical=result.nodes[task.id].is_critical,
                    predecessor_ids=sorted(predecessors[task.id]),
                )
                for task in tasks
            ],
        )


async def get_scheduling_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SchedulingService:
    return SchedulingService(db)


SchedulingServiceDep = Annotated[SchedulingService, Depends(get_scheduling_service)]
