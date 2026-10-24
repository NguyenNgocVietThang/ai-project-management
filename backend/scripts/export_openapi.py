"""Xuất OpenAPI của backend ra `mobile/openapi/openapi.json`.

Không cần bật `APP_ENV=development`: gọi thẳng `app.openapi()` nên production vẫn giữ
`/openapi.json` tắt. Đầu ra ổn định (khóa sắp xếp, thụt lề 2) để diff trong PR có nghĩa.

Cách dùng (chạy trong thư mục backend/):
    python scripts/export_openapi.py            # ghi file
    python scripts/export_openapi.py --check    # thoát mã 1 nếu file đã commit bị lệch
"""
import argparse
import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = BACKEND_DIR.parent / "mobile" / "openapi" / "openapi.json"

sys.path.insert(0, str(BACKEND_DIR))


def render_openapi() -> str:
    """Chuỗi JSON OpenAPI ổn định, kết thúc bằng một dòng mới."""
    from app.main import app

    return json.dumps(app.openapi(), indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--check", action="store_true", help="chỉ so sánh, không ghi")
    args = parser.parse_args(argv)

    expected = render_openapi()
    if args.check:
        current = args.output.read_text(encoding="utf-8") if args.output.exists() else None
        if current != expected:
            print(
                f"{args.output} đã lệch so với API hiện tại. "
                "Chạy `python scripts/export_openapi.py` rồi commit lại.",
                file=sys.stderr,
            )
            return 1
        print("openapi.json khớp với API.")
        return 0
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(expected, encoding="utf-8", newline="\n")
    print(f"Đã ghi {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
