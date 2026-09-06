import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class AIRequestType(str, enum.Enum):
    PROJECT_GENERATE = "PROJECT_GENERATE"
    IMPACT_ANALYSIS = "IMPACT_ANALYSIS"
    SCHEDULE_OPTIMIZE = "SCHEDULE_OPTIMIZE"
    RESOURCE_RECOMMEND = "RESOURCE_RECOMMEND"
    RISK_ANALYSIS = "RISK_ANALYSIS"
    DOCUMENT_PARSE = "DOCUMENT_PARSE"


class AIRequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AIRequest(Base):
    __tablename__ = "ai_requests"
    __table_args__ = (
        Index("ix_ai_requests_project_type", "project_id", "request_type", "status"),
    )

    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    request_type: Mapped[AIRequestType] = mapped_column(Enum(AIRequestType), nullable=False)
    status: Mapped[AIRequestStatus] = mapped_column(Enum(AIRequestStatus), default=AIRequestStatus.PENDING)
    input_data_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    celery_task_id: Mapped[str | None] = mapped_column(String(255), nullable=True)  # ID của Celery task
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped[Optional["Project"]] = relationship("Project")
    user: Mapped["User"] = relationship("User")
    output: Mapped[Optional["AIOutput"]] = relationship("AIOutput", back_populates="ai_request", uselist=False)

    def __repr__(self) -> str:
        return f"<AIRequest id={self.id} type={self.request_type} status={self.status}>"
