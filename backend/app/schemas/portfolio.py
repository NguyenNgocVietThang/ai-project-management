from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.portfolio import PortfolioStatus


class PortfolioBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    start_date: date | None = None
    end_date: date | None = None
    budget: float | None = Field(default=None, ge=0)
    currency: str = Field(default="VND", min_length=3, max_length=10)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return value.strip().upper()

    @model_validator(mode="after")
    def dates_are_ordered(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    start_date: date | None = None
    end_date: date | None = None
    status: PortfolioStatus | None = None
    budget: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=3, max_length=10)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str | None) -> str | None:
        return value.strip().upper() if value else value

    @model_validator(mode="after")
    def dates_are_ordered(self):
        """Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate."""
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class PortfolioCapabilities(BaseModel):
    can_update: bool
    can_delete: bool
    can_create_project: bool


class PortfolioProjectSummary(BaseModel):
    id: int
    name: str
    status: str
    methodology: str
    start_date: date | None
    end_date: date | None
    progress_percent: float
    budget: float | None


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    start_date: date | None
    end_date: date | None
    budget: float | None
    currency: str
    owner_id: int
    project_count: int
    progress_percent: float
    created_at: datetime
    updated_at: datetime
    capabilities: PortfolioCapabilities


class PortfolioDetailResponse(PortfolioResponse):
    projects: list[PortfolioProjectSummary]
