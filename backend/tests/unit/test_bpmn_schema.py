"""Test schema quy trình BPMN (B1): validator đồ thị, trần kích thước, bảng bước."""

import copy
import json

import pytest
from pydantic import ValidationError

from app.schemas.bpmn import (
    MAX_FLOWS,
    MAX_LANES,
    MAX_NODES,
    ProcessModel,
    lint_process_model,
    parse_process_model,
    process_steps_table,
)
from app.services.ai.parsing import AIResponseError


def _valid() -> dict:
    """Quy trình duyệt đơn hợp lệ: 2 lane, một exclusive gateway có nhãn."""
    return {
        "name": "  Duyệt đơn nghỉ phép  ",
        "lanes": [
            {"id": "lane_emp", "name": "Nhân viên"},
            {"id": "lane_mgr", "name": "Quản lý"},
        ],
        "nodes": [
            {"id": "start", "type": "start_event", "name": "Bắt đầu", "lane_id": "lane_emp"},
            {"id": "submit", "type": "task", "name": "Gửi đơn", "lane_id": "lane_emp"},
            {"id": "review", "type": "task", "name": "Xem xét đơn", "lane_id": "lane_mgr"},
            {"id": "gw", "type": "exclusive_gateway", "name": "Đồng ý?", "lane_id": "lane_mgr"},
            {"id": "approve", "type": "task", "name": "Phê duyệt", "lane_id": "lane_mgr"},
            {"id": "reject", "type": "task", "name": "Từ chối", "lane_id": "lane_mgr"},
            {"id": "end", "type": "end_event", "name": "Kết thúc", "lane_id": "lane_emp"},
        ],
        "flows": [
            {"id": "f1", "source": "start", "target": "submit"},
            {"id": "f2", "source": "submit", "target": "review"},
            {"id": "f3", "source": "review", "target": "gw"},
            {"id": "f4", "source": "gw", "target": "approve", "label": "Có"},
            {"id": "f5", "source": "gw", "target": "reject", "label": "Không"},
            {"id": "f6", "source": "approve", "target": "end"},
            {"id": "f7", "source": "reject", "target": "end"},
        ],
    }


def _error_text(data: dict) -> str:
    with pytest.raises(ValidationError) as exc_info:
        ProcessModel.model_validate(data)
    return str(exc_info.value)


# ---------- Ca hợp lệ ----------


def test_valid_model_parses_and_strips_names():
    model = ProcessModel.model_validate(_valid())
    assert model.name == "Duyệt đơn nghỉ phép"
    assert len(model.nodes) == 7
    assert lint_process_model(model) == []


def test_valid_model_with_parallel_gateway_and_loop_back():
    data = _valid()
    # Vòng lặp hợp lệ: bị từ chối thì quay lại gửi đơn (vẫn có lối ra tới end).
    data["flows"][6] = {"id": "f7", "source": "reject", "target": "submit"}
    data["nodes"].append(
        {"id": "pg", "type": "parallel_gateway", "name": "Song song", "lane_id": "lane_mgr"}
    )
    data["nodes"].append(
        {"id": "notify", "type": "intermediate_event", "name": "Thông báo", "lane_id": "lane_emp"}
    )
    data["flows"][5] = {"id": "f6", "source": "approve", "target": "pg"}
    data["flows"].append({"id": "f8", "source": "pg", "target": "notify"})
    data["flows"].append({"id": "f9", "source": "pg", "target": "end"})
    data["flows"].append({"id": "f10", "source": "notify", "target": "end"})
    model = ProcessModel.model_validate(data)
    assert {n.type for n in model.nodes} >= {"parallel_gateway", "intermediate_event"}


def test_blank_label_normalized_to_none():
    data = _valid()
    data["flows"][0]["label"] = "   "
    model = ProcessModel.model_validate(data)
    assert model.flows[0].label is None


# ---------- Tham chiếu sai ----------


def test_flow_to_unknown_node_rejected():
    data = _valid()
    data["flows"][1]["target"] = "ghost"
    assert "unknown node 'ghost'" in _error_text(data)


def test_flow_from_unknown_node_rejected():
    data = _valid()
    data["flows"][1]["source"] = "ghost"
    assert "source references unknown node 'ghost'" in _error_text(data)


def test_node_with_unknown_lane_rejected():
    data = _valid()
    data["nodes"][2]["lane_id"] = "lane_x"
    assert "unknown lane 'lane_x'" in _error_text(data)


def test_self_loop_flow_rejected():
    data = _valid()
    data["flows"].append({"id": "f8", "source": "review", "target": "review"})
    assert "loop back to the same node" in _error_text(data)


# ---------- Start / end ----------


def test_missing_start_rejected():
    data = _valid()
    data["nodes"][0]["type"] = "task"
    assert "at least one start_event" in _error_text(data)


def test_missing_end_rejected():
    data = _valid()
    data["nodes"][6]["type"] = "task"
    assert "at least one end_event" in _error_text(data)


def test_start_with_incoming_flow_rejected():
    data = _valid()
    data["flows"].append({"id": "f8", "source": "submit", "target": "start"})
    assert "must not have incoming flows" in _error_text(data)


def test_end_with_outgoing_flow_rejected():
    data = _valid()
    data["flows"].append({"id": "f8", "source": "end", "target": "review"})
    assert "must not have outgoing flows" in _error_text(data)


# ---------- Id trùng ----------


@pytest.mark.parametrize(
    "mutate",
    [
        lambda d: d["nodes"][2].update(id="submit"),  # trùng giữa các node
        lambda d: d["flows"][2].update(id="f1"),  # trùng giữa các flow
        lambda d: d["lanes"][1].update(id="lane_emp"),  # trùng giữa các lane
        lambda d: d["flows"][2].update(id="review"),  # flow trùng id với node
    ],
)
def test_duplicate_ids_rejected(mutate):
    data = _valid()
    mutate(data)
    assert "Duplicate id" in _error_text(data)


def test_invalid_id_format_rejected():
    data = _valid()
    data["lanes"][0]["id"] = "1 bad id"
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


# ---------- Mồ côi / ngõ cụt ----------


def test_orphan_node_rejected():
    data = _valid()
    data["nodes"].append({"id": "lost", "type": "task", "name": "Mồ côi", "lane_id": "lane_emp"})
    data["flows"].append({"id": "f8", "source": "lost", "target": "end"})
    assert "not reachable from any start_event: lost" in _error_text(data)


def test_dead_end_node_rejected():
    data = _valid()
    # Nhánh từ chối không đi tiếp đâu cả.
    data["flows"] = [f for f in data["flows"] if f["id"] != "f7"]
    assert "cannot reach any end_event: reject" in _error_text(data)


def test_closed_cycle_without_exit_rejected():
    data = _valid()
    data["nodes"].append({"id": "loop_a", "type": "task", "name": "A", "lane_id": "lane_emp"})
    data["nodes"].append({"id": "loop_b", "type": "task", "name": "B", "lane_id": "lane_emp"})
    data["flows"] += [
        {"id": "f8", "source": "submit", "target": "loop_a"},
        {"id": "f9", "source": "loop_a", "target": "loop_b"},
        {"id": "f10", "source": "loop_b", "target": "loop_a"},
    ]
    assert "cannot reach any end_event" in _error_text(data)


# ---------- Trần kích thước, độ dài, key lạ ----------


def test_too_many_lanes_rejected():
    data = _valid()
    data["lanes"] += [{"id": f"extra{i}", "name": f"L{i}"} for i in range(MAX_LANES)]
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


def test_too_many_nodes_rejected():
    data = _valid()
    data["nodes"] += [
        {"id": f"n{i}", "type": "task", "name": f"T{i}", "lane_id": "lane_emp"}
        for i in range(MAX_NODES)
    ]
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


def test_too_many_flows_rejected():
    data = _valid()
    data["flows"] += [
        {"id": f"x{i}", "source": "submit", "target": "review"} for i in range(MAX_FLOWS)
    ]
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


def test_max_size_chain_is_accepted():
    # Chuỗi tuyến tính đúng MAX_NODES node vẫn hợp lệ (trần không chặn nhầm biên).
    nodes = [{"id": "s", "type": "start_event", "name": "S", "lane_id": "l"}]
    nodes += [
        {"id": f"t{i}", "type": "task", "name": f"T{i}", "lane_id": "l"}
        for i in range(MAX_NODES - 2)
    ]
    nodes.append({"id": "e", "type": "end_event", "name": "E", "lane_id": "l"})
    flows = [
        {"id": f"f{i}", "source": nodes[i]["id"], "target": nodes[i + 1]["id"]}
        for i in range(len(nodes) - 1)
    ]
    model = ProcessModel.model_validate(
        {"name": "Dài", "lanes": [{"id": "l", "name": "L"}], "nodes": nodes, "flows": flows}
    )
    assert len(process_steps_table(model)) == MAX_NODES


def test_overlong_name_rejected():
    data = _valid()
    data["nodes"][1]["name"] = "x" * 201
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


def test_blank_name_rejected():
    data = _valid()
    data["lanes"][0]["name"] = "   "
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


def test_overlong_label_rejected():
    data = _valid()
    data["flows"][3]["label"] = "y" * 101
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


@pytest.mark.parametrize(
    "mutate",
    [
        lambda d: d.update(version=2),
        lambda d: d["lanes"][0].update(color="red"),
        lambda d: d["nodes"][0].update(x=10),
        lambda d: d["flows"][0].update(condition="a>b"),
    ],
)
def test_unknown_keys_rejected(mutate):
    data = _valid()
    mutate(data)
    assert "Extra inputs are not permitted" in _error_text(data)


def test_unknown_node_type_rejected():
    data = _valid()
    data["nodes"][1]["type"] = "subprocess"
    with pytest.raises(ValidationError):
        ProcessModel.model_validate(data)


# ---------- Cảnh báo (không chặn) ----------


def test_unlabeled_exclusive_branches_are_warning_not_error():
    data = _valid()
    data["flows"][4].pop("label")
    model = ProcessModel.model_validate(data)
    warnings = lint_process_model(model)
    assert any("'gw'" in w and "f5" in w for w in warnings)


def test_empty_lane_warning():
    data = _valid()
    data["lanes"].append({"id": "lane_hr", "name": "Nhân sự"})
    warnings = lint_process_model(ProcessModel.model_validate(data))
    assert warnings == ["Lane 'lane_hr' has no nodes"]


# ---------- Bảng các bước ----------


def test_steps_table_bfs_order_and_content():
    rows = process_steps_table(ProcessModel.model_validate(_valid()))
    assert [r["node_id"] for r in rows] == [
        "start",
        "submit",
        "review",
        "gw",
        "approve",
        "reject",
        "end",
    ]
    assert [r["order"] for r in rows] == list(range(1, 8))
    gw = rows[3]
    assert gw["lane"] == "Quản lý"
    assert gw["step"] == "Đồng ý?"
    assert gw["type"] == "exclusive_gateway"
    assert gw["type_label"] == "Rẽ nhánh (chọn một)"
    assert gw["next"] == "Phê duyệt [Có]; Từ chối [Không]"
    assert rows[-1]["next"] == ""
    assert set(rows[0]) == {"order", "node_id", "lane", "step", "type", "type_label", "next"}


def test_steps_table_is_stable_and_covers_every_node_once():
    data = _valid()
    data["flows"][6] = {"id": "f7", "source": "reject", "target": "submit"}
    data["flows"].append({"id": "f8", "source": "reject", "target": "end"})
    model = ProcessModel.model_validate(data)
    first = process_steps_table(model)
    assert first == process_steps_table(ProcessModel.model_validate(copy.deepcopy(data)))
    assert sorted(r["node_id"] for r in first) == sorted(n.id for n in model.nodes)


# ---------- parse_process_model ----------


def test_parse_from_fenced_string():
    raw = "Đây là quy trình:\n```json\n" + json.dumps(_valid(), ensure_ascii=False) + "\n```"
    model = parse_process_model(raw)
    assert model.name == "Duyệt đơn nghỉ phép"


def test_parse_from_dict():
    assert isinstance(parse_process_model(_valid()), ProcessModel)


def test_parse_invalid_json_raises_ai_error():
    with pytest.raises(AIResponseError):
        parse_process_model("không phải JSON")


def test_parse_schema_error_raises_ai_error_with_summary():
    data = _valid()
    data["flows"][1]["target"] = "ghost"
    with pytest.raises(AIResponseError) as exc_info:
        parse_process_model(data)
    assert "Invalid process model" in str(exc_info.value)
    assert "ghost" in str(exc_info.value)


def test_parse_non_object_raises_ai_error():
    with pytest.raises(AIResponseError):
        parse_process_model([1, 2, 3])  # kiểu sai có chủ đích
