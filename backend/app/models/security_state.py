"""Server-only, expiring auth state; Redis loss cannot restore revoked credentials."""

from datetime import datetime

from sqlalchemy import JSON, CheckConstraint, DateTime, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SecurityState(Base):
    __tablename__ = "security_states"
    __table_args__ = (
        UniqueConstraint("namespace", "key_hash", name="uq_security_states_key"),
        CheckConstraint("counter >= 0", name="ck_security_states_counter"),
        Index("ix_security_states_expiry", "expires_at"),
    )

    namespace: Mapped[str] = mapped_column(String(40), nullable=False)
    key_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    payload: Mapped[dict | None] = mapped_column(JSON(none_as_null=True))
    counter: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
