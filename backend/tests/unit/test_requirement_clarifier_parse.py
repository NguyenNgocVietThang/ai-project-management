"""Unit test cho kiểm tra output AI hỏi làm rõ (C2)."""
import pytest

from app.schemas.requirement_brief import empty_items
from app.services.ai.parsing import MAX_USER_PROMPT_CHARS, AIResponseError
from app.services.ai.requirement_clarifier import build_clarify_prompt, parse_clarify_response


def test_valid_response_parses_and_strips():
    parsed = parse_clarify_response({
        "items": [
            {"key": "goals", "status": "clear", "value": "  Bán hàng online "},
            {"key": "constraints", "status": "missing", "proposed_assumption": "Ngân sách 50 triệu"},
        ],
        "next_question": " Ai là người dùng chính? ",
    })
    assert parsed.items[0].value == "Bán hàng online"
    assert parsed.next_question == "Ai là người dùng chính?"


def test_null_question_and_no_question_mark_allowed():
    assert parse_clarify_response({"items": [], "next_question": None}).next_question is None
    assert parse_clarify_response({"items": [], "next_question": "Hãy mô tả người dùng chính"}).next_question


@pytest.mark.parametrize("raw", [
    [],
    {"items": []},
    {"items": [], "next_question": None, "extra": 1},
    {"items": [{"key": "goals", "status": "assumed", "value": "x"}], "next_question": None},
    {"items": [{"key": "goals", "status": "skipped"}], "next_question": None},
    {"items": [{"key": "unknown", "status": "missing"}], "next_question": None},
    {"items": [{"key": "goals", "status": "clear"}], "next_question": None},
    {"items": [{"key": "goals", "status": "missing", "value": "x"}], "next_question": None},
    {"items": [{"key": "goals", "status": "missing", "note": "x"}], "next_question": None},
    {"items": [{"key": "goals", "status": "missing"}, {"key": "goals", "status": "missing"}], "next_question": None},
    {"items": [], "next_question": ["Câu 1?", "Câu 2?"]},
    {"items": [], "next_question": "Mục tiêu là gì? Ai dùng nó?"},
    {"items": [], "next_question": "Mục tiêu là gì？ Ngân sách？"},
    {"items": [], "next_question": "Mục tiêu\nlà gì?"},
    {"items": [], "next_question": "   "},
])
def test_invalid_response_raises(raw):
    with pytest.raises(AIResponseError):
        parse_clarify_response(raw)


def test_prompt_is_bounded_and_fenced():
    history = [{"question": "Q" * 2000, "answer": "A" * 4000, "asked_at": "2026-01-01T00:00:00Z"} for _ in range(30)]
    prompt = build_clarify_prompt({"idea": "I" * 4000, "items": empty_items().to_json(), "qa_history": history})
    assert len(prompt) <= MAX_USER_PROMPT_CHARS + 400
    assert "<<<USER_INPUT>>>" in prompt
