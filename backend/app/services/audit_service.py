from datetime import datetime
from typing import Annotated, Optional

from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.schemas.admin import AuditLogResponse
from app.schemas.common import PaginatedResponse


class AuditService:
    """Read-only access to the append-only audit_logs table."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(
        self,
        *,
        entity_type: Optional[str] = None,
        user_id: Optional[int] = None,
        action: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResponse[AuditLogResponse]:
        conditions = []
        if entity_type:
            conditions.append(AuditLog.entity_type == entity_type)
        if user_id is not None:
            conditions.append(AuditLog.user_id == user_id)
        if action:
            conditions.append(AuditLog.action == action)
        if date_from is not None:
            conditions.append(AuditLog.created_at >= date_from)
        if date_to is not None:
            conditions.append(AuditLog.created_at <= date_to)

        count_stmt = select(func.count(AuditLog.id))
        if conditions:
            count_stmt = count_stmt.where(*conditions)
        total = await self.db.scalar(count_stmt) or 0

        stmt = select(AuditLog).options(joinedload(AuditLog.user))
        if conditions:
            stmt = stmt.where(*conditions)
        stmt = (
            stmt.order_by(AuditLog.created_at.desc(), AuditLog.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        result = await self.db.execute(stmt)
        items = list(result.scalars().unique().all())
        total_pages = (total + page_size - 1) // page_size if page_size else 0
        return PaginatedResponse(
            items=[AuditLogResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


async def get_audit_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuditService:
    return AuditService(db)


AuditServiceDep = Annotated[AuditService, Depends(get_audit_service)]
