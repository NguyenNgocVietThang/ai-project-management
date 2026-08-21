from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_permissions
from app.models.user import User
from app.schemas.admin import AuditLogResponse
from app.schemas.common import PaginatedResponse
from app.services.audit_service import AuditServiceDep

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[AuditLogResponse])
async def list_audit_logs(
    audit_service: AuditServiceDep,
    current_user: Annotated[User, Depends(require_permissions("audit:read"))],
    entity_type: Optional[str] = Query(default=None, max_length=100),
    user_id: Optional[int] = Query(default=None),
    action: Optional[str] = Query(default=None, max_length=100),
    date_from: Optional[datetime] = Query(default=None),
    date_to: Optional[datetime] = Query(default=None),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
):
    return await audit_service.list(
        entity_type=entity_type,
        user_id=user_id,
        action=action,
        date_from=date_from,
        date_to=date_to,
        page=page,
        page_size=page_size,
    )
