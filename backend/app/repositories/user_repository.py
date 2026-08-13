from typing import List, Optional

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_by_google_id(self, google_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.google_id == google_id))
        return result.scalar_one_or_none()

    async def get_by_facebook_id(self, facebook_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.facebook_id == facebook_id))
        return result.scalar_one_or_none()

    async def get_by_password_reset_token_hash_for_update(
        self, token_hash: str
    ) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where(User.password_reset_token_hash == token_hash)
            .with_for_update()
        )
        return result.scalar_one_or_none()

    async def get_by_email_verification_token_hash_for_update(
        self, token_hash: str
    ) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where(User.email_verification_token_hash == token_hash)
            .with_for_update()
        )
        return result.scalar_one_or_none()

    async def get_by_id_for_update(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where(User.id == user_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        return result.scalar_one_or_none()

    async def search_active(self, query: str, limit: int = 20) -> List[User]:
        pattern = f"%{query.strip()}%"
        result = await self.db.execute(
            select(User)
            .where(
                User.is_active.is_(True),
                or_(
                    User.full_name.ilike(pattern),
                    User.username.ilike(pattern),
                    User.email.ilike(pattern),
                ),
            )
            .order_by(User.full_name, User.id)
            .limit(limit)
        )
        return list(result.scalars().all())
