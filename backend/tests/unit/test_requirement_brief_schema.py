"""Hồ sơ yêu cầu: validator mục cố định, quy tắc ghi đè, model và migration."""

import importlib.util
from datetime import UTC, datetime
from pathlib import Path

import pytest
from pydantic import ValidationError
from sqlalchemy import inspect, select
from sqlalchemy.exc import IntegrityError

from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.models.base import Base
from app.models.requirement_brief import RequirementBrief
from app.schemas.requirement_brief import (
    REQUIREMENT_ITEM_KEYS,
    QAEntry,
    RequirementBriefCreate,
    RequirementBriefRead,
    RequirementBriefUpdateError,
    RequirementItem,
    apply_item_updates,
    empty_items,
    validate_items,
    validate_qa_history,
)

EXPECTED_KEYS = (
    "goals",
    "stakeholders",
    "in_scope",
    "out_of_scope",
    "key_features",
    "constraints",
    "success_criteria",
)


# ─── Danh sách mục cố định ─────────────────────────────────────────────────────


def test_item_keys_are_stable_and_ordered():
    assert REQUIREMENT_ITEM_KEYS == EXPECTED_KEYS


def test_empty_items_are_all_missing_without_source():
    items = empty_items().to_json()
    assert tuple(items) == EXPECTED_KEYS
    for item in items.values():
        assert item == {
            "status": "missing",
            "value": None,
            "source": None,
            "proposed_assumption": None,
        }


def test_items_json_round_trips():
    data = apply_item_updates(
        empty_items(), [{"key": "goals", "status": "clear", "value": "Bán vé"}], "user"
    ).items.to_json()
    assert validate_items(data).to_json() == data


def test_unknown_item_key_in_stored_items_is_rejected():
    data = empty_items().to_json()
    data["budget"] = {"status": "missing"}
    with pytest.raises(ValidationError):
        validate_items(data)


def test_missing_item_key_in_stored_items_is_rejected():
    data = empty_items().to_json()
    del data["goals"]
    with pytest.raises(ValidationError):
        validate_items(data)


@pytest.mark.parametrize("status", ["done", "CLEAR", "", None])
def test_unknown_item_status_is_rejected(status):
    data = empty_items().to_json()
    data["goals"]["status"] = status
    with pytest.raises(ValidationError):
        validate_items(data)


def test_unknown_item_field_is_rejected():
    with pytest.raises(ValidationError):
        RequirementItem(status="missing", note="x")


@pytest.mark.parametrize(
    "item",
    [
        {"status": "clear", "value": None, "source": "user"},
        {"status": "clear", "value": "   ", "source": "user"},
        {"status": "clear", "value": "x", "source": None},
        {"status": "clear", "value": "x", "source": "ai_assumption_confirmed"},
        {"status": "assumed", "value": "x", "source": "user"},
        {"status": "missing", "value": "x"},
        {"status": "skipped", "value": "x", "source": "user"},
        {"status": "missing", "source": "robot"},
    ],
)
def test_inconsistent_item_is_rejected(item):
    with pytest.raises(ValidationError):
        RequirementItem.model_validate(item)


# ─── apply_item_updates ────────────────────────────────────────────────────────


def test_unknown_key_in_updates_rejects_whole_batch():
    with pytest.raises(ValidationError):
        apply_item_updates(
            empty_items(),
            [
                {"key": "goals", "status": "clear", "value": "Bán vé"},
                {"key": "budget", "status": "clear", "value": "1 tỷ"},
            ],
            "ai",
        )


def test_unknown_status_in_updates_is_rejected():
    with pytest.raises(ValidationError):
        apply_item_updates(empty_items(), [{"key": "goals", "status": "done"}], "ai")


def test_unknown_source_is_rejected():
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(empty_items(), [], "admin")


def test_duplicate_key_in_updates_is_rejected():
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(
            empty_items(),
            [
                {"key": "goals", "status": "clear", "value": "a"},
                {"key": "goals", "status": "clear", "value": "b"},
            ],
            "ai",
        )


def test_ai_clear_update_is_applied_without_mutating_input():
    original = empty_items()
    result = apply_item_updates(
        original, [{"key": "goals", "status": "clear", "value": " Bán vé online "}], "ai"
    )
    assert result.applied == ["goals"] and result.ignored == []
    goals = result.items.get("goals")
    assert (goals.status, goals.value, goals.source) == ("clear", "Bán vé online", "ai")
    assert original.get("goals").status == "missing"


def test_user_clear_item_is_not_overwritten_by_ai():
    user_items = apply_item_updates(
        empty_items(), [{"key": "goals", "status": "clear", "value": "Của người dùng"}], "user"
    ).items
    result = apply_item_updates(
        user_items,
        [
            {"key": "goals", "status": "clear", "value": "AI tự bịa"},
            {"key": "constraints", "status": "clear", "value": "Ngân sách 100 triệu"},
        ],
        "ai",
    )
    assert result.ignored == ["goals"]
    assert result.applied == ["constraints"]
    goals = result.items.get("goals")
    assert (goals.value, goals.source) == ("Của người dùng", "user")
    assert result.items.get("constraints").source == "ai"


def test_ai_cannot_reopen_user_clear_item_as_missing():
    user_items = apply_item_updates(
        empty_items(), [{"key": "goals", "status": "clear", "value": "Của người dùng"}], "user"
    ).items
    result = apply_item_updates(user_items, [{"key": "goals", "status": "missing"}], "ai")
    assert result.ignored == ["goals"]
    assert result.items.get("goals").status == "clear"


def test_confirmed_assumption_is_not_overwritten_by_ai():
    with_proposal = apply_item_updates(
        empty_items(),
        [{"key": "stakeholders", "status": "missing", "proposed_assumption": "Khách lẻ"}],
        "ai",
    ).items
    confirmed = apply_item_updates(
        with_proposal, [{"key": "stakeholders", "status": "assumed"}], "ai_assumption_confirmed"
    ).items
    item = confirmed.get("stakeholders")
    assert (item.status, item.value, item.source) == (
        "assumed",
        "Khách lẻ",
        "ai_assumption_confirmed",
    )
    assert item.proposed_assumption is None
    result = apply_item_updates(
        confirmed, [{"key": "stakeholders", "status": "clear", "value": "Doanh nghiệp"}], "ai"
    )
    assert result.ignored == ["stakeholders"]
    assert result.items.get("stakeholders").value == "Khách lẻ"


def test_ai_clear_item_can_be_refined_by_ai_and_overridden_by_user():
    ai_items = apply_item_updates(
        empty_items(), [{"key": "goals", "status": "clear", "value": "v1"}], "ai"
    ).items
    refined = apply_item_updates(
        ai_items, [{"key": "goals", "status": "clear", "value": "v2"}], "ai"
    )
    assert refined.applied == ["goals"] and refined.items.get("goals").value == "v2"
    by_user = apply_item_updates(
        refined.items, [{"key": "goals", "status": "clear", "value": "v3"}], "user"
    )
    assert by_user.items.get("goals").source == "user"


@pytest.mark.parametrize("status", ["assumed", "skipped"])
def test_ai_cannot_set_assumed_or_skipped(status):
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(empty_items(), [{"key": "goals", "status": status, "value": "x"}], "ai")


def test_user_must_confirm_assumption_through_dedicated_source():
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(
            empty_items(), [{"key": "goals", "status": "assumed", "value": "x"}], "user"
        )
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(
            empty_items(),
            [{"key": "goals", "status": "clear", "value": "x"}],
            "ai_assumption_confirmed",
        )


def test_confirming_without_any_proposal_is_rejected():
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(
            empty_items(), [{"key": "goals", "status": "assumed"}], "ai_assumption_confirmed"
        )


def test_ai_clear_without_value_is_rejected():
    with pytest.raises(RequirementBriefUpdateError):
        apply_item_updates(empty_items(), [{"key": "goals", "status": "clear"}], "ai")


def test_user_skip_marks_item_skipped_and_drops_value():
    result = apply_item_updates(
        empty_items(),
        [{"key": "out_of_scope", "status": "skipped", "value": "bị bỏ qua"}],
        "user",
    )
    item = result.items.get("out_of_scope")
    assert (item.status, item.value, item.source) == ("skipped", None, "user")
    assert result.items.keys_with_status("missing") == [
        key for key in EXPECTED_KEYS if key != "out_of_scope"
    ]


# ─── Lịch sử hỏi đáp và schema API ─────────────────────────────────────────────


def test_qa_history_validation():
    now = datetime.now(UTC)
    entries = validate_qa_history(
        [{"question": "Ai dùng?", "asked_at": now.isoformat(), "ai_request_id": 7}]
    )
    assert entries[0].answer is None and entries[0].ai_request_id == 7
    with pytest.raises(ValidationError):
        validate_qa_history([{"question": "", "asked_at": now.isoformat()}])
    with pytest.raises(ValidationError):
        QAEntry(question="q", asked_at=now, extra_field=1)
    with pytest.raises(ValueError):
        validate_qa_history({"question": "q"})


def test_create_schema_strips_and_rejects_blank_idea():
    assert RequirementBriefCreate(idea="  App bán vé  ").idea == "App bán vé"
    with pytest.raises(ValidationError):
        RequirementBriefCreate(idea="   ")


# ─── Model và migration ────────────────────────────────────────────────────────


async def test_model_round_trip_and_read_schema(session, make_user):
    owner = await make_user()
    brief = RequirementBrief(
        owner_id=owner.id, idea="App bán vé", items=empty_items().to_json(), qa_history=[]
    )
    session.add(brief)
    await session.flush()
    stored = await session.scalar(select(RequirementBrief).where(RequirementBrief.id == brief.id))
    assert stored.status == "clarifying" and stored.turn_count == 0
    assert stored.project_id is None and stored.pending_job_id is None
    read = RequirementBriefRead.model_validate(stored)
    assert read.items.get("goals").status == "missing"


async def test_model_rejects_unknown_status(session, make_user):
    owner = await make_user()
    session.add(
        RequirementBrief(
            owner_id=owner.id,
            idea="x",
            items=empty_items().to_json(),
            qa_history=[],
            status="archived",
        )
    )
    with pytest.raises(IntegrityError):
        await session.flush()


def _load_migration():
    path = Path(__file__).parents[2] / "alembic/versions/20261012_requirement_briefs.py"
    spec = importlib.util.spec_from_file_location("requirement_briefs_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_migration_chains_after_security_state():
    migration = _load_migration()
    assert migration.revision == "20261012_requirement_briefs"
    assert migration.down_revision == "20261008_security_state"


async def test_migration_matches_model_and_downgrades(engine):
    migration = _load_migration()
    table = RequirementBrief.__table__

    def migrate(connection, upgrade):
        with Operations.context(MigrationContext.configure(connection)):
            (migration.upgrade if upgrade else migration.downgrade)()

    def shape(connection):
        inspector = inspect(connection)
        columns = {c["name"]: c["nullable"] for c in inspector.get_columns(table.name)}
        indexes = {i["name"] for i in inspector.get_indexes(table.name)}
        fks = {
            (tuple(fk["constrained_columns"]), fk["referred_table"], fk["options"].get("ondelete"))
            for fk in inspector.get_foreign_keys(table.name)
        }
        return columns, indexes, fks

    async with engine.begin() as db:
        model_shape = await db.run_sync(shape)
        await db.run_sync(table.drop)
        await db.run_sync(lambda connection: migrate(connection, True))
        assert await db.run_sync(shape) == model_shape
        await db.run_sync(lambda connection: migrate(connection, False))
        assert not await db.run_sync(lambda c: inspect(c).has_table(table.name))
    assert "ix_requirement_briefs_owner" in {index.name for index in table.indexes}
    assert table.name in Base.metadata.tables
