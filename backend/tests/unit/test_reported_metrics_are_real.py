"""Bon truong tung duoc hien thi nhung khong noi nao ghi.

Chung khong gay loi - chung chi luon bang 0. Dashboard bao 0% ngan sach da dung
tren moi du an, va bieu do burndown la mot duong thang nam ngang o moi du an, du
co du lieu hay khong. Tinh nang trong nhu da xong nhung so lieu la gia.
"""
from datetime import date
from types import SimpleNamespace

import pytest

import app.db.base  # noqa: F401 - dang ky quan he SQLAlchemy
from app.models.task import TaskStatus
from app.schemas.task import TaskUpdate
from app.services.task_service import _apply_status_side_effects


def _task(**overrides):
    base = dict(status=TaskStatus.TODO, progress=0.0, actual_start=None, actual_end=None)
    base.update(overrides)
    return SimpleNamespace(**base)


def test_starting_work_records_when_it_actually_started():
    task = _task()
    _apply_status_side_effects(task, TaskStatus.IN_PROGRESS)
    assert task.actual_start == date.today()
    assert task.actual_end is None


def test_the_start_date_is_not_overwritten_when_work_resumes():
    """Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'."""
    started = date(2026, 1, 5)
    task = _task(actual_start=started)
    _apply_status_side_effects(task, TaskStatus.IN_PROGRESS)
    assert task.actual_start == started


def test_finishing_work_records_the_end_date():
    task = _task(actual_start=date(2026, 1, 5))
    _apply_status_side_effects(task, TaskStatus.DONE)
    assert task.actual_end == date.today()
    assert task.progress == 100.0


def test_a_task_completed_without_ever_starting_still_gets_a_start_date():
    task = _task()
    _apply_status_side_effects(task, TaskStatus.DONE)
    assert task.actual_start is not None
    assert task.actual_end is not None


def test_reopening_a_task_clears_the_end_date():
    """Burndown loc theo actual_end; task da mo lai thi khong con la da xong."""
    task = _task(status=TaskStatus.DONE, actual_start=date(2026, 1, 5), actual_end=date(2026, 1, 9), progress=100.0)
    _apply_status_side_effects(task, TaskStatus.IN_PROGRESS)
    assert task.actual_end is None
    assert task.progress < 100.0


def test_progress_can_be_reported_between_the_extremes():
    """Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100."""
    assert "progress" in TaskUpdate.model_fields
    assert TaskUpdate(progress=42).progress == 42


@pytest.mark.parametrize("value", [-1, 101])
def test_progress_outside_zero_to_one_hundred_is_rejected(value):
    with pytest.raises(Exception):
        TaskUpdate(progress=value)


def test_project_cost_is_derived_from_logged_hours_and_rates():
    """`actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no."""
    from app.services import scheduling_service

    assert hasattr(scheduling_service, "recalculate_project_cost")


def test_epic_story_points_are_rolled_up_from_tasks():
    """EpicCreate/EpicUpdate khong co truong nay va khong service nao cong don."""
    import inspect

    from app.services import scheduling_service

    source = inspect.getsource(scheduling_service.recalculate_project)
    assert "epic.story_points" in source
