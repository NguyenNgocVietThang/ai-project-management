"""Chuỗi migration phải có đúng một head (không rẽ nhánh)."""
from pathlib import Path

from alembic.config import Config
from alembic.script import ScriptDirectory


def test_migrations_have_a_single_head_that_includes_device_tokens():
    root = Path(__file__).resolve().parents[2]
    config = Config(str(root / "alembic.ini"))
    config.set_main_option("script_location", str(root / "alembic"))
    script = ScriptDirectory.from_config(config)

    assert script.get_heads() == ["20261024_device_tokens"]
