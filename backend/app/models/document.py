import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class DocumentType(str, enum.Enum):
    BRD = "BRD"
    SRS = "SRS"
    DELIVERABLE = "DELIVERABLE"
    REPORT = "REPORT"
    OTHER = "OTHER"


class Document(Base):
    __tablename__ = "documents"
    __table_args__ = (
        Index("ix_documents_project_type", "project_id", "doc_type"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    doc_type: Mapped[DocumentType] = mapped_column(Enum(DocumentType), default=DocumentType.OTHER)

    # MinIO storage info
    minio_bucket: Mapped[str] = mapped_column(String(100), nullable=False)
    minio_key: Mapped[str] = mapped_column(Text, nullable=False)          # Path trong bucket
    file_url: Mapped[str] = mapped_column(Text, nullable=False)           # Presigned URL cache

    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # bytes
    mime_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # AI parsing
    ai_parsed: Mapped[bool] = mapped_column(default=False, nullable=False)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_parsed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    uploaded_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="documents")
    uploaded_by: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<Document id={self.id} name={self.name} type={self.doc_type}>"
