# Import TẤT CẢ models ở đây để Alembic có thể phát hiện chúng cho auto-migrations.
# Thứ tự import có nghĩa: Base trước, Association tables trước khi models dùng secondary.

from app.models.base import Base  # noqa: F401

# ─── Association tables (phải được import trước các model dùng chúng làm secondary) ───
from app.models.associations import (  # noqa: F401
    user_roles,
    role_permissions,
    user_skills,
    project_members,
)

# ─── Domain 2: Người dùng & RBAC ──────────────────────────────────────────────
from app.models.user import User  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.permission import Permission  # noqa: F401
from app.models.skill import Skill  # noqa: F401
from app.models.leave import Leave  # noqa: F401

# ─── Domain 3: Lõi dự án ──────────────────────────────────────────────────────
from app.models.portfolio import Portfolio  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.phase import Phase  # noqa: F401
from app.models.sprint import Sprint  # noqa: F401
from app.models.epic import Epic  # noqa: F401
from app.models.milestone import Milestone  # noqa: F401

# ─── Domain 4: Task & Lập lịch ──────────────────────────────────────────────
from app.models.task import Task  # noqa: F401
from app.models.subtask import Subtask  # noqa: F401
from app.models.dependency import Dependency  # noqa: F401
from app.models.assignment import Assignment  # noqa: F401
from app.models.worklog import Worklog  # noqa: F401
from app.models.comment import Comment  # noqa: F401

# ─── Domain 5: Quản lý thay đổi ─────────────────────────────────────────────
from app.models.change_request import ChangeRequest  # noqa: F401
from app.models.approval import Approval  # noqa: F401
from app.models.project_version import ProjectVersion  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.impact_report import ImpactReport  # noqa: F401

# ─── Domain 6: Miền AI ───────────────────────────────────────────────────────
from app.models.ai_request import AIRequest  # noqa: F401
from app.models.ai_output import AIOutput  # noqa: F401
from app.models.risk_report import RiskReport  # noqa: F401

# ─── Domain 7: Tài liệu & Thông báo ─────────────────────────────────────────
from app.models.document import Document  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.email_log import EmailLog  # noqa: F401

# ─── Domain 8: Trò chuyện ──────────────────────────────────────────────────
from app.models.chat_message import ChatMessage  # noqa: F401
from app.models.chat_read_state import ChatReadState  # noqa: F401
