import logging
import math
from datetime import date, timedelta

logger = logging.getLogger(__name__)

async def _persist_plan(db, plan: dict, user) -> "object":
    from app.core.exceptions import BadRequestException
    from app.schemas.project import ProjectCreate
    from app.schemas.task import DependencyCreate, TaskCreate
    from app.schemas.wbs import PhaseCreate
    from app.services.project_service import ProjectService
    from app.services.task_service import TaskService
    from app.services.wbs_service import WBSService

    if not isinstance(plan, dict):
        raise BadRequestException("AI response was not a JSON object")

    name = (plan.get("name") or "").strip()
    if not name:
        raise BadRequestException("AI response is missing a project name")

    phases_data = plan.get("phases")
    if not isinstance(phases_data, list) or not phases_data:
        raise BadRequestException("AI response has no phases")

    # Model đôi khi trả "phases" là list tên kèm "tasks" phẳng ở cấp cao nhất thay vì
    # phases[].tasks[]. Chặn ở đây, nếu không sẽ tạo Project rỗng nhưng vẫn báo COMPLETED.
    has_any_task = any(
        isinstance(phase, dict) and any(isinstance(task, dict) for task in (phase.get("tasks") or []))
        for phase in phases_data
    )
    if not has_any_task:
        raise BadRequestException(
            "AI response did not match the expected phases[].tasks[] shape"
        )

    total_hours = 0.0
    for phase in phases_data:
        if not isinstance(phase, dict):
            continue
        for task in phase.get("tasks") or []:
            hours = task.get("estimated_hours") if isinstance(task, dict) else None
            if isinstance(hours, int | float):
                total_hours += hours

    # Kế hoạch AI không có ngày tháng — suy ra thời lượng dự án từ tổng giờ ước
    # tính (8h/ngày làm việc), có sàn 30 ngày và đệm 1 tuần cho việc điều phối.
    duration_days = max(30, math.ceil(total_hours / 8) + 7)
    start = date.today()
    end = start + timedelta(days=duration_days)

    project_service = ProjectService(db)
    project = await project_service.create(
        ProjectCreate(
            name=name[:200],
            description=(plan.get("description") or None),
            start_date=start,
            end_date=end,
        ),
        pm=user,
    )

    wbs_service = WBSService(db)
    task_service = TaskService(db)

    task_ids_by_name: dict[str, int] = {}
    pending_dependencies: list[tuple[int, list[str]]] = []

    for order_index, phase in enumerate(phases_data):
        if not isinstance(phase, dict):
            continue
        phase_name = (phase.get("name") or "").strip()[:255] or f"Phase {order_index + 1}"
        phase_resp = await wbs_service.create_phase(
            project.id, PhaseCreate(name=phase_name), user
        )

        for task in phase.get("tasks") or []:
            if not isinstance(task, dict):
                continue
            task_name = (task.get("name") or "").strip()
            if not task_name:
                continue
            hours = task.get("estimated_hours")
            task_resp = await task_service.create(
                project.id,
                TaskCreate(
                    name=task_name[:255],
                    phase_id=phase_resp.id,
                    estimated_hours=hours if isinstance(hours, int | float) and hours >= 0 else None,
                ),
                user,
            )
            task_ids_by_name[task_name] = task_resp.id
            deps = task.get("dependencies")
            if isinstance(deps, list) and deps:
                pending_dependencies.append(
                    (task_resp.id, [d for d in deps if isinstance(d, str)])
                )

    # Chỉ giải quyết dependency sau khi TOÀN BỘ task đã được tạo, vì AI có thể
    # tham chiếu một task ở phase khác chưa tới lượt xử lý.
    for task_id, dep_names in pending_dependencies:
        for dep_name in dep_names:
            dep_id = task_ids_by_name.get(dep_name.strip())
            if dep_id is None or dep_id == task_id:
                logger.warning(
                    "Bỏ qua dependency AI không giải quyết được: %r cho task %s",
                    dep_name,
                    task_id,
                )
                continue
            try:
                await task_service.add_dependency(
                    task_id, DependencyCreate(depends_on_task_id=dep_id), user
                )
            except Exception:
                # Vd chu trình phụ thuộc do AI bịa ra — bỏ qua cạnh đó, không
                # làm hỏng toàn bộ project đã tạo thành công.
                logger.warning(
                    "Bỏ qua dependency AI không hợp lệ: %s -> %s", dep_id, task_id, exc_info=True
                )

    return project

