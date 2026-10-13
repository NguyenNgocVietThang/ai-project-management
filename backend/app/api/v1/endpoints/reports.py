"""X2: xuất báo cáo XLSX của dự án (job bền `report.xlsx`) và tải qua proxy có kiểm tra quyền.

Theo dõi tiến độ job qua `GET /jobs/{job_id}` (người yêu cầu là owner của job).
"""
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.db.session import get_db
from app.services.reports import report_service as svc

router = APIRouter()
DB = Annotated[AsyncSession, Depends(get_db)]


class XlsxReportRequest(BaseModel):
    language: Literal["vi", "en"] = "vi"


class XlsxReportAccepted(BaseModel):
    job_id: int
    status: str


@router.post(
    "/projects/{project_id}/reports/xlsx",
    response_model=XlsxReportAccepted,
    status_code=status.HTTP_202_ACCEPTED,
)
async def request_xlsx_report(
    project_id: int, db: DB, user: CurrentVerifiedUser, body: XlsxReportRequest | None = None,
):
    """Xếp job xuất XLSX; nếu đã có job đang chạy cùng ngôn ngữ thì trả lại job đó."""
    job = await svc.request_xlsx_report(db, project_id, user, (body or XlsxReportRequest()).language)
    return XlsxReportAccepted(job_id=job.id, status=job.status)


@router.get("/projects/{project_id}/reports/xlsx/{job_id}/download")
async def download_xlsx_report(project_id: int, job_id: int, db: DB, user: CurrentUser):
    data, filename = await svc.read_report_file(db, project_id, job_id, user)
    return Response(
        content=data,
        media_type=svc.XLSX_CONTENT_TYPE,
        headers={
            # Tên tệp do server sinh, chỉ gồm ASCII an toàn.
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )
