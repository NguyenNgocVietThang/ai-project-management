"""Quyền xem chỉ đọc của nhà đầu tư trên một portfolio.

Một dòng nghĩa là user (role Investor) được xem số liệu tổng hợp của portfolio đó
qua /investor. `created_at` của Base chính là thời điểm cấp quyền.
"""
from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PortfolioInvestor(Base):
    __tablename__ = "portfolio_investors"
    __table_args__ = (
        UniqueConstraint("portfolio_id", "user_id", name="uq_portfolio_investors_portfolio_user"),
        Index("ix_portfolio_investors_user", "user_id"),
    )

    portfolio_id: Mapped[int] = mapped_column(
        ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Người cấp quyền; tài khoản đó bị xóa thì quyền vẫn giữ.
    granted_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    def __repr__(self) -> str:
        return f"<PortfolioInvestor portfolio={self.portfolio_id} user={self.user_id}>"
