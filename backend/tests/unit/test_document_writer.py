"""Unit test D2: chia nhóm mục, dựng prompt và kiểm tra output của AI viết tài liệu."""
import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace

import pytest
from sqlalchemy import inspect

from alembic.migration import MigrationContext
from alembic.operations import Operations
from app.models.generated_document import GeneratedDocument
from app.services.ai.document_writer import (
    build_assumption_items,
    build_brief_context,
    build_system_prompt,
    build_user_prompt,
    parse_group_response,
    plan_section_groups,
)
from app.services.ai.parsing import MAX_USER_PROMPT_CHARS, USER_INPUT_FENCE, AIResponseError
from app.services.documents.templates import BRD_TEMPLATE, SRS_TEMPLATE

ITEMS = {
    "goals": {"status": "clear", "value": "Bán hàng", "source": "user", "proposed_assumption": None},
    "stakeholders": {"status": "missing", "value": None, "source": None, "proposed_assumption": "BIA"},
    "in_scope": {"status": "assumed", "value": "Web", "source": "ai_assumption_confirmed", "proposed_assumption": None},
    "out_of_scope": {"status": "skipped", "value": None, "source": None, "proposed_assumption": None},
    "key_features": {"status": "clear", "value": "Giỏ hàng", "source": "ai", "proposed_assumption": None},
    "constraints": {"status": "missing", "value": None, "source": None, "proposed_assumption": None},
    "success_criteria": {"status": "missing", "value": None, "source": None, "proposed_assumption": None},
}


def brief():
    return SimpleNamespace(idea="Ý tưởng", items=json.loads(json.dumps(ITEMS)))


@pytest.mark.parametrize("template", [SRS_TEMPLATE, BRD_TEMPLATE])
def test_groups_cover_every_content_section_once_in_order(template):
    groups = plan_section_groups(template)
    flat = [key for group in groups for key in group]
    assert flat == list(template.content_section_keys)
    assert len(groups) >= 2 and all(1 <= len(group) <= 3 for group in groups)
    for group in groups:
        assert sum(template.section(key).kind == "table" for key in group) <= 2


def test_parse_drops_foreign_and_out_of_group_sections():
    group = ["purpose", "scope", "definitions"]
    content, warnings = parse_group_response(SRS_TEMPLATE, group, {"sections": {
        "purpose": "Mục đích",
        "scope": ["A", "B"],
        "definitions": [{"term": "T", "definition": "D", "extra": "x"}],
        "functional_requirements": [{"id": "F1"}],
        "made_up": ["x"],
    }})
    assert set(content) == set(group)
    assert content["purpose"] == ["Mục đích"] and content["definitions"] == [{"term": "T", "definition": "D"}]
    assert any("made_up" in w for w in warnings)
    assert any("functional_requirements" in w for w in warnings)
    assert any("extra" in w for w in warnings)


@pytest.mark.parametrize("raw", [
    {"sections": {"purpose": {"bad": 1}}},
    {"sections": {"definitions": "không phải bảng"}},
    {"sections": {"purpose": "ok"}, "extra": 1},
    {"sections": ["purpose"]},
    "text",
])
def test_parse_rejects_wrong_types_and_shapes(raw):
    with pytest.raises(AIResponseError):
        parse_group_response(SRS_TEMPLATE, ["purpose", "scope", "definitions"], raw)


def test_parse_rejects_assumptions_section_from_ai():
    content, warnings = parse_group_response(SRS_TEMPLATE, ["purpose"], {"sections": {
        "purpose": "x", "assumptions_open_issues": ["AI không được viết mục này"]}})
    assert set(content) == {"purpose"} and warnings


def test_brief_context_only_exposes_clear_and_assumed_values():
    context = build_brief_context(brief())
    assert context["requirements"] == {"goals": "Bán hàng", "key_features": "Giỏ hàng"}
    assert context["assumptions"] == {"in_scope": "Web"}
    assert "BIA" not in json.dumps(context, ensure_ascii=False)
    assert set(context["unspecified_items"]) == {"stakeholders", "out_of_scope", "constraints", "success_criteria"}


def test_assumption_items_come_from_brief_with_labels():
    items = build_assumption_items(brief(), "en")
    assert [(i["key"], i["status"]) for i in items] == [("in_scope", "assumed"), ("out_of_scope", "skipped")]
    assert items[0]["label"] == "In scope" and build_assumption_items(brief())[0]["label"] == "Trong phạm vi"
    assert build_assumption_items(None) == []


def test_prompt_is_fenced_and_trimmed_to_budget():
    project = {
        "project": {"name": "P", "description": None},
        "phases": [{"name": "Phase", "description": "x" * 150}] * 15,
        "tasks": [{"name": "t" * 190, "phase": "Phase", "priority": "HIGH", "status": "TODO"}] * 40,
        "critical_path": ["c" * 190] * 20,
        "approved_change_requests": [{"title": "CR", "description": "d" * 190}] * 10,
    }
    prompt = build_user_prompt(["purpose"], build_brief_context(brief()), project)
    assert len(prompt) <= MAX_USER_PROMPT_CHARS + 1000
    body = json.loads(prompt.split(USER_INPUT_FENCE)[1].strip())
    assert body["sections_to_write"] == ["purpose"] and len(body["project"]["tasks"]) < 40
    system = build_system_prompt(SRS_TEMPLATE, ["definitions"], "en")
    assert '"term", "definition"' in system and "English" in system and "Do NOT invent" in system


def _load_migration():
    path = Path(__file__).parents[2] / "alembic/versions/20261013_generated_documents.py"
    spec = importlib.util.spec_from_file_location("generated_documents_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


@pytest.mark.asyncio
async def test_migration_chains_after_approval_chain_and_matches_model(engine):
    migration = _load_migration()
    assert migration.down_revision == "20261013_approval_chain"
    table = GeneratedDocument.__table__

    def run(connection):
        table.drop(connection)
        with Operations.context(MigrationContext.configure(connection)):
            migration.upgrade()
        columns = {c["name"] for c in inspect(connection).get_columns(table.name)}
        assert columns == {c.name for c in table.columns}
        with Operations.context(MigrationContext.configure(connection)):
            migration.downgrade()
        assert not inspect(connection).has_table(table.name)
        table.create(connection)

    async with engine.begin() as connection:
        await connection.run_sync(run)
