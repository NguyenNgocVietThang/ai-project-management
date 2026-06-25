from typing import Optional
from sqlalchemy import Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class AIOutput(Base):
    __tablename__ = "ai_outputs"

    ai_request_id: Mapped[int] = mapped_column(
        ForeignKey("ai_requests.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    output_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    model_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # VD: "gpt-4o"
    processing_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    raw_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    ai_request: Mapped["AIRequest"] = relationship("AIRequest", back_populates="output")

    def __repr__(self) -> str:
        return f"<AIOutput id={self.id} request={self.ai_request_id} tokens={self.tokens_used}>"
