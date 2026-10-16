"""Schema cổng nhà đầu tư (Phase 5, 5.3)."""
from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class InvestorGrantCreate(BaseModel):
    email: EmailStr


class InvestorGrantResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    granted_at: datetime
    granted_by_id: int | None


class MetricsResponse(BaseModel):
    bac: float | None
    ac: float
    ev: float | None
    pv: float | None
    cpi: float | None
    spi: float | None
    eac: float | None
    vac: float | None
    expected_benefit: float | None
    roi: float | None
    roi_basis: str | None
    health: str


class InvestorProjectRow(BaseModel):
    id: int
    name: str
    status: str
    start_date: date | None
    end_date: date | None
    progress: float
    currency: str
    metrics: MetricsResponse
    risk_level: str | None
    risk_score: float | None
    overdue_tasks: int
    excluded_from_totals: bool
    # "currency_mismatch" | "no_budget" | None
    exclusion_reason: str | None


class InvestorProjectDetail(InvestorProjectRow):
    portfolio_id: int
    task_counts: dict[str, int]
    risk_summary: str | None


class PortfolioBrief(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    start_date: date | None
    end_date: date | None
    budget: float | None
    currency: str


class InvestorPortfolioItem(BaseModel):
    id: int
    name: str
    status: str
    currency: str
    budget: float | None
    project_count: int
    total_bac: float | None
    total_ac: float
    cpi: float | None
    spi: float | None
    health: str
    granted_at: datetime | None


class InvestorPortfolioOverview(BaseModel):
    portfolio: PortfolioBrief
    totals: MetricsResponse
    health_distribution: dict[str, int]
    risk_distribution: dict[str, int]
    overdue_projects: int
    projects: list[InvestorProjectRow]
