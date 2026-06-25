from app.workers.celery_app import celery_app


@celery_app.task(name="reports.generate_docx")
def generate_docx_task(project_id: int, report_type: str):
    """Generate DOCX report for a project."""
    # TODO: Implement DOCX generation with python-docx
    return {"status": "completed", "file_url": ""}


@celery_app.task(name="reports.generate_xlsx")
def generate_xlsx_task(project_id: int, report_type: str):
    """Generate XLSX report for a project."""
    # TODO: Implement XLSX generation with openpyxl
    return {"status": "completed", "file_url": ""}
