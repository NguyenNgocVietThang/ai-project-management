"""SOP-AI-001: Điều phối vòng đời AIRequest cho tính năng sinh dự án bằng AI.

Endpoint chỉ tạo bản ghi `AIRequest` và xếp hàng Celery task — việc gọi AI thật
và ghi Project/Phase/Task xảy ra trong worker (app/workers/ai_tasks.py), vì một
lời gọi AI có thể mất nhiều giây, vượt quá thời gian chấp nhận được của một
HTTP request. Client theo dõi tiến độ bằng cách poll GET /ai/jobs/{id}, đọc
trực tiếp cột `status` trên `AIRequest` — hệ thống này không dùng result
backend của Celery (xem AsyncResult) nên trạng thái luôn lấy từ DB.
"""
import asyncio
import logging
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
from app.models.user import User
from app.schemas.ai import AIJobResponse, AIResultResponse
from app.services.phase2_common import is_admin as _is_admin

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def request_project_generation(self, prompt: str, user: User) -> AIJobResponse:
        from app.workers.ai_tasks import generate_project_task

        ai_request = AIRequest(
            user_id=user.id,
            request_type=AIRequestType.PROJECT_GENERATE,
            status=AIRequestStatus.PENDING,
            input_data_json={"prompt": prompt},
        )
        self.db.add(ai_request)
        await self.db.commit()
        await self.db.refresh(ai_request)

        try:
            task = await asyncio.to_thread(generate_project_task.delay, ai_request.id)
        except Exception as exc:
            logger.exception("Could not queue AI request %s", ai_request.id)
            ai_request.status = AIRequestStatus.FAILED
            ai_request.error_message = "The AI queue is unavailable. Please try again later."
            ai_request.completed_at = datetime.now(UTC)
            await self.db.commit()
            raise HTTPException(status_code=503, detail=ai_request.error_message) from exc
        ai_request.celery_task_id = task.id
        await self.db.commit()

        return AIJobResponse(
            job_id=str(ai_request.id),
            status=ai_request.status.value,
            message="Project generation queued",
        )

    async def request_impact_analysis(self, change_request_id: int, user: User) -> AIJobResponse:
        from app.models.change_request import ChangeRequest
        from app.services.phase2_common import get_project_context
        from app.workers.ai_tasks import impact_analysis_task

        change_request = await self.db.get(ChangeRequest, change_request_id)
        if change_request is None:
            raise NotFoundException("Change request not found")
        # Chi thanh vien du an moi duoc yeu cau AI phan tich change request cua no.
        await get_project_context(self.db, change_request.project_id, user)

        return await self._queue(
            AIRequestType.IMPACT_ANALYSIS,
            {"change_request_id": change_request_id},
            impact_analysis_task,
            user,
            project_id=change_request.project_id,
            message="Impact analysis queued",
        )

    async def request_schedule_optimization(
        self, project_id: int, constraints: dict | None, user: User
    ) -> AIJobResponse:
        from app.services.phase2_common import get_project_context
        from app.workers.ai_tasks import optimize_schedule_task

        await get_project_context(self.db, project_id, user)

        return await self._queue(
            AIRequestType.SCHEDULE_OPTIMIZE,
            {"project_id": project_id, "constraints": constraints},
            optimize_schedule_task,
            user,
            project_id=project_id,
            message="Schedule optimization queued",
        )

    async def request_resource_recommendation(self, task_id: int, user: User) -> AIJobResponse:
        from app.models.task import Task
        from app.services.phase2_common import get_project_context
        from app.workers.ai_tasks import resource_recommendation_task

        task = await self.db.get(Task, task_id)
        if task is None:
            raise NotFoundException("Task not found")
        await get_project_context(self.db, task.project_id, user)

        return await self._queue(
            AIRequestType.RESOURCE_RECOMMEND,
            {"task_id": task_id},
            resource_recommendation_task,
            user,
            project_id=task.project_id,
            message="Resource recommendation queued",
        )

    async def request_risk_analysis(self, project_id: int, user: User) -> AIJobResponse:
        from app.services.phase2_common import get_project_context
        from app.workers.ai_tasks import risk_analysis_task

        await get_project_context(self.db, project_id, user)

        return await self._queue(
            AIRequestType.RISK_ANALYSIS,
            {"project_id": project_id},
            risk_analysis_task,
            user,
            project_id=project_id,
            message="Risk analysis queued",
        )

    async def _queue(
        self,
        request_type: AIRequestType,
        input_data: dict,
        task,
        user: User,
        *,
        project_id: int | None,
        message: str,
    ) -> AIJobResponse:
        """Tao AIRequest + xep hang Celery task — dung chung cho ca 4 loai phan
        tich AI o duoi (impact/schedule/resource/risk), theo dung pattern cua
        request_project_generation o tren."""
        ai_request = AIRequest(
            project_id=project_id,
            user_id=user.id,
            request_type=request_type,
            status=AIRequestStatus.PENDING,
            input_data_json=input_data,
        )
        self.db.add(ai_request)
        await self.db.commit()
        await self.db.refresh(ai_request)

        try:
            celery_task = await asyncio.to_thread(task.delay, ai_request.id)
        except Exception as exc:
            logger.exception("Could not queue AI request %s", ai_request.id)
            ai_request.status = AIRequestStatus.FAILED
            ai_request.error_message = "The AI queue is unavailable. Please try again later."
            ai_request.completed_at = datetime.now(UTC)
            await self.db.commit()
            raise HTTPException(status_code=503, detail=ai_request.error_message) from exc
        ai_request.celery_task_id = celery_task.id
        await self.db.commit()

        return AIJobResponse(
            job_id=str(ai_request.id), status=ai_request.status.value, message=message
        )

    async def get_job(self, job_id: int, user: User) -> AIResultResponse:
        ai_request = await self.db.get(AIRequest, job_id)
        if ai_request is None:
            raise NotFoundException("AI job not found")
        if ai_request.user_id != user.id and not _is_admin(user):
            raise ForbiddenException("You cannot view this AI job")

        result = None
        if ai_request.status == AIRequestStatus.COMPLETED:
            output = await self.db.scalar(
                select(AIOutput).where(AIOutput.ai_request_id == ai_request.id)
            )
            result = output.output_json if output else None

        return AIResultResponse(
            job_id=str(ai_request.id),
            status=ai_request.status.value,
            result=result,
            error=ai_request.error_message,
            project_id=ai_request.project_id,
        )


async def get_ai_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AIService:
    return AIService(db)


AIServiceDep = Annotated[AIService, Depends(get_ai_service)]
