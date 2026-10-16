"""Cổng nhà đầu tư: quản lý quyền xem portfolio và đọc số liệu tổng hợp chỉ đọc.

Quyền luôn đọc thẳng từ DB ở mỗi request (không cache), nên thu hồi có hiệu lực
ngay ở request kế tiếp.
"""
from dataclasses import asdict
from datetime import date
from typing import Annotated

from fastapi import Depends
from sqlalchemy import exists, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.project import Project, ProjectStatus
from app.models.risk_report import RiskLevel, RiskReport
from app.models.task import Task
from app.models.user import User
from app.schemas.investor import (
    InvestorGrantResponse,
    InvestorPortfolioItem,
    InvestorPortfolioOverview,
    InvestorProjectDetail,
    InvestorProjectRow,
    MetricsResponse,
    PortfolioBrief,
)
from app.services.dashboard_service import project_task_counts
from app.services.evm import HEALTH_KEYS, Metrics, aggregate_metrics, compute_project_metrics
from app.services.phase2_common import is_admin

INVESTOR_ROLE = "Investor"

# Chỉ lấy cột cần cho số liệu, không nạp cả đối tượng Project.
_PROJECT_COLUMNS = (
    Project.id, Project.portfolio_id, Project.name, Project.status, Project.start_date,
    Project.end_date, Project.progress, Project.currency, Project.budget,
    Project.actual_cost, Project.expected_benefit,
)


class InvestorService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ── Tra cứu portfolio và quyền ────────────────────────────────────────────

    async def _active_portfolio(self, portfolio_id: int) -> Portfolio:
        portfolio = await self.db.scalar(
            select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.deleted_at.is_(None))
        )
        if portfolio is None:
            raise NotFoundException("Portfolio not found")
        return portfolio

    async def _managed_portfolio(self, portfolio_id: int, actor: User) -> Portfolio:
        portfolio = await self._active_portfolio(portfolio_id)
        if not is_admin(actor) and portfolio.owner_id != actor.id:
            raise ForbiddenException("Only the portfolio owner or an admin can manage investors")
        return portfolio

    async def _viewable_portfolio(self, portfolio_id: int, user: User) -> Portfolio:
        portfolio = await self._active_portfolio(portfolio_id)
        if is_admin(user) or portfolio.owner_id == user.id:
            return portfolio
        granted = await self.db.scalar(
            select(
                exists().where(
                    PortfolioInvestor.portfolio_id == portfolio.id,
                    PortfolioInvestor.user_id == user.id,
                )
            )
        )
        if not granted:
            raise ForbiddenException("You do not have access to this portfolio")
        return portfolio

    # ── Quản lý quyền investor ────────────────────────────────────────────────

    @staticmethod
    def _grant_response(grant: PortfolioInvestor, user: User) -> InvestorGrantResponse:
        return InvestorGrantResponse(
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            granted_at=grant.created_at,
            granted_by_id=grant.granted_by_id,
        )

    def _audit(self, actor: User, action: str, portfolio: Portfolio, investor_id: int) -> None:
        self.db.add(
            AuditLog(
                user_id=actor.id,
                action=action,
                entity_type="Portfolio",
                entity_id=portfolio.id,
                new_values={"investor_id": investor_id},
                description=f"{action.title()} on portfolio {portfolio.name}",
            )
        )

    async def list_grants(self, portfolio_id: int, actor: User) -> list[InvestorGrantResponse]:
        await self._managed_portfolio(portfolio_id, actor)
        result = await self.db.execute(
            select(PortfolioInvestor, User)
            .join(User, User.id == PortfolioInvestor.user_id)
            .where(PortfolioInvestor.portfolio_id == portfolio_id)
            .order_by(PortfolioInvestor.created_at, PortfolioInvestor.id)
        )
        return [self._grant_response(grant, user) for grant, user in result.all()]

    async def grant(
        self, portfolio_id: int, email: str, actor: User
    ) -> tuple[InvestorGrantResponse, bool]:
        portfolio = await self._managed_portfolio(portfolio_id, actor)
        target = await self.db.scalar(
            select(User).where(func.lower(User.email) == email.strip().lower())
        )
        if target is None:
            raise NotFoundException("User not found")
        if not any(role.name == INVESTOR_ROLE for role in target.roles):
            raise BadRequestException("User does not have the Investor role")

        existing = await self.db.scalar(
            select(PortfolioInvestor).where(
                PortfolioInvestor.portfolio_id == portfolio.id,
                PortfolioInvestor.user_id == target.id,
            )
        )
        if existing is not None:
            return self._grant_response(existing, target), False

        grant = PortfolioInvestor(
            portfolio_id=portfolio.id, user_id=target.id, granted_by_id=actor.id
        )
        self.db.add(grant)
        await self.db.flush()
        # Nạp created_at do server sinh; truy cập thuộc tính hết hạn trong async sẽ lỗi.
        await self.db.refresh(grant)
        self._audit(actor, "GRANT_INVESTOR", portfolio, target.id)
        await self.db.flush()
        return self._grant_response(grant, target), True

    async def revoke(self, portfolio_id: int, user_id: int, actor: User) -> None:
        portfolio = await self._managed_portfolio(portfolio_id, actor)
        grant = await self.db.scalar(
            select(PortfolioInvestor).where(
                PortfolioInvestor.portfolio_id == portfolio.id,
                PortfolioInvestor.user_id == user_id,
            )
        )
        if grant is None:
            raise NotFoundException("Investor access not found")
        await self.db.delete(grant)
        await self.db.flush()
        self._audit(actor, "REVOKE_INVESTOR", portfolio, user_id)
        await self.db.flush()

    # ── Đọc số liệu ───────────────────────────────────────────────────────────

    async def _project_rows(self, portfolio_ids: list[int]):
        if not portfolio_ids:
            return []
        result = await self.db.execute(
            select(*_PROJECT_COLUMNS)
            .where(Project.portfolio_id.in_(portfolio_ids), Project.deleted_at.is_(None))
            .order_by(Project.id)
        )
        return result.all()

    async def _latest_risks(self, project_ids: list[int]) -> dict:
        if not project_ids:
            return {}
        # max(id) thay vì max(created_at) để không trùng khi hai báo cáo cùng thời điểm.
        latest = (
            select(func.max(RiskReport.id).label("id"))
            .where(RiskReport.project_id.in_(project_ids))
            .group_by(RiskReport.project_id)
            .subquery()
        )
        result = await self.db.execute(
            select(
                RiskReport.project_id, RiskReport.risk_level,
                RiskReport.risk_score, RiskReport.summary,
            ).join(latest, RiskReport.id == latest.c.id)
        )
        return {row.project_id: row for row in result.all()}

    @staticmethod
    def _metrics(project, today: date) -> Metrics:
        return compute_project_metrics(
            budget=project.budget,
            actual_cost=project.actual_cost,
            progress=project.progress,
            start_date=project.start_date,
            end_date=project.end_date,
            expected_benefit=project.expected_benefit,
            today=today,
        )

    @staticmethod
    def _exclusion(project, metrics: Metrics, currency: str) -> str | None:
        if project.currency != currency:
            return "currency_mismatch"
        if metrics.bac is None:
            return "no_budget"
        return None

    def _row(self, project, metrics: Metrics, currency: str, task_row, risk) -> InvestorProjectRow:
        reason = self._exclusion(project, metrics, currency)
        return InvestorProjectRow(
            id=project.id,
            name=project.name,
            status=project.status.value,
            start_date=project.start_date,
            end_date=project.end_date,
            progress=round(project.progress, 1),
            currency=project.currency,
            metrics=MetricsResponse(**asdict(metrics)),
            risk_level=risk.risk_level.value if risk else None,
            risk_score=risk.risk_score if risk else None,
            overdue_tasks=int(task_row.overdue or 0) if task_row else 0,
            excluded_from_totals=reason is not None,
            exclusion_reason=reason,
        )

    async def portfolio_overview(
        self, portfolio_id: int, user: User, today: date | None = None
    ) -> InvestorPortfolioOverview:
        today = today or date.today()
        portfolio = await self._viewable_portfolio(portfolio_id, user)
        projects = await self._project_rows([portfolio.id])
        ids = [project.id for project in projects]
        task_map = {row.project_id: row for row in await project_task_counts(self.db, ids, today)}
        risks = await self._latest_risks(ids)

        rows: list[InvestorProjectRow] = []
        included: list[Metrics] = []
        for project in projects:
            metrics = self._metrics(project, today)
            row = self._row(project, metrics, portfolio.currency, task_map.get(project.id), risks.get(project.id))
            rows.append(row)
            if not row.excluded_from_totals:
                included.append(metrics)

        health = dict.fromkeys(HEALTH_KEYS, 0)
        risk_counts = {level.value: 0 for level in RiskLevel} | {"none": 0}
        for row in rows:
            health[row.metrics.health] += 1
            risk_counts[row.risk_level or "none"] += 1
        overdue = sum(
            1 for row in rows
            if row.end_date and row.end_date < today and row.status != ProjectStatus.COMPLETED.value
        )
        return InvestorPortfolioOverview(
            portfolio=PortfolioBrief(
                id=portfolio.id,
                name=portfolio.name,
                description=portfolio.description,
                status=portfolio.status.value,
                start_date=portfolio.start_date,
                end_date=portfolio.end_date,
                budget=portfolio.budget,
                currency=portfolio.currency,
            ),
            totals=MetricsResponse(**asdict(aggregate_metrics(included))),
            health_distribution=health,
            risk_distribution=risk_counts,
            overdue_projects=overdue,
            projects=rows,
        )

    async def list_portfolios(
        self, user: User, *, skip: int, limit: int, today: date | None = None
    ) -> tuple[list[InvestorPortfolioItem], int]:
        today = today or date.today()
        admin = is_admin(user)
        grant_join = (PortfolioInvestor.portfolio_id == Portfolio.id) & (
            PortfolioInvestor.user_id == user.id
        )
        conditions = [Portfolio.deleted_at.is_(None)]
        if not admin:
            conditions.append(or_(Portfolio.owner_id == user.id, PortfolioInvestor.id.is_not(None)))

        total = await self.db.scalar(
            select(func.count(Portfolio.id))
            .select_from(Portfolio)
            .outerjoin(PortfolioInvestor, grant_join)
            .where(*conditions)
        )
        result = await self.db.execute(
            select(Portfolio, PortfolioInvestor.created_at.label("granted_at"))
            .outerjoin(PortfolioInvestor, grant_join)
            .where(*conditions)
            .order_by(Portfolio.name, Portfolio.id)
            .offset(skip)
            .limit(limit)
        )
        page = result.all()
        projects = await self._project_rows([row.Portfolio.id for row in page])

        items: list[InvestorPortfolioItem] = []
        for row in page:
            portfolio = row.Portfolio
            own = [project for project in projects if project.portfolio_id == portfolio.id]
            included = []
            for project in own:
                metrics = self._metrics(project, today)
                if self._exclusion(project, metrics, portfolio.currency) is None:
                    included.append(metrics)
            totals = aggregate_metrics(included)
            # Xem với tư cách admin hoặc chủ thì không hiện thời điểm cấp quyền.
            viewing_as_investor = not admin and portfolio.owner_id != user.id
            items.append(
                InvestorPortfolioItem(
                    id=portfolio.id,
                    name=portfolio.name,
                    status=portfolio.status.value,
                    currency=portfolio.currency,
                    budget=portfolio.budget,
                    project_count=len(own),
                    total_bac=totals.bac,
                    total_ac=totals.ac,
                    cpi=totals.cpi,
                    spi=totals.spi,
                    health=totals.health,
                    granted_at=row.granted_at if viewing_as_investor else None,
                )
            )
        return items, int(total or 0)

    async def project_summary(
        self, project_id: int, user: User, today: date | None = None
    ) -> InvestorProjectDetail:
        today = today or date.today()
        project = (
            await self.db.execute(
                select(*_PROJECT_COLUMNS).where(Project.id == project_id, Project.deleted_at.is_(None))
            )
        ).first()
        # Dự án không thuộc portfolio nào trả 404 để không lộ sự tồn tại.
        if project is None or project.portfolio_id is None:
            raise NotFoundException("Project not found")
        portfolio = await self._viewable_portfolio(project.portfolio_id, user)

        task_rows = await project_task_counts(self.db, [project.id], today)
        risks = await self._latest_risks([project.id])
        status_rows = await self.db.execute(
            select(Task.status, func.count().label("cnt"))
            .where(Task.project_id == project.id, Task.archived_at.is_(None))
            .group_by(Task.status)
        )
        metrics = self._metrics(project, today)
        row = self._row(
            project, metrics, portfolio.currency,
            task_rows[0] if task_rows else None, risks.get(project.id),
        )
        risk = risks.get(project.id)
        return InvestorProjectDetail(
            **row.model_dump(),
            portfolio_id=portfolio.id,
            task_counts={status.value: int(cnt) for status, cnt in status_rows.all()},
            risk_summary=risk.summary if risk else None,
        )


async def get_investor_service(db: Annotated[AsyncSession, Depends(get_db)]) -> InvestorService:
    return InvestorService(db)


InvestorServiceDep = Annotated[InvestorService, Depends(get_investor_service)]
