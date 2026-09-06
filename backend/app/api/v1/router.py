from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    assignments,
    audit_timeline,
    auth,
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

# Các router bị comment bên dưới (Phase 5: AI, documents, reports, CPM, Gantt,
# change requests, ...) vẫn chỉ là các stub `TODO: Implement` thuần túy, KHÔNG có
# dependency auth. Việc mount chúng đã phơi bày ~55 route CRUD không xác thực ra
# internet. Chỉ bật lại từng cái khi đã có phần triển khai thực sự và một
# dependency auth/permission — xem các file endpoint trong api/v1/endpoints/.

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
# api_router.include_router(leaves.router, prefix="/leaves", tags=["Leaves"])
# api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
# api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
# api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
# api_router.include_router(
#     change_requests.router,
#     prefix="/change-requests",
#     tags=["Change Requests"],
# )
# api_router.include_router(gantt.router, prefix="/gantt", tags=["Gantt"])
# CPM la ngoai le duy nhat trong danh sach bi comment o tren: engine da hoan chinh
# va chay noi bo tu Phase 2, chi thieu duong doc ket qua. Endpoint nay chi doc va
# co get_project_context, khong phai stub CRUD khong auth nhu cac file con lai.
api_router.include_router(cpm.router, tags=["CPM"])
api_router.include_router(resource_leveling.router, tags=["Resource Leveling"])
api_router.include_router(dashboards.router, prefix="/dashboards", tags=["Dashboards"])
# api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(audit_timeline.router, prefix="/audit", tags=["Audit"])
# api_router.include_router(project_versions.router, prefix="/versions", tags=["Project Versions"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
# api_router.include_router(system.router, prefix="/system", tags=["System"])
