from typing import Optional
from sqlalchemy import Boolean, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class ProjectVersion(Base):
    __tablename__ = "project_versions"
    __table_args__ = (
        UniqueConstraint("project_id", "version_number", name="uq_project_version"),
        Index("ix_project_versions_project", "project_id", "version_number"),
    )

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)     # VD: "v1.0 - Baseline"
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_baseline: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)  # PM tạo baseline thủ công
    snapshot: Mapped[dict] = mapped_column(JSON, nullable=False)        # Toàn bộ project data dạng JSON
    change_request_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("change_requests.id", ondelete="SET NULL"), nullable=True
    )
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="versions")
    created_by: Mapped["User"] = relationship("User")
    change_request: Mapped[Optional["ChangeRequest"]] = relationship("ChangeRequest")

    def __repr__(self) -> str:
        return f"<ProjectVersion id={self.id} project={self.project_id} v{self.version_number}>"
