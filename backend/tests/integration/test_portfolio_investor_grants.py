"""Cấp/thu hồi quyền investor trên portfolio: chỉ admin hoặc chủ portfolio."""
import pytest
from sqlalchemy import select

from app.models.audit_log import AuditLog
from app.models.permission import Permission
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.role import Role


@pytest.fixture
async def grant_setup(session, make_user, seed_roles):
    read = Permission(resource="portfolio", action="read")
    investor_role = Role(name="Investor", description="Investor role")
    investor_role.permissions = [read]
    session.add_all([read, investor_role])
    await session.flush()

    owner = await make_user(roles=[seed_roles["PM"]])
    stranger = await make_user(roles=[seed_roles["PM"]])
    admin = await make_user(roles=[seed_roles["Admin"]])
    investor = await make_user(email="inv@example.com", roles=[investor_role])
    member = await make_user(email="member@example.com", roles=[seed_roles["Member"]])
    await make_user(email="gone@example.com", roles=[investor_role], active=False)
    portfolio = Portfolio(name="Growth", owner_id=owner.id, currency="VND")
    session.add(portfolio)
    await session.flush()
    return {
        "owner": owner, "stranger": stranger, "admin": admin,
        "investor": investor, "member": member, "portfolio": portfolio,
    }


def url(setup):
    return f"/api/v1/portfolios/{setup['portfolio'].id}/investors"


@pytest.mark.asyncio
async def test_chu_portfolio_cap_quyen_thanh_cong_va_co_audit(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "INV@example.com"})
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["user_id"] == grant_setup["investor"].id
    assert body["granted_by_id"] == grant_setup["owner"].id
    audit = await session.scalar(select(AuditLog).where(AuditLog.action == "GRANT_INVESTOR"))
    assert audit is not None and audit.entity_id == grant_setup["portfolio"].id
    assert audit.description == "Grant investor on portfolio Growth"


@pytest.mark.asyncio
async def test_cap_quyen_lap_lai_la_idempotent(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        first = await client.post(url(grant_setup), json={"email": "inv@example.com"})
        second = await client.post(url(grant_setup), json={"email": "inv@example.com"})
    assert first.status_code == 201
    assert second.status_code == 200
    rows = (await session.scalars(select(PortfolioInvestor))).all()
    assert len(rows) == 1


@pytest.mark.asyncio
async def test_user_khong_co_role_investor_bi_tu_choi(as_user, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "member@example.com"})
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_email_khong_ton_tai_tra_404(as_user, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "nobody@example.com"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_user_bi_khoa_xu_ly_nhu_email_khong_ton_tai(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "gone@example.com"})
    assert response.status_code == 404
    assert (await session.scalars(select(PortfolioInvestor))).all() == []


@pytest.mark.asyncio
@pytest.mark.parametrize("who", ["stranger", "investor"])
async def test_nguoi_khong_phai_chu_khong_quan_ly_duoc(as_user, grant_setup, who):
    async with as_user(grant_setup[who]) as client:
        listing = await client.get(url(grant_setup))
        granting = await client.post(url(grant_setup), json={"email": "inv@example.com"})
    assert listing.status_code == 403
    assert granting.status_code == 403


@pytest.mark.asyncio
async def test_admin_liet_ke_va_thu_hoi(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        await client.post(url(grant_setup), json={"email": "inv@example.com"})
    async with as_user(grant_setup["admin"]) as client:
        listing = await client.get(url(grant_setup))
        revoke = await client.delete(f"{url(grant_setup)}/{grant_setup['investor'].id}")
        again = await client.delete(f"{url(grant_setup)}/{grant_setup['investor'].id}")
    assert listing.status_code == 200
    assert [item["email"] for item in listing.json()] == ["inv@example.com"]
    assert revoke.status_code == 204
    assert again.status_code == 404
    audit = await session.scalar(select(AuditLog).where(AuditLog.action == "REVOKE_INVESTOR"))
    assert audit is not None
