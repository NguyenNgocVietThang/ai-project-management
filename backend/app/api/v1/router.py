from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    approvals,
    assignments,
    audit_timeline,
    auth,
    change_requests,
    cpm,
    dashboards,
    dependencies,
    documents,
    epics,
    gantt,
    leaves,
    milestones,
    notifications,
    oauth,
    permissions,
    phases,
    portfolios,
    project_versions,
    projects,
    reports,
    resource_leveling,
    roles,
    skills,
    sprints,
    subtasks,
    system,
    tasks,
    users,
    worklogs,
)

api_router = APIRouter()

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
api_router.include_router(leaves.router, prefix="/leaves", tags=["Leaves"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
api_router.include_router(
    change_requests.router,
    prefix="/change-requests",
    tags=["Change Requests"],
)
api_router.include_router(gantt.router, prefix="/gantt", tags=["Gantt"])
api_router.include_router(cpm.router, prefix="/cpm", tags=["CPM"])
api_router.include_router(resource_leveling.router, tags=["Resource Leveling"])
api_router.include_router(dashboards.router, prefix="/dashboards", tags=["Dashboards"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(audit_timeline.router, prefix="/audit", tags=["Audit"])
api_router.include_router(project_versions.router, prefix="/versions", tags=["Project Versions"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(system.router, prefix="/system", tags=["System"])
