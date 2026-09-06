"""Fixture dùng chung cho toàn bộ bộ test.

Trước file này, `tests/integration/` chỉ có một `__init__.py` rỗng và không có
conftest nào tồn tại — nghĩa là mọi test đều mock ở tầng service, và KHÔNG có test
nào từng thực thi tầng endpoint: không dependency injection, không mã trạng thái,
không response model. Hệ quả là không có gì chứng minh một route thực sự trả 403
cho vai trò sai; các dependency phân quyền có thể bị gỡ bỏ mà cả bộ test vẫn xanh.

DB là SQLite trong bộ nhớ. Nó không thay thế được Postgres cho những thứ đặc thù
dialect (index GIN, containment JSONB — xem test_schema_and_query_shape.py cho
phần đó), nhưng nó thực thi thật ma trận phân quyền, hình dạng route và các
ràng buộc, mà không cần một server đang chạy.
"""
import asyncio
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

import app.db.base  # noqa: F401 - đăng ký mọi model trước create_all
from app.core.dependencies import get_current_user
from app.core.rate_limit import limiter
from app.db.session import get_db
from app.main import app
from app.models.base import Base
from app.models.permission import Permission
from app.models.role import Role
from app.models.user import User


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
def _disable_rate_limiting():
    """Tắt rate limit theo TỪNG test, rồi khôi phục.

    `test_auth_password_recovery.py` từng đặt `limiter.enabled = False` ở cấp
    module. Việc đó rò rỉ ra toàn bộ phiên pytest: mọi test rate-limit chạy sau nó
    đều pass giả, vì limiter đã bị tắt vĩnh viễn. Fixture có phạm vi rõ ràng làm
    cho việc tắt này là cục bộ và có thể đảo ngược.
    """
    previous = limiter.enabled
    limiter.enabled = False
    yield
    limiter.enabled = previous


@pytest_asyncio.fixture
async def engine():
    # StaticPool + một connection dùng chung: SQLite ":memory:" tạo một DB riêng
    # cho mỗi connection, nên nếu không có nó thì các câu lệnh sẽ không thấy bảng
    # do câu lệnh trước tạo ra.
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def session(engine) -> AsyncIterator[AsyncSession]:
    factory = async_sessionmaker(bind=engine, expire_on_commit=False, autoflush=False)
    async with factory() as session:
        yield session


@pytest_asyncio.fixture
async def seed_roles(session: AsyncSession) -> dict[str, Role]:
    """Các vai trò dự án cùng một permission tối thiểu để kiểm tra RBAC."""
    permission = Permission(resource="project", action="create")
    session.add(permission)
    roles = {}
    for name in ("Admin", "PM", "BA", "PO", "Member", "Customer"):
        role = Role(name=name, description=f"{name} role")
        if name == "Admin":
            role.permissions = [permission]
        session.add(role)
        roles[name] = role
    await session.flush()
    return roles


@pytest_asyncio.fixture
async def make_user(session: AsyncSession):
    """Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification."""
    counter = {"n": 0}

    async def factory(
        *,
        verified: bool = True,
        active: bool = True,
        superuser: bool = False,
        roles: list[Role] | None = None,
        **overrides,
    ) -> User:
        counter["n"] += 1
        index = counter["n"]
        user = User(
            email=overrides.pop("email", f"user{index}@example.com"),
            username=overrides.pop("username", f"user{index}"),
            full_name=overrides.pop("full_name", f"User {index}"),
            hashed_password="not-used-in-tests",
            is_active=active,
            is_superuser=superuser,
            email_verified=verified,
            auth_version=0,
            **overrides,
        )
        # Gán tường minh: `User.roles` là lazy="selectin", nên nó chỉ được nạp khi
        # đối tượng đến từ một truy vấn. Một đối tượng vừa được add() thì collection
        # chưa có, và lần đầu ai đó chạm vào nó (is_admin, require_permissions) sẽ
        # kích hoạt lazy load trong ngữ cảnh đồng bộ — MissingGreenlet.
        user.roles = roles or []
        session.add(user)
        await session.flush()
        return user

    return factory


@pytest_asyncio.fixture
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    """HTTP client chưa xác thực, chạy trên app thật qua ASGI."""

    async def override_db():
        yield session

    app.dependency_overrides[get_db] = override_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as http:
        yield http
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def as_user(session: AsyncSession):
    """Trả về một client đã xác thực với tư cách `user` đã cho.

    Ghi đè chính dependency xác thực chứ không ký một JWT thật: bài test ở đây nói
    về PHÂN QUYỀN (vai trò nào được làm gì), và việc xác thực đã có bộ unit test
    riêng. Ghi đè giữ cho mục tiêu của test được rõ ràng.
    """

    async def override_db():
        yield session

    def factory(user: User) -> AsyncClient:
        app.dependency_overrides[get_db] = override_db
        # CHỈ ghi đè get_current_user. `get_current_verified_user` phụ thuộc vào nó
        # và phải chạy logic thật — ghi đè cả hai sẽ vô hiệu hoá chính cổng xác minh
        # email mà ta muốn kiểm tra, và test sẽ pass giả.
        app.dependency_overrides[get_current_user] = lambda: user
        transport = ASGITransport(app=app)
        return AsyncClient(transport=transport, base_url="http://test")

    yield factory
    app.dependency_overrides.clear()
