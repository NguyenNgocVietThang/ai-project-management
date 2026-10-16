"""Cổng nhà đầu tư: ma trận quyền, số liệu và ngân sách truy vấn."""
from datetime import date, timedelta

import pytest
from sqlalchemy import event

from app.models.permission import Permission
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.project import Project, ProjectStatus
from app.models.risk_report import RiskLevel, RiskReport
from app.models.role import Role
from app.models.task import Task


@pytest.fixture
async def investor_setup(session, make_user, seed_roles):
    read = Permission(resource="portfolio", action="read")
    investor_role = Role(name="Investor", description="Investor role")
    investor_role.permissions = [read]
    session.add_all([read, investor_role])
    await session.flush()

    # Seed thật cho PM quyền portfolio:read; fixture seed_roles thì không. Các role từ
    # seed_roles (trừ Admin) chưa nạp `permissions`, nên require_permissions sẽ kích hoạt
    # lazy load ngoài greenlet. Vì vậy dùng role riêng đã gán sẵn permissions tường minh.
    pm_reader = Role(name="PMReader", description="PM portfolio read")
    pm_reader.permissions = [read]
    plain_member = Role(name="PlainMember", description="Khong co quyen portfolio")
    plain_member.permissions = []
    session.add_all([pm_reader, plain_member])
    await session.flush()

    owner = await make_user(roles=[pm_reader])
    admin = await make_user(roles=[seed_roles["Admin"]], superuser=True)
    granted = await make_user(roles=[investor_role])
    other_investor = await make_user(roles=[investor_role])
    no_permission = await make_user(roles=[plain_member])
    # Có dòng cấp quyền và portfolio:read qua role khác nhưng không còn role Investor.
    stale_grant = await make_user(roles=[pm_reader])

    portfolio = Portfolio(name="Growth", owner_id=owner.id, currency="VND")
    session.add(portfolio)
    await session.flush()

    today = date.today()
    alpha = Project(
        name="Alpha", pm_id=owner.id, portfolio_id=portfolio.id, currency="VND",
        budget=1000.0, actual_cost=400.0, progress=50.0, expected_benefit=1200.0,
        start_date=today - timedelta(days=10), end_date=today + timedelta(days=10),
        status=ProjectStatus.ACTIVE,
    )
    usd = Project(
        name="Overseas", pm_id=owner.id, portfolio_id=portfolio.id, currency="USD",
        budget=500.0, actual_cost=100.0, progress=20.0,
        start_date=today - timedelta(days=10), end_date=today + timedelta(days=10),
    )
    unbudgeted = Project(
        name="Seed", pm_id=owner.id, portfolio_id=portfolio.id, currency="VND",
        start_date=today - timedelta(days=30), end_date=today - timedelta(days=1),
    )
    standalone = Project(name="Lonely", pm_id=owner.id, currency="VND")
    session.add_all([alpha, usd, unbudgeted, standalone])
    await session.flush()
    session.add_all([
        RiskReport(project_id=alpha.id, risk_score=2.0, risk_level=RiskLevel.LOW),
        RiskReport(project_id=alpha.id, risk_score=8.0, risk_level=RiskLevel.HIGH, summary="Late vendor"),
        Task(project_id=alpha.id, name="Overdue", due_date=today - timedelta(days=2)),
        PortfolioInvestor(portfolio_id=portfolio.id, user_id=granted.id, granted_by_id=owner.id),
        PortfolioInvestor(portfolio_id=portfolio.id, user_id=stale_grant.id, granted_by_id=owner.id),
    ])
    await session.flush()
    return {
        "owner": owner, "admin": admin, "granted": granted, "other_investor": other_investor,
        "no_permission": no_permission, "stale_grant": stale_grant, "portfolio": portfolio, "alpha": alpha, "usd": usd,
        "unbudgeted": unbudgeted, "standalone": standalone,
    }


def overview_url(setup):
    return f"/api/v1/investor/portfolios/{setup['portfolio'].id}"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("who", "expected"),
    [
        ("granted", 200), ("owner", 200), ("admin", 200), ("other_investor", 403),
        ("no_permission", 403), ("stale_grant", 403),
    ],
)
async def test_ma_tran_quyen_overview(as_user, investor_setup, who, expected):
    async with as_user(investor_setup[who]) as client:
        response = await client.get(overview_url(investor_setup))
        project = await client.get(f"/api/v1/investor/projects/{investor_setup['alpha'].id}")
    assert response.status_code == expected
    assert project.status_code == expected


@pytest.mark.asyncio
async def test_danh_sach_chi_gom_portfolio_duoc_cap(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        granted = await client.get("/api/v1/investor/portfolios")
    async with as_user(investor_setup["other_investor"]) as client:
        other = await client.get("/api/v1/investor/portfolios")
    assert granted.status_code == 200
    items = granted.json()["items"]
    assert [item["id"] for item in items] == [investor_setup["portfolio"].id]
    assert items[0]["granted_at"] is not None
    assert items[0]["project_count"] == 3
    assert other.json()["items"] == []


@pytest.mark.asyncio
async def test_dong_cap_quyen_khong_con_role_investor_khong_hien_trong_danh_sach(as_user, investor_setup):
    async with as_user(investor_setup["stale_grant"]) as client:
        response = await client.get("/api/v1/investor/portfolios")
    assert response.status_code == 200
    assert response.json()["items"] == []


@pytest.mark.asyncio
async def test_so_lieu_overview(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(overview_url(investor_setup))).json()

    totals = body["totals"]
    # Chỉ Alpha được gộp: Overseas khác tiền tệ, Seed chưa có ngân sách.
    assert totals["bac"] == 1000.0
    assert totals["ac"] == 400.0
    assert totals["cpi"] == 1.25
    assert totals["roi"] == 0.5
    assert totals["roi_basis"] == "eac"

    rows = {row["name"]: row for row in body["projects"]}
    assert rows["Alpha"]["excluded_from_totals"] is False
    assert rows["Alpha"]["risk_level"] == "HIGH"  # báo cáo mới nhất
    assert rows["Alpha"]["overdue_tasks"] == 1
    assert rows["Overseas"]["exclusion_reason"] == "currency_mismatch"
    assert rows["Seed"]["exclusion_reason"] == "no_budget"
    assert "Lonely" not in rows

    assert body["risk_distribution"] == {"LOW": 0, "MEDIUM": 0, "HIGH": 1, "CRITICAL": 0, "none": 2}
    assert sum(body["health_distribution"].values()) == 3
    assert body["overdue_projects"] == 1  # Seed đã qua end_date và chưa COMPLETED


@pytest.mark.asyncio
async def test_chi_tiet_du_an_khong_lo_du_lieu_ca_nhan(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(f"/api/v1/investor/projects/{investor_setup['alpha'].id}")).json()
    assert body["risk_summary"] == "Late vendor"
    assert body["task_counts"] == {"TODO": 1}
    assert not {"members", "pm_id", "worklogs", "messages"} & set(body)


@pytest.mark.asyncio
async def test_du_an_ngoai_portfolio_tra_404(as_user, investor_setup):
    async with as_user(investor_setup["admin"]) as client:
        response = await client.get(f"/api/v1/investor/projects/{investor_setup['standalone'].id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_thu_hoi_co_hieu_luc_ngay(as_user, investor_setup):
    project_url = f"/api/v1/investor/projects/{investor_setup['alpha'].id}"
    async with as_user(investor_setup["granted"]) as client:
        before = await client.get(overview_url(investor_setup))
    async with as_user(investor_setup["owner"]) as client:
        revoke = await client.delete(
            f"/api/v1/portfolios/{investor_setup['portfolio'].id}/investors/{investor_setup['granted'].id}"
        )
    async with as_user(investor_setup["granted"]) as client:
        after = await client.get(overview_url(investor_setup))
        project = await client.get(project_url)
        listing = await client.get("/api/v1/investor/portfolios")
    assert (before.status_code, revoke.status_code, after.status_code) == (200, 204, 403)
    assert project.status_code == 403
    assert listing.status_code == 200
    assert listing.json()["items"] == []


@pytest.mark.asyncio
async def test_investor_khong_ghi_duoc(as_user, investor_setup):
    portfolio_id = investor_setup["portfolio"].id
    project_id = investor_setup["alpha"].id
    async with as_user(investor_setup["granted"]) as client:
        portfolio = await client.patch(f"/api/v1/portfolios/{portfolio_id}", json={"name": "Hacked"})
        project = await client.patch(f"/api/v1/projects/{project_id}", json={"name": "Hacked"})
        task = await client.post(f"/api/v1/projects/{project_id}/tasks", json={"name": "Hacked task"})
    assert portfolio.status_code == 403
    assert project.status_code == 403
    assert task.status_code == 403


@pytest.mark.asyncio
async def test_so_cau_sql_khong_doi_theo_so_du_an(as_user, session, engine, investor_setup):
    statements: list[str] = []

    def count(conn, cursor, statement, parameters, context, executemany):
        statements.append(statement)

    async def measure() -> int:
        statements.clear()
        event.listen(engine.sync_engine, "before_cursor_execute", count)
        try:
            async with as_user(investor_setup["granted"]) as client:
                response = await client.get(overview_url(investor_setup))
            assert response.status_code == 200
        finally:
            event.remove(engine.sync_engine, "before_cursor_execute", count)
        return len(statements)

    small = await measure()
    for index in range(17):
        session.add(Project(
            name=f"Extra {index}", pm_id=investor_setup["owner"].id,
            portfolio_id=investor_setup["portfolio"].id, budget=100.0, currency="VND",
        ))
    await session.flush()
    large = await measure()
    assert small <= 6
    assert large == small


@pytest.mark.asyncio
async def test_du_an_huy_qua_han_khong_tinh_la_tre_han(as_user, session, investor_setup):
    today = date.today()
    session.add(Project(
        name="Dropped", pm_id=investor_setup["owner"].id, portfolio_id=investor_setup["portfolio"].id,
        currency="VND", status=ProjectStatus.CANCELLED,
        start_date=today - timedelta(days=30), end_date=today - timedelta(days=5),
    ))
    await session.flush()
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(overview_url(investor_setup))).json()
    # Vẫn chỉ Seed (chưa COMPLETED/CANCELLED) được tính là trễ hạn.
    assert body["overdue_projects"] == 1


@pytest.mark.asyncio
async def test_so_sanh_tien_te_khong_phan_biet_hoa_thuong(as_user, session, investor_setup):
    session.add(Project(
        name="Lowercase", pm_id=investor_setup["owner"].id, portfolio_id=investor_setup["portfolio"].id,
        currency="vnd", budget=200.0, actual_cost=50.0, progress=10.0,
    ))
    await session.flush()
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(overview_url(investor_setup))).json()
    rows = {row["name"]: row for row in body["projects"]}
    assert rows["Lowercase"]["excluded_from_totals"] is False
    assert body["totals"]["bac"] == 1200.0
