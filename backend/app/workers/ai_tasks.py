from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="ai.generate_project")
def generate_project_task(self, prompt: str, ai_provider: str = None):
    """SOP-AI-001: Tạo kế hoạch dự án từ prompt ngôn ngữ tự nhiên."""
    try:
        self.update_state(state="STARTED", meta={"progress": 0})
        # TODO: Cài đặt phần tạo dự án bằng AI
        # from app.services.ai.project_generator import ProjectGeneratorService
        # result = ProjectGeneratorService().generate(prompt, ai_provider)
        return {"status": "completed", "result": {}}
    except Exception as exc:
        self.update_state(state="FAILURE", meta={"error": str(exc)})
        raise


@celery_app.task(bind=True, name="ai.impact_analysis")
def impact_analysis_task(self, change_request_id: int):
    """SOP-AI-002: Phân tích tác động của một change request."""
    try:
        # TODO: Cài đặt phần phân tích tác động
        return {"status": "completed", "result": {}}
    except Exception as exc:
        raise


@celery_app.task(bind=True, name="ai.optimize_schedule")
def optimize_schedule_task(self, project_id: int):
    """SOP-AI-003: Tối ưu lịch trình bằng AI."""
    try:
        # TODO: Cài đặt phần tối ưu lịch trình
        return {"status": "completed", "result": {}}
    except Exception as exc:
        raise


@celery_app.task(bind=True, name="ai.risk_analysis")
def risk_analysis_task(self, project_id: int):
    """SOP-AI-005: Phân tích rủi ro bằng AI."""
    try:
        # TODO: Cài đặt phần phân tích rủi ro
        return {"status": "completed", "result": {}}
    except Exception as exc:
        raise


@celery_app.task(bind=True, name="ai.parse_document")
def parse_document_task(self, document_id: int):
    """SOP-DOC-001: Phân tích tài liệu BRD/SRS bằng AI."""
    try:
        # TODO: Cài đặt phần phân tích tài liệu
        return {"status": "completed", "result": {}}
    except Exception as exc:
        raise
