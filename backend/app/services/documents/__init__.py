"""Mẫu tài liệu SRS/BRD và bộ dựng DOCX thuần (không gọi AI)."""
from app.services.documents.docx_renderer import (
    ContentValidation,
    DocumentRenderError,
    RenderResult,
    missing_required_sections,
    render_docx,
    render_docx_report,
    validate_content,
)
from app.services.documents.templates import (
    BRD_TEMPLATE,
    BRIEF_KEYS,
    SRS_TEMPLATE,
    TEMPLATES,
    Column,
    DocumentTemplate,
    Section,
    get_template,
    missing_brief_items,
)

__all__ = [
    "BRD_TEMPLATE",
    "BRIEF_KEYS",
    "SRS_TEMPLATE",
    "TEMPLATES",
    "Column",
    "ContentValidation",
    "DocumentRenderError",
    "DocumentTemplate",
    "RenderResult",
    "Section",
    "get_template",
    "missing_brief_items",
    "missing_required_sections",
    "render_docx",
    "render_docx_report",
    "validate_content",
]
