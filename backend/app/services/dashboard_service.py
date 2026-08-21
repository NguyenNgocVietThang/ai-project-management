"""
DashboardService – tổng hợp dữ liệu cho Phase 3 dashboards.

Cung cấp:
  • get_user_summary()       – Home Dashboard (3.1)
  • get_portfolio_health()   – Portfolio health card (3.1)
  • get_project_stats()      – Project Dashboard charts (3.2)
"""
from datetime import date, datetime, timedelta, timezone
from typing import Annotated, List, Optional, Tuple

from fastapi import Depends
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.assignment import Assignment
from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio
from app.models.project import Project, ProjectStatus
from app.models.role import Role
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User
from app.models.worklog import Worklog
from app.schemas.dashboard import (
    ActiveProjectSummary,
    BudgetSummary,
    BurndownPoint,
    MyTaskItem,
    PortfolioHealthResponse,
    PortfolioProjectHealth,
    ProjectDashboardStats,
    RecentActivityItem,
    TaskStatusCount,
    TeamMemberUtilization,
    UserDashboardStats,
    UserDashboardSummary,
)
from app.services.phase2_common import is_admin as _is_admin

# ── colour hints for task-status donut chart ──────────────────────────────────
STATUS_COLORS: dict[str, str] = {
    TaskStatus.TODO.value: "#6b7280",
    TaskStatus.IN_PROGRESS.value: "#3b82f6",
    TaskStatus.IN_REVIEW.value: "#f59e0b",
    TaskStatus.DONE.value: "#22c55e",
    TaskStatus.BLOCKED.value: "#ef4444",
}

def _iso_week_bounds(today: date) -> Tuple[date, date]:
    """Return (monday, sunday) of the ISO week containing *today*."""
    monday = today - timedelta(days=today.weekday())
    return monday, monday + timedelta(days=6)


class DashboardService:

    def __init__(self, db: AsyncSession):
        self.db = db

    # ─────────────────────────────────────────────────────────────────────────
    #  3.1  Home Dashboard – user summary
    # ─────────────────────────────────────────────────────────────────────────

    async def get_user_summary(self, user: User) -> UserDashboardSummary:
        today = date.today()
        admin = _is_admin(user)

        # ── 1. Visible project ids ──────────────────────────────────────────
        project_ids = await self._visible_project_ids(user.id, admin)

        # ── 2. Per-project task counts (single query) ───────────────────────
        task_rows = await self._project_task_counts(project_ids, today)
        task_map: dict[int, dict] = {r.project_id: r for r in task_rows}

        # ── 3. Active projects ──────────────────────────────────────────────
        projects = await self._active_projects(project_ids, task_map, today)

        # ── 4. Global stats ─────────────────────────────────────────────────
        total_tasks = sum(r.total for r in task_rows)
        overdue_tasks = sum(r.overdue for r in task_rows)
        active_project_count = sum(
            1 for p in projects if p.status == ProjectStatus.ACTIVE.value
        )

        # ── 5. Hours this week (from worklogs) ──────────────────────────────
        week_start, week_end = _iso_week_bounds(today)
        hours_result = await self.db.scalar(
            select(func.coalesce(func.sum(Worklog.hours), 0.0)).where(
                Worklog.user_id == user.id,
                Worklog.log_date >= week_start,
                Worklog.log_date <= week_end,
            )
        )
        hours_this_week = float(hours_result or 0.0)

        # ── 6. My Tasks (assigned to me, not done) ──────────────────────────
        my_tasks = await self._my_tasks(user.id, project_ids, today)

        # ── 7. Recent activity (across all visible projects) ─────────────────
        recent_activity = await self._recent_activity(project_ids, limit=15)

        return UserDashboardSummary(
            stats=UserDashboardStats(
                active_projects=active_project_count,
                total_tasks=total_tasks,
                overdue_tasks=overdue_tasks,
                hours_this_week=round(hours_this_week, 2),
            ),
            active_projects=projects,
            my_tasks=my_tasks,
            recent_activity=recent_activity,
        )

    # ─────────────────────────────────────────────────────────────────────────
    #  3.1  Portfolio Health
    # ─────────────────────────────────────────────────────────────────────────

    async def get_portfolio_health(
        self, portfolio_id: int, user: User
    ) -> PortfolioHealthResponse:
        admin = _is_admin(user)

        portfolio = await self.db.scalar(
            select(Portfolio).where(
                Portfolio.id == portfolio_id,
                Portfolio.deleted_at.is_(None),
            )
        )
        if portfolio is None:
            raise NotFoundException("Portfolio not found")
        if not admin and portfolio.owner_id != user.id:
            raise ForbiddenException("Access denied")

        # All non-deleted projects in this portfolio
        proj_result = await self.db.execute(
            select(Project).where(
                Project.portfolio_id == portfolio_id,
                Project.deleted_at.is_(None),
            )
        )
        projects: List[Project] = list(proj_result.scalars().all())
        today = date.today()
        project_ids = [p.id for p in projects]

        task_rows = await self._project_task_counts(project_ids, today) if project_ids else []
        task_map = {r.project_id: r for r in task_rows}

        portfolio_projects = []
        for proj in projects:
            tr = task_map.get(proj.id)
            overdue = int(tr.overdue) if tr else 0
            utilization = None
            if proj.budget and proj.budget > 0:
                utilization = round(proj.actual_cost / proj.budget * 100, 1)
            portfolio_projects.append(
                PortfolioProjectHealth(
                    project_id=proj.id,
                    project_name=proj.name,
                    progress_percent=round(proj.progress, 1),
                    status=proj.status.value,
                    overdue_tasks=overdue,
                    budget_utilization_pct=utilization,
                )
            )

        active_count = sum(1 for p in projects if p.status == ProjectStatus.ACTIVE)
        completed_count = sum(1 for p in projects if p.status == ProjectStatus.COMPLETED)
        overall_progress = (
            round(sum(p.progress for p in projects) / len(projects), 1)
            if projects
            else 0.0
        )

        return PortfolioHealthResponse(
            portfolio_id=portfolio.id,
            portfolio_name=portfolio.name,
            total_projects=len(projects),
            active_projects=active_count,
            completed_projects=completed_count,
            overall_progress=overall_progress,
            projects=portfolio_projects,
        )

    # ─────────────────────────────────────────────────────────────────────────
    #  3.2  Project Dashboard Stats
    # ─────────────────────────────────────────────────────────────────────────

    async def get_project_stats(
        self, project_id: int, user: User
    ) -> ProjectDashboardStats:
        admin = _is_admin(user)

        # Load project with full relations
        project: Optional[Project] = await self.db.scalar(
            select(Project)
            .where(Project.id == project_id, Project.deleted_at.is_(None))
            .options(selectinload(Project.members))
        )
        if project is None:
            raise NotFoundException("Project not found")

        # Check access
        is_member = any(m.id == user.id for m in project.members)
        if not admin and project.pm_id != user.id and not is_member:
            raise ForbiddenException("Access denied")

        today = date.today()

        # ── Task distribution ───────────────────────────────────────────────
        dist_result = await self.db.execute(
            select(Task.status, func.count().label("cnt"))
            .where(Task.project_id == project_id)
            .group_by(Task.status)
        )
        dist_rows = dist_result.all()
        task_distribution = [
            TaskStatusCount(
                status=row.status.value,
                count=row.cnt,
                color=STATUS_COLORS.get(row.status.value, "#6b7280"),
            )
            for row in dist_rows
        ]

        total_tasks = sum(r.count for r in task_distribution)
        completed_tasks = next(
            (r.count for r in task_distribution if r.status == TaskStatus.DONE.value), 0
        )

        # Overdue count
        overdue_tasks = await self.db.scalar(
            select(func.count()).where(
                Task.project_id == project_id,
                Task.status != TaskStatus.DONE,
                Task.due_date < today,
            )
        ) or 0

        # Critical tasks
        critical_tasks = await self.db.scalar(
            select(func.count()).where(
                Task.project_id == project_id,
                Task.is_critical.is_(True),
                Task.status != TaskStatus.DONE,
            )
        ) or 0

        # ── Budget ──────────────────────────────────────────────────────────
        remaining = None
        utilization = None
        if project.budget is not None:
            remaining = project.budget - project.actual_cost
            if project.budget > 0:
                utilization = round(project.actual_cost / project.budget * 100, 1)

        budget_summary = BudgetSummary(
            budget=project.budget,
            spent=project.actual_cost,
            remaining=remaining,
            utilization_pct=utilization,
            currency=project.currency,
        )

        # ── Team utilization ────────────────────────────────────────────────
        team_utilization = await self._team_utilization(project_id, project.pm_id)

        # ── Burndown (simple: track completed tasks per day for last 14 days)
        burndown = await self._burndown(project_id, total_tasks, today)

        return ProjectDashboardStats(
            project_id=project.id,
            project_name=project.name,
            task_distribution=task_distribution,
            budget=budget_summary,
            team_utilization=team_utilization,
            burndown=burndown,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            overdue_tasks=int(overdue_tasks),
            critical_tasks=int(critical_tasks),
        )

    # ─────────────────────────────────────────────────────────────────────────
    #  Private helpers
    # ─────────────────────────────────────────────────────────────────────────

    async def _visible_project_ids(self, user_id: int, admin: bool) -> List[int]:
        """Return list of project IDs visible to this user."""
        if admin:
            result = await self.db.execute(
                select(Project.id).where(Project.deleted_at.is_(None))
            )
        else:
            result = await self.db.execute(
                select(Project.id).where(
                    Project.deleted_at.is_(None),
                    or_(
                        Project.pm_id == user_id,
                        select(1)
                        .where(
                            project_members.c.project_id == Project.id,
                            project_members.c.user_id == user_id,
                        )
                        .exists(),
                    ),
                )
            )
        return list(result.scalars().all())

    async def _project_task_counts(self, project_ids: List[int], today: date):
        if not project_ids:
            return []
        result = await self.db.execute(
            select(
                Task.project_id,
                func.count().label("total"),
                func.sum(
                    func.cast(Task.status == TaskStatus.DONE, type_=None)
                ).label("done"),
                func.sum(
                    func.cast(
                        (Task.due_date < today) & (Task.status != TaskStatus.DONE),
                        type_=None,
                    )
                ).label("overdue"),
            )
            .where(Task.project_id.in_(project_ids))
            .group_by(Task.project_id)
        )
        return result.all()

    async def _active_projects(
        self, project_ids: List[int], task_map: dict, today: date
    ) -> List[ActiveProjectSummary]:
        if not project_ids:
            return []
        result = await self.db.execute(
            select(Project).where(
                Project.id.in_(project_ids),
                Project.deleted_at.is_(None),
            )
        )
        projects = list(result.scalars().all())

        summaries = []
        for proj in projects:
            tr = task_map.get(proj.id)
            tc = int(tr.total) if tr else 0
            dc = int(tr.done) if tr else 0
            days_remaining = None
            if proj.end_date:
                days_remaining = max(0, (proj.end_date - today).days)
            summaries.append(
                ActiveProjectSummary(
                    id=proj.id,
                    name=proj.name,
                    status=proj.status.value,
                    methodology=proj.methodology.value,
                    progress_percent=round(proj.progress, 1),
                    task_count=tc,
                    completed_task_count=dc,
                    budget=proj.budget,
                    budget_spent=proj.actual_cost,
                    currency=proj.currency,
                    end_date=proj.end_date,
                    days_remaining=days_remaining,
                )
            )
        return summaries

    async def _my_tasks(
        self, user_id: int, project_ids: List[int], today: date
    ) -> List[MyTaskItem]:
        if not project_ids:
            return []
        result = await self.db.execute(
            select(Task, Project.name.label("project_name"))
            .join(Project, Project.id == Task.project_id)
            .where(
                Task.project_id.in_(project_ids),
                Task.status != TaskStatus.DONE,
                or_(
                    Task.assignee_id == user_id,
                    select(1)
                    .where(
                        Assignment.task_id == Task.id,
                        Assignment.user_id == user_id,
                    )
                    .exists(),
                ),
            )
            .order_by(Task.due_date.asc().nulls_last(), Task.priority.desc())
            .limit(20)
        )
        rows = result.all()
        items = []
        for row in rows:
            task: Task = row[0]
            project_name: str = row[1]
            is_overdue = bool(task.due_date and task.due_date < today)
            items.append(
                MyTaskItem(
                    id=task.id,
                    name=task.name,
                    project_id=task.project_id,
                    project_name=project_name,
                    status=task.status.value,
                    priority=task.priority.value,
                    due_date=task.due_date,
                    is_critical=task.is_critical,
                    is_overdue=is_overdue,
                )
            )
        return items

    async def _recent_activity(
        self, project_ids: List[int], limit: int = 15
    ) -> List[RecentActivityItem]:
        if not project_ids:
            return []
        result = await self.db.execute(
            select(AuditLog, User.full_name.label("actor_name"))
            .outerjoin(User, User.id == AuditLog.user_id)
            .where(
                AuditLog.entity_type.in_(["Task", "Project", "Phase", "Sprint", "Milestone"]),
            )
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
        )
        rows = result.all()
        return [
            RecentActivityItem(
                id=row[0].id,
                action=row[0].action,
                description=row[0].description,
                entity_type=row[0].entity_type,
                entity_id=row[0].entity_id,
                actor_name=row[1],
                created_at=row[0].created_at,
            )
            for row in rows
        ]

    async def _team_utilization(
        self, project_id: int, pm_id: int
    ) -> List[TeamMemberUtilization]:
        # Get member ids from project_members + PM
        members_result = await self.db.execute(
            select(
                User.id,
                User.full_name,
                User.avatar_url,
            )
            .join(project_members, project_members.c.user_id == User.id)
            .where(project_members.c.project_id == project_id)
        )
        members = list(members_result.all())

        utilization = []
        for m in members:
            # Task count assigned to this member
            task_count = await self.db.scalar(
                select(func.count(Task.id)).where(
                    Task.project_id == project_id,
                    or_(
                        Task.assignee_id == m.id,
                        select(1)
                        .where(
                            Assignment.task_id == Task.id,
                            Assignment.user_id == m.id,
                        )
                        .exists(),
                    ),
                )
            ) or 0
            # Logged hours on this project
            logged = await self.db.scalar(
                select(func.coalesce(func.sum(Worklog.hours), 0.0))
                .join(Task, Task.id == Worklog.task_id)
                .where(
                    Task.project_id == project_id,
                    Worklog.user_id == m.id,
                )
            ) or 0.0
            # Estimated hours (from assignments on this project)
            estimated = await self.db.scalar(
                select(func.coalesce(func.sum(Assignment.allocated_hours), 0.0))
                .join(Task, Task.id == Assignment.task_id)
                .where(
                    Task.project_id == project_id,
                    Assignment.user_id == m.id,
                )
            ) or 0.0

            utilization.append(
                TeamMemberUtilization(
                    user_id=m.id,
                    full_name=m.full_name,
                    avatar_url=m.avatar_url,
                    estimated_hours=round(float(estimated), 1),
                    logged_hours=round(float(logged), 1),
                    task_count=int(task_count),
                )
            )
        return utilization

    async def _burndown(
        self, project_id: int, total_tasks: int, today: date
    ) -> List[BurndownPoint]:
        """Simple 14-day burndown: remaining = total - cumulative done tasks."""
        days = 14
        start = today - timedelta(days=days - 1)
        points = []
        for i in range(days):
            day = start + timedelta(days=i)
            done_by_day = await self.db.scalar(
                select(func.count()).where(
                    Task.project_id == project_id,
                    Task.status == TaskStatus.DONE,
                    Task.actual_end <= day,
                )
            ) or 0
            ideal = max(0.0, total_tasks - total_tasks * (i + 1) / days)
            points.append(
                BurndownPoint(
                    date=day.isoformat(),
                    remaining=max(0.0, total_tasks - float(done_by_day)),
                    ideal=round(ideal, 1),
                )
            )
        return points


# ── FastAPI dependency injection ──────────────────────────────────────────────

async def get_dashboard_service(db: Annotated[AsyncSession, Depends(get_db)]) -> DashboardService:
    return DashboardService(db)


DashboardServiceDep = Annotated[DashboardService, Depends(get_dashboard_service)]
