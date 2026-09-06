"""Định tuyến model xKiro theo từng loại tác vụ AI.

xKiro cho phép gọi hàng trăm model qua 1 API key, nên thay vì dùng cố định
1 model cho mọi việc, mỗi loại tác vụ được gán một model miễn phí phù hợp
nhất (model mạnh về reasoning cho việc phức tạp, model độ trễ thấp cho việc
đơn giản/nhanh...). Việc gán này đọc từ config nên có thể đổi qua biến môi
trường mà không cần sửa code hay deploy lại.
"""
from enum import Enum

from app.core.config import settings


class AITaskType(str, Enum):
    """Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI."""

    PROJECT_GENERATION = "project_generation"  # SOP-AI-001
    DOCUMENT_PARSING = "document_parsing"  # SOP-DOC-001
    IMPACT_ANALYSIS = "impact_analysis"  # SOP-AI-002
    SCHEDULE_OPTIMIZATION = "schedule_optimization"  # SOP-AI-003
    RESOURCE_RECOMMENDATION = "resource_recommendation"  # SOP-AI-004
    RISK_ANALYSIS = "risk_analysis"  # SOP-AI-005
    CHAT_QUICK = "chat_quick"  # phản hồi nhanh, độ trễ thấp


_TASK_TO_SETTING = {
    AITaskType.PROJECT_GENERATION: "XKIRO_MODEL_PROJECT_GENERATION",
    AITaskType.DOCUMENT_PARSING: "XKIRO_MODEL_DOCUMENT_PARSING",
    AITaskType.IMPACT_ANALYSIS: "XKIRO_MODEL_IMPACT_ANALYSIS",
    AITaskType.SCHEDULE_OPTIMIZATION: "XKIRO_MODEL_SCHEDULE_OPTIMIZATION",
    AITaskType.RESOURCE_RECOMMENDATION: "XKIRO_MODEL_RESOURCE_RECOMMENDATION",
    AITaskType.RISK_ANALYSIS: "XKIRO_MODEL_RISK_ANALYSIS",
    AITaskType.CHAT_QUICK: "XKIRO_MODEL_CHAT_QUICK",
}


def resolve_model(task: AITaskType) -> str:
    """Trả về tên model xKiro (dạng "vendor/model") được cấu hình cho một loại tác vụ."""
    setting_name = _TASK_TO_SETTING[task]
    return getattr(settings, setting_name)


def model_routing_table() -> dict:
    """Trả về toàn bộ bảng định tuyến task -> model hiện hành, dùng để log/kiểm tra."""
    return {task.value: resolve_model(task) for task in AITaskType}
