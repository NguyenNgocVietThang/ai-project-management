from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class ChangeRequestCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=1)
    reason: str | None = None
    impact_description: str | None = None

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
    applied_at: datetime | None
    created_at: datetime
    model_config = {"from_attributes": True}
