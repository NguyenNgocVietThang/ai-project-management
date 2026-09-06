from typing import Optional

from sqlalchemy import JSON, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.request_context import get_client_ip, get_current_project_id
from app.models.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("ix_audit_entity", "entity_type", "entity_id"),
        Index("ix_audit_user_created", "user_id", "created_at"),
        Index("ix_audit_project_created", "project_id", "created_at"),
    )

    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)        # VD: "CREATE", "UPDATE", "DELETE"
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)   # VD: "Task", "Project"
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    old_values: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    new_values: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # Được điền tự động từ request context tại thời điểm INSERT, nên mọi lần ghi
    # audit đều lưu IP của bên gọi mà không cần từng nơi gọi phải truyền vào.
    ip_address: Mapped[str | None] = mapped_column(
        String(45), nullable=True, default=get_client_ip
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Cũng được điền tự động từ request context. Nếu không có cột này thì không thể
    # lọc dòng audit theo dự án, và feed hoạt động trên dashboard buộc phải trả về
    # các thay đổi của những dự án mà người xem không thuộc về.
    project_id: Mapped[int | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        default=get_current_project_id,
    )

    user: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<AuditLog id={self.id} {self.entity_type}#{self.entity_id} {self.action}>"
