from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class ApprovalApproveRequest(BaseModel):
    # Ghi chú khi duyệt: tùy chọn.
    comment: str | None = Field(default=None, max_length=2000)

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
    # Người dùng hiện tại có được quyết định bước này ngay bây giờ không.
    can_decide: bool


class ApprovalChainResponse(BaseModel):
    change_request_id: int
    change_request_status: str
    # step_order của bước PENDING đầu tiên; null khi chuỗi đã kết thúc.
    current_step_order: int | None
    steps: list[ApprovalStepResponse]
