from datetime import datetime

from pydantic import BaseModel, Field, computed_field, field_validator, model_validator

from app.models.change_request import ImpactLevel


class ChangeRequestCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=1)
    reason: str | None = None
    impact_description: str | None = None
    # Mức tác động người tạo đề xuất; PM là người chốt (người tạo là PM thì tự chốt).
    impact_level: ImpactLevel = ImpactLevel.MODERATE

    @model_validator(mode="after")
    def normalize(self):
        self.title = self.title.strip()
        self.description = self.description.strip()
        return self


class ChangeRequestResponse(BaseModel):
    id: int
    project_id: int
    requested_by_id: int
    title: str
    description: str
    reason: str | None
    impact_description: str | None
    status: str
    impact_level: str
    impact_level_confirmed_by_id: int | None
    impact_level_confirmed_at: datetime | None
    impact_level_change_reason: str | None
    applied_at: datetime | None
    created_at: datetime
    model_config = {"from_attributes": True}

    @computed_field  # type: ignore[prop-decorator]
    @property
    def impact_level_confirmed(self) -> bool:
        """True khi PM (hoặc hệ thống với dữ liệu cũ) đã chốt mức; chưa chốt thì chưa quyết định được bước duyệt."""
        return self.impact_level_confirmed_at is not None


class ImpactLevelUpdateRequest(BaseModel):
    """PM chốt hoặc đổi mức tác động. Hạ mức từ MAJOR bắt buộc có lý do (kiểm tra ở service)."""

    level: ImpactLevel
    reason: str | None = Field(default=None, max_length=2000)

    @field_validator("reason")
    @classmethod
    def strip_reason(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None
