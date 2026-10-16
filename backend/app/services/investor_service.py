"""Cổng nhà đầu tư: quản lý quyền xem portfolio và đọc số liệu tổng hợp chỉ đọc.

Quyền luôn đọc thẳng từ DB ở mỗi request (không cache), nên thu hồi có hiệu lực
ngay ở request kế tiếp.
"""
from typing import Annotated

from fastapi import Depends
from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.user import User
from app.schemas.investor import InvestorGrantResponse
from app.services.phase2_common import is_admin

INVESTOR_ROLE = "Investor"


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


async def get_investor_service(db: Annotated[AsyncSession, Depends(get_db)]) -> InvestorService:
    return InvestorService(db)


InvestorServiceDep = Annotated[InvestorService, Depends(get_investor_service)]
