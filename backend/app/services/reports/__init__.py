"""Các renderer báo cáo thuần (không truy cập DB).

Tầng job/endpoint (X2) chịu trách nhiệm nạp dữ liệu từ DB/dịch vụ rồi đổ vào
các dataclass ở đây; renderer chỉ biến dữ liệu thành bytes của tệp.
"""
from app.services.reports.xlsx_renderer import (
    BurndownRow,
    ChangeRequestRow,
    CriticalPathData,
    EVAData,
    ProjectInfo,
    ProjectReportData,
    ReportApprovalStep,
    TaskRow,
    render_project_xlsx,
    sheet_names,
)

__all__ = [
    "BurndownRow",
    "ChangeRequestRow",
    "CriticalPathData",
    "EVAData",
    "ProjectInfo",
    "ProjectReportData",
    "ReportApprovalStep",
    "TaskRow",
    "render_project_xlsx",
    "sheet_names",
]
