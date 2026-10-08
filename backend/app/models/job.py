"""Transactional outbox and durable leases for bounded application workers."""

from datetime import datetime

from sqlalchemy import JSON, Boolean, CheckConstraint, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        CheckConstraint(
            "status IN ('queued', 'running', 'succeeded', 'failed')", name="ck_jobs_status"
        ),
        CheckConstraint(
            "attempts >= 0 AND max_attempts > 0 AND generation > 0", name="ck_jobs_attempts"
        ),
        Index("ix_jobs_ready", "status", "available_at", "id"),
        Index("ix_jobs_lease", "status", "lease_expires_at"),
        Index("ix_jobs_owner", "owner_id", "created_at"),
    )

    kind: Mapped[str] = mapped_column(String(64), nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    dedupe_key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(String(16), default="queued", nullable=False)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_attempts: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    generation: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    available_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    lease_token: Mapped[str | None] = mapped_column(String(36))
    lease_generation: Mapped[int | None] = mapped_column(Integer)
    lease_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    error_code: Mapped[str | None] = mapped_column(String(64))
    result: Mapped[dict | None] = mapped_column(JSON(none_as_null=True))
    staged_result: Mapped[dict | None] = mapped_column(JSON(none_as_null=True))
    request_dispatched: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    request_dispatched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ambiguous_on_lease_loss: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
