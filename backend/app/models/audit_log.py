from typing import Optional
from sqlalchemy import ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.request_context import get_client_ip
from app.models.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("ix_audit_entity", "entity_type", "entity_id"),
        Index("ix_audit_user_created", "user_id", "created_at"),
    )

    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)        # VD: "CREATE", "UPDATE", "DELETE"
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)   # VD: "Task", "Project"
    entity_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    old_values: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    new_values: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    # Được điền tự động từ request context tại thời điểm INSERT, nên mọi lần ghi
    # audit đều lưu IP của bên gọi mà không cần từng nơi gọi phải truyền vào.
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45), nullable=True, default=get_client_ip
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<AuditLog id={self.id} {self.entity_type}#{self.entity_id} {self.action}>"
