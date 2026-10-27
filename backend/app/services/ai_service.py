"""AI requests and durable outbox are inserted in the request transaction."""
import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    TooManyRequestsException,
)
from app.db.session import get_db
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
from app.models.job import Job
from app.models.project import ProjectMethodology
from app.models.user import User
from app.schemas.ai import AIJobResponse, AIResultResponse
from app.services.job_service import enqueue
from app.services.phase2_common import get_project_context
from app.services.phase2_common import is_admin as _is_admin


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def request_project_generation(self, prompt: str, user: User, *, request_key: str | None = None) -> AIJobResponse:
        if not prompt.strip() or len(prompt) > 8000:
            raise BadRequestException("Prompt must contain 1 to 8000 characters")
        return await self._queue(AIRequestType.PROJECT_GENERATE, {"prompt": prompt}, user, project_id=None, message="Project generation queued", request_key=request_key)

    async def request_project_generation_from_brief(self, brief_id: int, user: User, *, methodology: ProjectMethodology | None = None, request_key: str | None = None) -> AIJobResponse:
        """C4: xếp hàng sinh dự án từ hồ sơ yêu cầu đã chốt (`ready`).

        Chạy trong transaction của request, khóa hàng hồ sơ để hai yêu cầu đồng thời
        không cùng tạo job. Lỗi:
        - 404 `brief_not_found`: không có hoặc không thuộc người dùng.
        - 409 `brief_not_ready`: hồ sơ còn `clarifying` hoặc đã `consumed`.
        - 409 `brief_generation_pending`: đã có job sinh dự án chưa kết thúc.
        - 429 `ai_quota_exceeded`: hết quota AI trong ngày.
        """
        from app.services.ai.requirement_clarifier import TERMINAL_JOB_STATUSES, _quota_exhausted
        from app.services.requirement_brief_service import get_owned

        if request_key is not None and (not request_key or len(request_key) > 100):
            raise BadRequestException("Idempotency-Key must contain 1 to 100 characters")
        input_data = {"brief_id": brief_id}
        if methodology is not None:
            input_data["methodology"] = ProjectMethodology(methodology).value
        message = "Project generation queued"
        brief = await get_owned(self.db, brief_id, user, lock=True)
        if request_key is not None:
            # Lặp lại cùng Idempotency-Key: trả về job cũ, không tạo thêm.
            key = f"ai:{user.id}:{AIRequestType.PROJECT_GENERATE.value}:brief:{request_key}"
            existing = await self.db.scalar(select(Job).where(Job.dedupe_key == key))
            if existing is not None:
                previous = await self.db.get(AIRequest, existing.payload["ai_request_id"])
                if previous is None or previous.input_data_json != input_data:
                    raise ConflictException("Idempotency-Key already used for different input")
                return AIJobResponse(job_id=str(previous.id), status=previous.status.value, message=message)
        else:
            key = f"ai:{user.id}:{AIRequestType.PROJECT_GENERATE.value}:brief:{uuid.uuid4().hex}"
        if brief.status != "ready" or brief.project_id is not None:
            raise ConflictException("brief_not_ready")
        if brief.pending_job_id is not None:
            pending = await self.db.get(Job, brief.pending_job_id)
            if pending is not None and pending.status not in TERMINAL_JOB_STATUSES:
                raise ConflictException("brief_generation_pending")
        if await _quota_exhausted(self.db):
            raise TooManyRequestsException("ai_quota_exceeded")
        request = AIRequest(project_id=None, user_id=user.id, request_type=AIRequestType.PROJECT_GENERATE, status=AIRequestStatus.PENDING, input_data_json=input_data)
        self.db.add(request)
        await self.db.flush()
        job = await enqueue(self.db, kind=f"ai.{AIRequestType.PROJECT_GENERATE.value.lower()}", payload={"ai_request_id": request.id}, dedupe_key=key, owner_id=user.id, ambiguous_on_lease_loss=True)
        # Ghi job đang chạy vào hồ sơ: chặn enqueue lần hai cho tới khi job kết thúc.
        brief.pending_job_id = job.id
        await self.db.flush()
        return AIJobResponse(job_id=str(request.id), status=request.status.value, message=message)

    async def request_impact_analysis(self, change_request_id: int, user: User, *, request_key: str | None = None) -> AIJobResponse:
        from app.models.change_request import ChangeRequest
        change_request = await self.db.get(ChangeRequest, change_request_id)
        if change_request is None:
            raise NotFoundException("Change request not found")
        await get_project_context(self.db, change_request.project_id, user)
        return await self._queue(AIRequestType.IMPACT_ANALYSIS, {"change_request_id": change_request_id}, user, project_id=change_request.project_id, message="Impact analysis queued", request_key=request_key)

    async def request_schedule_optimization(self, project_id: int, constraints: dict | None, user: User, *, request_key: str | None = None) -> AIJobResponse:
        await get_project_context(self.db, project_id, user)
        return await self._queue(AIRequestType.SCHEDULE_OPTIMIZE, {"project_id": project_id, "constraints": constraints}, user, project_id=project_id, message="Schedule optimization queued", request_key=request_key)

    async def request_resource_recommendation(self, task_id: int, user: User, *, request_key: str | None = None) -> AIJobResponse:
        from app.models.task import Task
        task = await self.db.get(Task, task_id)
        if task is None:
            raise NotFoundException("Task not found")
        await get_project_context(self.db, task.project_id, user)
        return await self._queue(AIRequestType.RESOURCE_RECOMMEND, {"task_id": task_id}, user, project_id=task.project_id, message="Resource recommendation queued", request_key=request_key)

    async def request_risk_analysis(self, project_id: int, user: User, *, request_key: str | None = None) -> AIJobResponse:
        await get_project_context(self.db, project_id, user)
        return await self._queue(AIRequestType.RISK_ANALYSIS, {"project_id": project_id}, user, project_id=project_id, message="Risk analysis queued", request_key=request_key)

    async def _queue(self, request_type: AIRequestType, input_data: dict, user: User, *, project_id: int | None, message: str, request_key: str | None = None) -> AIJobResponse:
        if request_key is not None and (not request_key or len(request_key) > 100):
            raise BadRequestException("Idempotency-Key must contain 1 to 100 characters")
        key = f"ai:{user.id}:{request_type.value}:{request_key or uuid.uuid4().hex}"
        existing = await self.db.scalar(select(Job).where(Job.dedupe_key == key))
        if existing is not None:
            previous = await self.db.get(AIRequest, existing.payload["ai_request_id"])
            if previous is None or previous.input_data_json != input_data:
                raise ConflictException("Idempotency-Key already used for different input")
            return AIJobResponse(job_id=str(previous.id), status=previous.status.value, message=message)
        request = AIRequest(project_id=project_id, user_id=user.id, request_type=request_type, status=AIRequestStatus.PENDING, input_data_json=input_data)
        self.db.add(request)
        await self.db.flush()
        job = await enqueue(self.db, kind=f"ai.{request_type.value.lower()}", payload={"ai_request_id": request.id}, dedupe_key=key, owner_id=user.id, project_id=project_id, ambiguous_on_lease_loss=True)
        if job.payload["ai_request_id"] != request.id:
            await self.db.delete(request)
            request = await self.db.get(AIRequest, job.payload["ai_request_id"])
            if request.input_data_json != input_data:
                raise ConflictException("Idempotency-Key already used for different input")
        return AIJobResponse(job_id=str(request.id), status=request.status.value, message=message)

    async def list_jobs(self, user: User) -> list[AIResultResponse]:
        requests = (await self.db.scalars(select(AIRequest).where(AIRequest.user_id == user.id).order_by(AIRequest.id.desc()).limit(50))).all()
        visible = []
        for request in requests:
            try:
                visible.append(await self.get_job(request.id, user))
            except (ForbiddenException, NotFoundException):
                # Membership and project deletion can change after completion.
                continue
        return visible

    async def get_job(self, job_id: int, user: User) -> AIResultResponse:
        ai_request = await self.db.get(AIRequest, job_id)
        if ai_request is None:
            raise NotFoundException("AI job not found")
        if ai_request.user_id != user.id and not _is_admin(user):
            raise ForbiddenException("You cannot view this AI job")
        if ai_request.project_id is not None:
            await get_project_context(self.db, ai_request.project_id, user)
        result = None
        if ai_request.status == AIRequestStatus.COMPLETED:
            output = await self.db.scalar(select(AIOutput).where(AIOutput.ai_request_id == ai_request.id))
            result = output.output_json if output else None
        return AIResultResponse(job_id=str(ai_request.id), status=ai_request.status.value, result=result, error=ai_request.error_message, project_id=ai_request.project_id)

async def get_ai_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AIService:
    return AIService(db)

AIServiceDep = Annotated[AIService, Depends(get_ai_service)]
