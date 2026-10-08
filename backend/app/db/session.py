from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

connect_args = {
    **({"ssl": True} if settings.DATABASE_SSL else {}),
    **({"prepared_statement_cache_size": 0, "statement_cache_size": 0} if settings.DATABASE_DISABLE_PREPARED_STATEMENTS else {}),
}

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    echo=False,  # SQL bind parameters may contain reset links and document text.
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=connect_args,
    future=True,
)

# Auth state must progress even when every application connection is held by
# authenticated requests waiting for a rate-limit/revocation operation.
security_engine = create_async_engine(
    settings.DATABASE_URL, pool_size=1, max_overflow=0, pool_timeout=4,
    echo=False, pool_pre_ping=True, pool_recycle=300, connect_args=connect_args,
)
SecuritySessionLocal = async_sessionmaker(
    security_engine, expire_on_commit=False, autoflush=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: trả về (yield) một async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
