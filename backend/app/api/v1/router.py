from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    assignments,
    audit_timeline,
    auth,
    change_requests,
    chat,
    cpm,
    dashboards,
    dependencies,
    epics,
    milestones,
    notifications,
    oauth,
    permissions,
    phases,
    portfolios,
    projects,
    resource_leveling,
    roles,
    sprints,
    subtasks,
    tasks,
    users,
    worklogs,
)

api_router = APIRouter()

# Chưa mount: leaves, skills, documents, approvals, gantt, reports, project_versions,
# system. Các endpoint này vẫn là stub `TODO: Implement` không có auth; chỉ mount khi đã
# có triển khai thật và dependency phân quyền.
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(oauth.router, prefix="/oauth", tags=["OAuth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(permissions.router, prefix="/permissions", tags=["Permissions"])
api_router.include_router(portfolios.router, prefix="/portfolios", tags=["Portfolios"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(phases.router, tags=["Phases"])
api_router.include_router(sprints.router, tags=["Sprints"])
api_router.include_router(epics.router, tags=["Epics"])
api_router.include_router(milestones.router, tags=["Milestones"])
api_router.include_router(tasks.router, tags=["Tasks"])
api_router.include_router(subtasks.router, tags=["Subtasks"])
api_router.include_router(dependencies.router, tags=["Dependencies"])
api_router.include_router(assignments.router, tags=["Assignments"])
api_router.include_router(worklogs.router, tags=["Worklogs"])
api_router.include_router(chat.router, tags=["Chat"])
api_router.include_router(change_requests.router, tags=["Change Requests"])
api_router.include_router(cpm.router, tags=["CPM"])
api_router.include_router(resource_leveling.router, tags=["Resource Leveling"])
api_router.include_router(dashboards.router, prefix="/dashboards", tags=["Dashboards"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(audit_timeline.router, prefix="/audit", tags=["Audit"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
