"""Schema và hàm thuần cho hồ sơ yêu cầu (requirement brief).

Cấu trúc cột `items` (JSON) là một dict có ĐÚNG bảy khóa cố định trong
REQUIREMENT_ITEM_KEYS, mỗi giá trị có dạng:

    {
        "status": "clear" | "missing" | "assumed" | "skipped",
        "value": str | null,
        "source": "user" | "ai" | "ai_assumption_confirmed" | null,
        "proposed_assumption": str | null
    }

Ý nghĩa nguồn:
- user: người dùng nhập hoặc xác nhận trực tiếp.
- ai: AI trích từ ý tưởng/câu trả lời của người dùng (chưa được người dùng xác nhận).
- ai_assumption_confirmed: giả định do AI đề xuất và người dùng đã chấp nhận.

Quy tắc ghi đè: mục đã được người dùng chốt (`clear` nguồn `user`, hoặc `assumed`
nguồn `ai_assumption_confirmed`) KHÔNG bị cập nhật nguồn `ai` ghi đè; cập nhật đó bị
bỏ qua và trả về trong danh sách `ignored` (không ném lỗi, để một lượt AI hợp lệ
về các mục khác vẫn được áp).
"""

from collections.abc import Mapping, Sequence
from datetime import datetime
from typing import Any, Literal, get_args

from pydantic import BaseModel, ConfigDict, Field, ValidationError, model_validator

ItemKey = Literal[
    "goals",
    "stakeholders",
    "in_scope",
    "out_of_scope",
    "key_features",
    "constraints",
    "success_criteria",
]
ItemStatus = Literal["clear", "missing", "assumed", "skipped"]
ItemSource = Literal["user", "ai", "ai_assumption_confirmed"]
BriefStatus = Literal["clarifying", "ready", "consumed"]

# Thứ tự cố định dùng cho hiển thị và prompt.
REQUIREMENT_ITEM_KEYS: tuple[str, ...] = get_args(ItemKey)
ITEM_STATUSES: tuple[str, ...] = get_args(ItemStatus)
ITEM_SOURCES: tuple[str, ...] = get_args(ItemSource)

MAX_ITEM_VALUE_LENGTH = 4000
MAX_ASSUMPTION_LENGTH = 2000
MAX_IDEA_LENGTH = 4000
MAX_QUESTION_LENGTH = 2000
MAX_ANSWER_LENGTH = 4000


class RequirementBriefUpdateError(ValueError):
    """Cập nhật mục vi phạm quy tắc nghiệp vụ; không mục nào được áp."""


def _clean(text: str | None) -> str | None:
    # Chuỗi rỗng/chỉ khoảng trắng coi như không có giá trị.
    if text is None:
        return None
    text = text.strip()
    return text or None


class RequirementItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: ItemStatus = "missing"
    value: str | None = Field(default=None, max_length=MAX_ITEM_VALUE_LENGTH)
    source: ItemSource | None = None
    proposed_assumption: str | None = Field(default=None, max_length=MAX_ASSUMPTION_LENGTH)

    @model_validator(mode="after")
    def _check_consistency(self) -> "RequirementItem":
        self.value = _clean(self.value)
        self.proposed_assumption = _clean(self.proposed_assumption)
        if self.status in ("clear", "assumed"):
            if self.value is None:
                raise ValueError(f"mục trạng thái '{self.status}' phải có giá trị")
            if self.status == "clear" and self.source not in ("user", "ai"):
                raise ValueError("mục 'clear' phải có nguồn 'user' hoặc 'ai'")
            if self.status == "assumed" and self.source != "ai_assumption_confirmed":
                raise ValueError("mục 'assumed' phải có nguồn 'ai_assumption_confirmed'")
            # Đề xuất giả định chỉ có nghĩa khi mục còn thiếu.
            self.proposed_assumption = None
        else:
            if self.value is not None:
                raise ValueError(f"mục trạng thái '{self.status}' không được có giá trị")
            if self.status == "skipped":
                self.proposed_assumption = None
        return self

    @property
    def locked_by_user(self) -> bool:
        """Mục người dùng đã chốt: nguồn AI không được ghi đè."""
        return (self.status == "clear" and self.source == "user") or (
            self.status == "assumed" and self.source == "ai_assumption_confirmed"
        )


class RequirementItems(BaseModel):
    """Đúng bảy mục cố định; khóa lạ hoặc thiếu khóa đều bị từ chối."""

    model_config = ConfigDict(extra="forbid")

    goals: RequirementItem
    stakeholders: RequirementItem
    in_scope: RequirementItem
    out_of_scope: RequirementItem
    key_features: RequirementItem
    constraints: RequirementItem
    success_criteria: RequirementItem

    def get(self, key: str) -> RequirementItem:
        return getattr(self, key)

    def keys_with_status(self, *statuses: str) -> list[str]:
        return [key for key in REQUIREMENT_ITEM_KEYS if self.get(key).status in statuses]

    def to_json(self) -> dict[str, dict[str, Any]]:
        """Dạng lưu vào cột JSON, giữ thứ tự khóa cố định."""
        return {key: self.get(key).model_dump(mode="json") for key in REQUIREMENT_ITEM_KEYS}


class RequirementItemUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    key: ItemKey
    status: ItemStatus
    value: str | None = Field(default=None, max_length=MAX_ITEM_VALUE_LENGTH)
    proposed_assumption: str | None = Field(default=None, max_length=MAX_ASSUMPTION_LENGTH)


class ItemUpdateResult(BaseModel):
    items: RequirementItems
    applied: list[str]
    ignored: list[str]


def empty_items() -> RequirementItems:
    """Danh sách mục ban đầu: mọi mục `missing`, chưa có nguồn."""
    return RequirementItems(**{key: RequirementItem() for key in REQUIREMENT_ITEM_KEYS})


def validate_items(raw: Any) -> RequirementItems:
    """Kiểm tra dữ liệu `items` đọc từ DB hoặc từ bên ngoài."""
    if isinstance(raw, RequirementItems):
        return raw
    return RequirementItems.model_validate(raw)


def _build_item(
    current: RequirementItem, update: RequirementItemUpdate, source: ItemSource
) -> RequirementItem:
    status = update.status
    if source == "ai" and status not in ("clear", "missing"):
        # Giả định chỉ thành `assumed` khi người dùng chấp nhận; bỏ qua do người dùng quyết.
        raise RequirementBriefUpdateError(f"nguồn 'ai' không được đặt trạng thái '{status}'")
    if source == "ai_assumption_confirmed" and status != "assumed":
        raise RequirementBriefUpdateError(
            "nguồn 'ai_assumption_confirmed' chỉ dùng cho trạng thái 'assumed'"
        )
    if source == "user" and status == "assumed":
        raise RequirementBriefUpdateError(
            "người dùng chấp nhận giả định phải dùng nguồn 'ai_assumption_confirmed'"
        )

    value = _clean(update.value)
    if status == "assumed" and value is None:
        # Chấp nhận giả định không kèm nội dung: dùng giả định AI đã đề xuất.
        value = current.proposed_assumption
    if status in ("missing", "skipped"):
        value = None

    proposed = None
    if status == "missing":
        proposed = _clean(update.proposed_assumption)
        if proposed is None and source == "user":
            # Người dùng đưa mục về `missing` không xóa đề xuất AI đang chờ.
            proposed = current.proposed_assumption

    try:
        return RequirementItem(
            status=status, value=value, source=source, proposed_assumption=proposed
        )
    except ValidationError as exc:
        raise RequirementBriefUpdateError(f"mục '{update.key}' không hợp lệ: {exc}") from exc


def apply_item_updates(
    items: RequirementItems | Mapping[str, Any],
    updates: Sequence[RequirementItemUpdate | Mapping[str, Any]],
    source: ItemSource,
) -> ItemUpdateResult:
    """Áp danh sách cập nhật lên các mục, trả về bản mới (không sửa đầu vào).

    Nguyên tử: mục lạ, trạng thái lạ, khóa lặp hoặc vi phạm quy tắc làm cả lô bị
    từ chối bằng `ValueError` (ValidationError hoặc RequirementBriefUpdateError).
    Cập nhật nguồn `ai` lên mục người dùng đã chốt bị bỏ qua và liệt kê ở `ignored`.
    """
    if source not in ITEM_SOURCES:
        raise RequirementBriefUpdateError(f"nguồn không hợp lệ: {source!r}")
    current = validate_items(items).model_copy(deep=True)
    parsed = [RequirementItemUpdate.model_validate(update) for update in updates]

    seen: set[str] = set()
    for update in parsed:
        if update.key in seen:
            raise RequirementBriefUpdateError(f"mục '{update.key}' bị cập nhật hai lần")
        seen.add(update.key)

    new_values: dict[str, RequirementItem] = {}
    applied: list[str] = []
    ignored: list[str] = []
    for update in parsed:
        existing = current.get(update.key)
        if source == "ai" and existing.locked_by_user:
            ignored.append(update.key)
            continue
        new_values[update.key] = _build_item(existing, update, source)
        applied.append(update.key)

    merged = {key: new_values.get(key, current.get(key)) for key in REQUIREMENT_ITEM_KEYS}
    return ItemUpdateResult(items=RequirementItems(**merged), applied=applied, ignored=ignored)


class QAEntry(BaseModel):
    """Một lượt hỏi đáp: câu hỏi của AI và câu trả lời của người dùng (nếu đã có)."""

    model_config = ConfigDict(extra="forbid")

    question: str = Field(min_length=1, max_length=MAX_QUESTION_LENGTH)
    answer: str | None = Field(default=None, max_length=MAX_ANSWER_LENGTH)
    asked_at: datetime
    answered_at: datetime | None = None
    ai_request_id: int | None = None


def validate_qa_history(raw: Any) -> list[QAEntry]:
    if not isinstance(raw, list):
        raise ValueError("qa_history phải là danh sách")
    return [QAEntry.model_validate(entry) for entry in raw]


class RequirementBriefCreate(BaseModel):
    idea: str = Field(min_length=1, max_length=MAX_IDEA_LENGTH)

    @model_validator(mode="after")
    def _strip_idea(self) -> "RequirementBriefCreate":
        cleaned = _clean(self.idea)
        if cleaned is None:
            raise ValueError("ý tưởng không được để trống")
        self.idea = cleaned
        return self


class RequirementBriefRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    idea: str
    items: RequirementItems
    qa_history: list[QAEntry]
    turn_count: int
    status: BriefStatus
    project_id: int | None = None
    pending_job_id: int | None = None
    created_at: datetime
    updated_at: datetime


# ----- Schema request/response cho API hồ sơ yêu cầu (C3) -----


class RequirementAnswerRequest(BaseModel):
    """Trả lời câu hỏi mở mới nhất, tùy chọn sửa mục trực tiếp, rồi enqueue lượt kế.

    `answer` bỏ trống nghĩa là chỉ chạy lại lượt AI (ví dụ lượt trước thất bại).
    """

    model_config = ConfigDict(extra="forbid")

    answer: str | None = Field(default=None, max_length=MAX_ANSWER_LENGTH)
    item_updates: list["RequirementItemPatch"] = Field(default_factory=list, max_length=len(REQUIREMENT_ITEM_KEYS))


class RequirementItemPatch(BaseModel):
    """Người dùng sửa/xác nhận một mục (nguồn `user`); `key` chỉ dùng trong answer."""

    model_config = ConfigDict(extra="forbid")

    key: ItemKey | None = None
    status: Literal["clear", "missing", "skipped"]
    value: str | None = Field(default=None, max_length=MAX_ITEM_VALUE_LENGTH)


RequirementAnswerRequest.model_rebuild()


class AssumptionAcceptRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    # Bỏ trống: dùng nguyên giả định AI đề xuất.
    value: str | None = Field(default=None, max_length=MAX_ITEM_VALUE_LENGTH)


class PendingTurn(BaseModel):
    job_id: int
    status: str


class ItemCounts(BaseModel):
    clear: int
    missing: int
    assumed: int
    skipped: int
    total: int
    # Số mục đã có kết luận (khác `missing`), ví dụ 4/7.
    resolved: int


class RequirementBriefDetail(RequirementBriefRead):
    pending_turn: PendingTurn | None = None
    max_turns: int
    turns_remaining: int
    item_counts: ItemCounts
    open_question: str | None = None
    can_finalize: bool


class RequirementBriefSummary(BaseModel):
    id: int
    idea: str
    status: BriefStatus
    turn_count: int
    project_id: int | None = None
    item_counts: ItemCounts
    created_at: datetime
    updated_at: datetime


class RequirementBriefTurnResponse(BaseModel):
    """Phản hồi khi tạo hồ sơ/trả lời: hồ sơ hiện tại và job để poll qua `/jobs/{id}`."""

    brief: RequirementBriefDetail
    job_id: int
    ai_request_id: int
