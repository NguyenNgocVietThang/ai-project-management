"""
Script seed cơ sở dữ liệu.
Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và Admin user.

Cách chạy:
    cd backend
    venv\\Scripts\\activate
    python -m app.db.seed
"""

import asyncio
import os
import secrets
import sys

sys.path.insert(0, ".")

# Mật khẩu của admin khởi tạo lấy từ biến môi trường. Trước đây nó là chuỗi
# "Admin@123456", được in trong README — điều đó có nghĩa mọi lần triển khai
# chạy seed đều kèm một tài khoản superuser mà ai cũng biết mật khẩu.
SEED_ADMIN_EMAIL = os.getenv("SEED_ADMIN_EMAIL", "admin@example.com")
SEED_ADMIN_USERNAME = os.getenv("SEED_ADMIN_USERNAME", "admin")


# ─── Dữ liệu seed ─────────────────────────────────────────────────────────────

ROLES = [
    {"name": "Admin", "description": "Quản trị hệ thống — toàn quyền"},
    {"name": "PM", "description": "Project Manager — quản lý dự án, phân công tài nguyên"},
    {"name": "BA", "description": "Business Analyst — phân tích nghiệp vụ, duyệt Change Request"},
    {"name": "PO", "description": "Product Owner — duyệt Change Request về mặt nghiệp vụ"},
    {"name": "Member", "description": "Thành viên đội dự án — thực hiện task, ghi worklog"},
    {"name": "Customer", "description": "Khách hàng — tạo Change Request, theo dõi tiến độ"},
    {"name": "Investor", "description": "Nhà đầu tư — chỉ xem Dashboard (read-only)"},
]

# Định dạng: (resource, action, description)
PERMISSIONS = [
    # Danh mục dự án (Portfolio)
    ("portfolio", "create", "Tạo Portfolio"),
    ("portfolio", "read", "Xem Portfolio"),
    ("portfolio", "update", "Cập nhật Portfolio"),
    ("portfolio", "delete", "Xóa Portfolio"),
    # Dự án (Project)
    ("project", "create", "Tạo Project"),
    ("project", "read", "Xem Project"),
    ("project", "update", "Cập nhật Project"),
    ("project", "delete", "Xóa Project"),
    ("project", "manage_members", "Quản lý thành viên Project"),
    ("project", "rollback", "Rollback phiên bản Project"),
    # Công việc (Task)
    ("task", "create", "Tạo Task"),
    ("task", "read", "Xem Task"),
    ("task", "update", "Cập nhật Task"),
    ("task", "delete", "Xóa Task"),
    ("task", "assign", "Phân công Task"),
    # Nhật ký công việc (Worklog)
    ("worklog", "create", "Ghi Worklog"),
    ("worklog", "read", "Xem Worklog"),
    ("worklog", "update", "Sửa Worklog của mình"),
    # Yêu cầu thay đổi (Change Request)
    ("change_request", "create", "Tạo Change Request"),
    ("change_request", "read", "Xem Change Request"),
    ("change_request", "approve", "Duyệt Change Request"),
    ("change_request", "apply", "Áp dụng Change Request vào dự án"),
    # Báo cáo (Report)
    ("report", "read", "Xem báo cáo"),
    ("report", "export", "Xuất báo cáo (DOCX/XLSX)"),
    # AI
    ("ai", "generate_project", "Dùng AI tạo dự án"),
    ("ai", "analyze_impact", "Dùng AI phân tích tác động"),
    ("ai", "optimize_schedule", "Dùng AI tối ưu lịch trình"),
    # Quản lý người dùng
    ("user", "create", "Tạo tài khoản"),
    ("user", "read", "Xem tài khoản"),
    ("user", "update", "Cập nhật tài khoản"),
    ("user", "delete", "Xóa tài khoản"),
    # Hệ thống
    ("system", "config", "Cấu hình hệ thống (AI provider, ...)"),
    ("audit", "read", "Xem Audit Log"),
    ("dashboard", "read", "Xem Dashboard"),
]

# Ánh xạ Role → Permissions
ROLE_PERMISSIONS = {
    "Admin": [f"{r}:{a}" for r, a, _ in PERMISSIONS],  # Admin có tất cả quyền
    "PM": [
        "portfolio:create",
        "portfolio:read",
        "portfolio:update",
        "portfolio:delete",
        "project:create",
        "project:read",
        "project:update",
        "project:delete",
        "project:manage_members",
        "project:rollback",
        "task:create", "task:read", "task:update", "task:delete", "task:assign",
        "worklog:create", "worklog:read", "worklog:update",
        "change_request:read", "change_request:approve", "change_request:apply",
        "report:read", "report:export",
        "ai:generate_project", "ai:analyze_impact", "ai:optimize_schedule",
        "dashboard:read",
    ],
    "BA": [
        "project:read", "task:create", "task:read", "task:update",
        "worklog:create", "worklog:read", "worklog:update",
        "change_request:read", "change_request:approve",
        "report:read", "dashboard:read",
    ],
    "PO": [
        "project:read", "task:read",
        "change_request:read", "change_request:approve",
        "report:read", "dashboard:read",
    ],
    "Member": [
        "project:read", "task:read", "task:update",
        "worklog:create", "worklog:read", "worklog:update",
        "dashboard:read",
    ],
    "Customer": [
        "project:read",
        "change_request:create", "change_request:read",
        "dashboard:read",
    ],
    "Investor": [
        "portfolio:read", "project:read", "dashboard:read", "report:read",
    ],
}


async def seed(db):
    # Import app.db.base trước — nó import TẤT CẢ models theo đúng thứ tự phụ thuộc
    import bcrypt as _bcrypt
    from sqlalchemy import insert

    import app.db.base  # noqa: F401
    from app.models.associations import role_permissions, user_roles
    from app.models.permission import Permission
    from app.models.role import Role
    from app.models.user import User

    def hash_password(password: str) -> str:
        """Hash mật khẩu bằng bcrypt trực tiếp (né sự không tương thích của passlib/bcrypt 5.x)."""
        return _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")


    print("Seeding permissions...")
    perm_map: dict[str, Permission] = {}
    for resource, action, description in PERMISSIONS:
        key = f"{resource}:{action}"
        p = Permission(resource=resource, action=action, description=description)
        db.add(p)
        perm_map[key] = p
    await db.flush()

    print("Seeding roles & assigning permissions...")
    role_map: dict[str, Role] = {}
    for role_data in ROLES:
        role = Role(**role_data)
        db.add(role)
        role_map[role_data["name"]] = role
    await db.flush()

    # Gán permissions cho roles bằng cách insert trực tiếp vào association table
    role_perm_rows = []
    for role_name, perm_keys in ROLE_PERMISSIONS.items():
        role = role_map[role_name]
        for key in perm_keys:
            if key in perm_map:
                role_perm_rows.append({
                    "role_id": role.id,
                    "permission_id": perm_map[key].id,
                })
    if role_perm_rows:
        await db.execute(insert(role_permissions), role_perm_rows)

    print("Seeding admin user...")
    # Được sinh ra khi không được đặt, để một lần seed không giám sát không bao giờ
    # quay về một mật khẩu ai cũng biết. In một lần, ở cuối, và không bao giờ lưu dạng plaintext.
    admin_password = os.getenv("SEED_ADMIN_PASSWORD")
    generated_password = admin_password is None
    if generated_password:
        admin_password = secrets.token_urlsafe(18)

    admin = User(
        email=SEED_ADMIN_EMAIL,
        username=SEED_ADMIN_USERNAME,
        full_name="System Administrator",
        hashed_password=hash_password(admin_password),
        position="System Admin",
        is_active=True,
        is_superuser=True,
        email_verified=True,
    )
    db.add(admin)
    await db.flush()

    # Gán role Admin cho admin user bằng cách insert trực tiếp
    await db.execute(insert(user_roles), [{"user_id": admin.id, "role_id": role_map["Admin"].id}])

    await db.commit()
    print("\n✅ Seeded:")
    print(f"   - {len(PERMISSIONS)} permissions")
    print(f"   - {len(ROLES)} roles")
    print(f"   - 1 admin user: {SEED_ADMIN_EMAIL}")
    if generated_password:
        print("\n" + "=" * 62)
        print("  Generated admin password (shown once — store it now):")
        print(f"    {admin_password}")
        print("  Set SEED_ADMIN_PASSWORD to choose your own instead.")
        print("=" * 62)



async def main():
    from app.db.session import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        await seed(db)
    print("\n🎉 Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(main())
