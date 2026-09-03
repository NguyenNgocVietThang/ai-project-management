from app.workers.celery_app import celery_app


@celery_app.task(name="reports.generate_docx")
def generate_docx_task(project_id: int, report_type: str):
    """Tạo báo cáo DOCX cho một dự án."""
    # TODO: Cài đặt phần tạo DOCX bằng python-docx
    return {"status": "completed", "file_url": ""}


@celery_app.task(name="reports.generate_xlsx")
def generate_xlsx_task(project_id: int, report_type: str):
    """Tạo báo cáo XLSX cho một dự án."""
    # TODO: Cài đặt phần tạo XLSX bằng openpyxl
    return {"status": "completed", "file_url": ""}
