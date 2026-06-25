# Import ALL models here so Alembic can detect them for auto-migrations.
# Thứ tự import có nghĩa: Base trước, Association tables trước khi models dùng secondary.

from app.models.base import Base  # noqa: F401

# ─── Association tables (must be imported before models using them as secondary) ───
from app.models.associations import (  # noqa: F401
    user_roles,
    role_permissions,
    user_skills,
    project_members,
)

# ─── Domain 2: User & RBAC ────────────────────────────────────────────────────
from app.models.user import User  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.permission import Permission  # noqa: F401
from app.models.skill import Skill  # noqa: F401
from app.models.leave import Leave  # noqa: F401

# ─── Domain 3: Project Core ───────────────────────────────────────────────────
from app.models.portfolio import Portfolio  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.phase import Phase  # noqa: F401
from app.models.sprint import Sprint  # noqa: F401
from app.models.epic import Epic  # noqa: F401
from app.models.milestone import Milestone  # noqa: F401

# ─── Domain 4: Task & Scheduling ─────────────────────────────────────────────
from app.models.task import Task  # noqa: F401
from app.models.subtask import Subtask  # noqa: F401
from app.models.dependency import Dependency  # noqa: F401
from app.models.assignment import Assignment  # noqa: F401
from app.models.worklog import Worklog  # noqa: F401
from app.models.comment import Comment  # noqa: F401

# ─── Domain 5: Change Management ─────────────────────────────────────────────
from app.models.change_request import ChangeRequest  # noqa: F401
from app.models.approval import Approval  # noqa: F401
from app.models.project_version import ProjectVersion  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.impact_report import ImpactReport  # noqa: F401

# ─── Domain 6: AI Domain ─────────────────────────────────────────────────────
from app.models.ai_request import AIRequest  # noqa: F401
from app.models.ai_output import AIOutput  # noqa: F401
from app.models.risk_report import RiskReport  # noqa: F401

# ─── Domain 7: Document & Notification ───────────────────────────────────────
from app.models.document import Document  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.email_log import EmailLog  # noqa: F401
