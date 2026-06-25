import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, JSON, String, Text
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

    project_id: Mapped[Optional[int]] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    request_type: Mapped[AIRequestType] = mapped_column(Enum(AIRequestType), nullable=False)
    status: Mapped[AIRequestStatus] = mapped_column(Enum(AIRequestStatus), default=AIRequestStatus.PENDING)
    input_data_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Celery task ID
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped[Optional["Project"]] = relationship("Project")
    user: Mapped["User"] = relationship("User")
    output: Mapped[Optional["AIOutput"]] = relationship("AIOutput", back_populates="ai_request", uselist=False)

    def __repr__(self) -> str:
        return f"<AIRequest id={self.id} type={self.request_type} status={self.status}>"
