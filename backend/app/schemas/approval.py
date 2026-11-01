from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class ApprovalApproveRequest(BaseModel):
    # Ghi chú khi duyệt: tùy chọn, riêng CR MAJOR là bắt buộc (kiểm tra ở service).
    comment: str | None = Field(default=None, max_length=2000)
    # Revision báo cáo tác động người duyệt xác nhận đã đọc; bắt buộc với CR MAJOR.
    acknowledged_report_revision: int | None = Field(default=None, ge=1)

    @field_validator("comment")
    @classmethod
    def strip_comment(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class ApprovalRejectRequest(BaseModel):
    # Lý do từ chối: bắt buộc, chuỗi rỗng hoặc chỉ khoảng trắng bị trả 422.
    reason: str = Field(min_length=1, max_length=2000)

    @field_validator("reason")
    @classmethod
    def strip_reason(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("reason must not be blank")
        return value


class ApprovalStepResponse(BaseModel):
    id: int
    step_order: int
    required_role: str
    status: str
    # Người đã quyết định bước (null khi chưa quyết định hoặc bị hủy).
    approver_id: int | None
    approver_name: str | None
    # Ghi chú khi duyệt hoặc lý do khi từ chối.
    comment: str | None
    decided_at: datetime | None
    # Mức tác động của CR tại thời điểm quyết định bước này.
    impact_level_at_decision: str | None = None
    # Revision báo cáo người duyệt đã xác nhận đọc (nếu có).
    acknowledged_report_revision: int | None = None
    # Người dùng hiện tại có được quyết định bước này ngay bây giờ không.
    can_decide: bool


class ApprovalChainResponse(BaseModel):
    change_request_id: int
    change_request_status: str
    # step_order của bước PENDING đầu tiên; null khi chuỗi đã kết thúc.
    current_step_order: int | None
    # Mức tác động hiện hành và trạng thái chốt của PM.
    impact_level: str
    impact_level_confirmed: bool
    # Revision báo cáo tác động hiện tại; null khi chưa có báo cáo.
    report_revision: int | None
    # Điều kiện khi DUYỆT bước hiện hành (CR MAJOR): phải xác nhận đã đọc báo cáo và ghi nhận xét.
    requires_report: bool
    requires_acknowledgement: bool
    requires_comment: bool
    steps: list[ApprovalStepResponse]
