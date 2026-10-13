"""Mẫu tài liệu SRS và BRD có cấu trúc cố định.

Mẫu là nguồn sự thật duy nhất về các mục của tài liệu: key ổn định, tiêu đề tiếng
Việt/tiếng Anh, cấp tiêu đề, mục bắt buộc hay không, kiểu nội dung và (với bảng)
danh sách cột. AI chỉ được sinh nội dung JSON theo đúng các key này; server dựng
DOCX từ mẫu (xem ``docx_renderer``). Không gọi AI trong mô-đun này.
"""
from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any, Literal

# Ngôn ngữ hỗ trợ cho các tiêu đề cố định của tài liệu; mặc định tiếng Việt.
SUPPORTED_LANGUAGES: tuple[str, ...] = ("vi", "en")
DEFAULT_LANGUAGE = "vi"

# Key các mục của hồ sơ yêu cầu (requirement brief) mà mẫu có thể cần.
BRIEF_KEYS: tuple[str, ...] = (
    "goals",
    "stakeholders",
    "in_scope",
    "out_of_scope",
    "key_features",
    "constraints",
    "success_criteria",
)

# Trạng thái mục hồ sơ được coi là đã có dữ liệu để viết tài liệu.
BRIEF_USABLE_STATUSES: frozenset[str] = frozenset({"clear", "assumed"})

# Kiểu nội dung của một mục:
# - paragraph: AI trả chuỗi hoặc danh sách chuỗi (mỗi chuỗi một đoạn văn).
# - bullets: AI trả danh sách chuỗi.
# - table: AI trả danh sách dict, key của dict là key cột.
# - group: chỉ là tiêu đề nhóm các mục con, không nhận nội dung.
# - process: quy trình nghiệp vụ; sơ đồ PNG hoặc bảng bước truyền qua tham số
#   renderer, AI chỉ được gửi đoạn mô tả ngắn (chuỗi) nếu có.
# - assumptions: "Giả định và vấn đề mở", luôn sinh từ hồ sơ, AI không được gửi.
SectionKind = Literal["paragraph", "bullets", "table", "group", "process", "assumptions"]

# Các kiểu nội dung mà AI được phép cung cấp trong ``content``.
AI_CONTENT_KINDS: frozenset[str] = frozenset({"paragraph", "bullets", "table", "process"})


@dataclass(frozen=True)
class Column:
    """Một cột của mục dạng bảng."""

    key: str
    title_vi: str
    title_en: str

    def title(self, language: str = DEFAULT_LANGUAGE) -> str:
        return self.title_en if language == "en" else self.title_vi


@dataclass(frozen=True)
class Section:
    """Một mục của mẫu tài liệu."""

    key: str
    title_vi: str
    title_en: str
    level: int
    kind: SectionKind
    required: bool = False
    columns: tuple[Column, ...] = ()
    # Các key hồ sơ cần có dữ liệu (clear/assumed) trước khi viết mục bắt buộc này.
    brief_keys: tuple[str, ...] = ()

    def title(self, language: str = DEFAULT_LANGUAGE) -> str:
        return self.title_en if language == "en" else self.title_vi

    @property
    def accepts_ai_content(self) -> bool:
        return self.kind in AI_CONTENT_KINDS


@dataclass(frozen=True)
class DocumentTemplate:
    """Mẫu tài liệu: loại tài liệu và danh sách mục theo thứ tự hiển thị."""

    doc_type: str
    title_vi: str
    title_en: str
    sections: tuple[Section, ...] = field(default_factory=tuple)

    def title(self, language: str = DEFAULT_LANGUAGE) -> str:
        return self.title_en if language == "en" else self.title_vi

    def section(self, key: str) -> Section | None:
        for item in self.sections:
            if item.key == key:
                return item
        return None

    @property
    def section_keys(self) -> tuple[str, ...]:
        return tuple(item.key for item in self.sections)

    @property
    def content_section_keys(self) -> tuple[str, ...]:
        """Key các mục mà AI được phép cung cấp nội dung."""
        return tuple(item.key for item in self.sections if item.accepts_ai_content)

    def required_brief_map(self) -> dict[str, tuple[str, ...]]:
        """Ánh xạ "mục bắt buộc -> các key hồ sơ cần thiết"."""
        return {
            item.key: item.brief_keys
            for item in self.sections
            if item.required and item.brief_keys
        }


# Cột bảng dùng chung.
_COL_ID = Column("id", "Mã", "ID")
_COL_NAME = Column("name", "Tên", "Name")
_COL_DESCRIPTION = Column("description", "Mô tả", "Description")
_COL_PRIORITY = Column("priority", "Ưu tiên", "Priority")
_COL_ROLE = Column("role", "Vai trò", "Role")

SRS_TEMPLATE = DocumentTemplate(
    doc_type="srs",
    title_vi="Đặc tả yêu cầu phần mềm (SRS)",
    title_en="Software Requirements Specification (SRS)",
    sections=(
        Section("introduction", "Giới thiệu", "Introduction", 1, "group"),
        Section(
            "purpose", "Mục đích", "Purpose", 2, "paragraph",
            required=True, brief_keys=("goals",),
        ),
        Section(
            "scope", "Phạm vi", "Scope", 2, "paragraph",
            required=True, brief_keys=("in_scope",),
        ),
        Section(
            "definitions", "Định nghĩa thuật ngữ", "Definitions and Glossary", 2, "table",
            columns=(
                Column("term", "Thuật ngữ", "Term"),
                Column("definition", "Định nghĩa", "Definition"),
            ),
        ),
        Section(
            "overall_description", "Mô tả tổng quan", "Overall Description", 1, "paragraph",
            required=True, brief_keys=("goals", "key_features"),
        ),
        Section(
            "stakeholders", "Bên liên quan và người dùng", "Stakeholders and Users", 2, "table",
            required=True, brief_keys=("stakeholders",),
            columns=(_COL_ROLE, _COL_DESCRIPTION),
        ),
        Section(
            "functional_requirements", "Yêu cầu chức năng", "Functional Requirements", 1, "table",
            required=True, brief_keys=("key_features",),
            columns=(
                _COL_ID,
                _COL_NAME,
                _COL_DESCRIPTION,
                _COL_PRIORITY,
                Column("acceptance_criteria", "Tiêu chí chấp nhận", "Acceptance Criteria"),
            ),
        ),
        Section(
            "non_functional_requirements", "Yêu cầu phi chức năng",
            "Non-functional Requirements", 1, "table",
            columns=(
                _COL_ID,
                Column("category", "Nhóm", "Category"),
                _COL_DESCRIPTION,
            ),
        ),
        Section(
            "constraints", "Ràng buộc", "Constraints", 1, "bullets",
            required=True, brief_keys=("constraints",),
        ),
        Section("business_process", "Quy trình nghiệp vụ", "Business Process", 1, "process"),
        Section(
            "assumptions_open_issues", "Giả định và vấn đề mở",
            "Assumptions and Open Issues", 1, "assumptions",
        ),
    ),
)

BRD_TEMPLATE = DocumentTemplate(
    doc_type="brd",
    title_vi="Tài liệu yêu cầu kinh doanh (BRD)",
    title_en="Business Requirements Document (BRD)",
    sections=(
        Section(
            "executive_summary", "Tóm tắt điều hành", "Executive Summary", 1, "paragraph",
            required=True, brief_keys=("goals",),
        ),
        Section(
            "background", "Bối cảnh và vấn đề", "Background and Problem Statement", 1,
            "paragraph", required=True, brief_keys=("goals",),
        ),
        Section(
            "business_objectives", "Mục tiêu kinh doanh", "Business Objectives", 1, "bullets",
            required=True, brief_keys=("goals",),
        ),
        Section(
            "stakeholders", "Bên liên quan", "Stakeholders", 1, "table",
            required=True, brief_keys=("stakeholders",),
            columns=(_COL_ROLE, Column("interest", "Quyền lợi và trách nhiệm",
                                       "Interests and Responsibilities")),
        ),
        Section("scope", "Phạm vi", "Scope", 1, "group"),
        Section(
            "in_scope", "Trong phạm vi", "In Scope", 2, "bullets",
            required=True, brief_keys=("in_scope",),
        ),
        Section(
            "out_of_scope", "Ngoài phạm vi", "Out of Scope", 2, "bullets",
            brief_keys=("out_of_scope",),
        ),
        Section(
            "business_requirements", "Yêu cầu kinh doanh", "Business Requirements", 1, "table",
            required=True, brief_keys=("key_features",),
            columns=(_COL_ID, _COL_NAME, _COL_DESCRIPTION, _COL_PRIORITY),
        ),
        Section(
            "success_criteria", "Tiêu chí thành công", "Success Criteria", 1, "bullets",
            required=True, brief_keys=("success_criteria",),
        ),
        Section(
            "risks", "Rủi ro", "Risks", 1, "table",
            columns=(
                Column("risk", "Rủi ro", "Risk"),
                Column("impact", "Ảnh hưởng", "Impact"),
                Column("mitigation", "Giảm thiểu", "Mitigation"),
            ),
        ),
        Section(
            "constraints", "Ràng buộc", "Constraints", 1, "bullets",
            required=True, brief_keys=("constraints",),
        ),
        Section("business_process", "Quy trình nghiệp vụ", "Business Process", 1, "process"),
        Section(
            "assumptions_open_issues", "Giả định và vấn đề mở",
            "Assumptions and Open Issues", 1, "assumptions",
        ),
    ),
)

TEMPLATES: dict[str, DocumentTemplate] = {
    SRS_TEMPLATE.doc_type: SRS_TEMPLATE,
    BRD_TEMPLATE.doc_type: BRD_TEMPLATE,
}


def get_template(doc_type: str) -> DocumentTemplate:
    """Lấy mẫu theo loại tài liệu (``srs`` hoặc ``brd``); loại lạ gây ValueError."""
    template = TEMPLATES.get(doc_type.lower()) if isinstance(doc_type, str) else None
    if template is None:
        raise ValueError(f"Loại tài liệu không hỗ trợ: {doc_type!r}")
    return template


def _brief_item_usable(item: Any) -> bool:
    """Mục hồ sơ có dữ liệu khi trạng thái là ``clear`` hoặc ``assumed``."""
    if isinstance(item, Mapping):
        status = item.get("status")
    else:
        status = getattr(item, "status", None)
    return isinstance(status, str) and status in BRIEF_USABLE_STATUSES


def missing_brief_items(
    template: DocumentTemplate, brief_items: Mapping[str, Any]
) -> list[str]:
    """Trả về các key hồ sơ còn thiếu mà các mục bắt buộc của mẫu cần.

    ``brief_items`` là dict key -> {status, value}. Một key được coi là có dữ liệu khi
    status là ``clear`` hoặc ``assumed``; ``missing``, ``skipped`` hay vắng mặt đều
    là thiếu. Kết quả không trùng lặp, theo thứ tự chuẩn của ``BRIEF_KEYS``.
    """
    needed: set[str] = set()
    for keys in template.required_brief_map().values():
        needed.update(keys)
    missing = {key for key in needed if not _brief_item_usable(brief_items.get(key))}
    order = {key: index for index, key in enumerate(BRIEF_KEYS)}
    return sorted(missing, key=lambda key: (order.get(key, len(order)), key))
