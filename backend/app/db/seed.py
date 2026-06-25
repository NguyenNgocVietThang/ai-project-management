"""
Database seed script.
Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và Admin user.

Cách chạy:
    cd backend
    venv\\Scripts\\activate
    python -m app.db.seed
"""

import asyncio
import sys

sys.path.insert(0, ".")


# ─── Seed data ────────────────────────────────────────────────────────────────

ROLES = [
    {"name": "Admin", "description": "Quản trị hệ thống — toàn quyền"},
    {"name": "PM", "description": "Project Manager — quản lý dự án, phân công tài nguyên"},
    {"name": "BA", "description": "Business Analyst — phân tích nghiệp vụ, duyệt Change Request"},
    {"name": "PO", "description": "Product Owner — duyệt Change Request về mặt nghiệp vụ"},
    {"name": "Member", "description": "Thành viên đội dự án — thực hiện task, ghi worklog"},
    {"name": "Customer", "description": "Khách hàng — tạo Change Request, theo dõi tiến độ"},
    {"name": "Investor", "description": "Nhà đầu tư — chỉ xem Dashboard (read-only)"},
]

# Format: (resource, action, description)
PERMISSIONS = [
    # Portfolio
    ("portfolio", "create", "Tạo Portfolio"),
    ("portfolio", "read", "Xem Portfolio"),
    ("portfolio", "update", "Cập nhật Portfolio"),
    ("portfolio", "delete", "Xóa Portfolio"),
    # Project
    ("project", "create", "Tạo Project"),
    ("project", "read", "Xem Project"),
    ("project", "update", "Cập nhật Project"),
    ("project", "delete", "Xóa Project"),
    ("project", "manage_members", "Quản lý thành viên Project"),
    ("project", "rollback", "Rollback phiên bản Project"),
    # Task
    ("task", "create", "Tạo Task"),
    ("task", "read", "Xem Task"),
    ("task", "update", "Cập nhật Task"),
    ("task", "delete", "Xóa Task"),
    ("task", "assign", "Phân công Task"),
    # Worklog
    ("worklog", "create", "Ghi Worklog"),
    ("worklog", "read", "Xem Worklog"),
    ("worklog", "update", "Sửa Worklog của mình"),
    # Change Request
    ("change_request", "create", "Tạo Change Request"),
    ("change_request", "read", "Xem Change Request"),
    ("change_request", "approve", "Duyệt Change Request"),
    ("change_request", "apply", "Áp dụng Change Request vào dự án"),
    # Report
    ("report", "read", "Xem báo cáo"),
    ("report", "export", "Xuất báo cáo (DOCX/XLSX)"),
    # AI
    ("ai", "generate_project", "Dùng AI tạo dự án"),
    ("ai", "analyze_impact", "Dùng AI phân tích tác động"),
    ("ai", "optimize_schedule", "Dùng AI tối ưu lịch trình"),
    # User management
    ("user", "create", "Tạo tài khoản"),
    ("user", "read", "Xem tài khoản"),
    ("user", "update", "Cập nhật tài khoản"),
    ("user", "delete", "Xóa tài khoản"),
    # System
    ("system", "config", "Cấu hình hệ thống (AI provider, ...)"),
    ("audit", "read", "Xem Audit Log"),
    ("dashboard", "read", "Xem Dashboard"),
]

# Role → Permissions mapping
ROLE_PERMISSIONS = {
    "Admin": [f"{r}:{a}" for r, a, _ in PERMISSIONS],  # Admin có tất cả
    "PM": [
        "portfolio:create", "portfolio:read", "portfolio:update",
        "project:create", "project:read", "project:update", "project:manage_members", "project:rollback",
        "task:create", "task:read", "task:update", "task:delete", "task:assign",
        "worklog:read",
        "change_request:read", "change_request:approve", "change_request:apply",
        "report:read", "report:export",
        "ai:generate_project", "ai:analyze_impact", "ai:optimize_schedule",
        "dashboard:read",
    ],
    "BA": [
        "project:read", "task:read",
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
    from app.models.permission import Permission
    from app.models.role import Role
    from app.models.user import User
    from app.core.security import hash_password

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

    # Assign permissions to roles
    for role_name, perm_keys in ROLE_PERMISSIONS.items():
        role = role_map[role_name]
        for key in perm_keys:
            if key in perm_map:
                role.permissions.append(perm_map[key])

    print("Seeding admin user...")
    admin = User(
        email="admin@example.com",
        username="admin",
        full_name="System Administrator",
        hashed_password=hash_password("Admin@123456"),
        position="System Admin",
        is_active=True,
        is_superuser=True,
    )
    db.add(admin)
    await db.flush()
    admin.roles.append(role_map["Admin"])

    await db.commit()
    print(f"\n✅ Seeded:")
    print(f"   - {len(PERMISSIONS)} permissions")
    print(f"   - {len(ROLES)} roles")
    print(f"   - 1 admin user: admin@example.com / Admin@123456")


async def main():
    from app.db.session import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        await seed(db)
    print("\n🎉 Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(main())
