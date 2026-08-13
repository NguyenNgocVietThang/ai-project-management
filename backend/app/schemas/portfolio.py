from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.portfolio import PortfolioStatus


class PortfolioBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = Field(default=None, ge=0)
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
    def normalize_description(cls, value: Optional[str]) -> Optional[str]:
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
    name: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[PortfolioStatus] = None
    budget: Optional[float] = Field(default=None, ge=0)
    currency: Optional[str] = Field(default=None, min_length=3, max_length=10)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: Optional[str]) -> Optional[str]:
        return value.strip().upper() if value else value


class PortfolioCapabilities(BaseModel):
    can_update: bool
    can_delete: bool
    can_create_project: bool


class PortfolioProjectSummary(BaseModel):
    id: int
    name: str
    status: str
    methodology: str
    start_date: Optional[date]
    end_date: Optional[date]
    progress_percent: float
    budget: Optional[float]


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    budget: Optional[float]
    currency: str
    owner_id: int
    project_count: int
    progress_percent: float
    created_at: datetime
    updated_at: datetime
    capabilities: PortfolioCapabilities


class PortfolioDetailResponse(PortfolioResponse):
    projects: list[PortfolioProjectSummary]
