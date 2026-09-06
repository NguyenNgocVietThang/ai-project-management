from datetime import date, datetime

from sqlalchemy import case, delete, exists, func, insert, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.associations import project_members
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio
from app.models.project import Project, ProjectMethodology, ProjectStatus
from app.models.role import Role
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)

    @staticmethod
    def _access_filter(user_id: int, is_admin: bool):
        if is_admin:
            return True
        return or_(
            Project.pm_id == user_id,
            exists(
                select(1).where(
                    project_members.c.project_id == Project.id,
                    project_members.c.user_id == user_id,
                )
            ),
        )

    @staticmethod
    def _summary_statement(user_id: int):
        member_count = (
            select(func.count())
            .select_from(project_members)
            .where(project_members.c.project_id == Project.id)
            .correlate(Project)
            .scalar_subquery()
        )
        current_role = (
            select(Role.name)
            .select_from(
                project_members.join(Role, Role.id == project_members.c.role_id)
            )
            .where(
                project_members.c.project_id == Project.id,
                project_members.c.user_id == user_id,
            )
            .correlate(Project)
            .scalar_subquery()
        )
        portfolio_name = (
            select(Portfolio.name)
            .where(Portfolio.id == Project.portfolio_id)
            .correlate(Project)
            .scalar_subquery()
        )
        return select(
            Project,
            portfolio_name.label("portfolio_name"),
            member_count.label("member_count"),
            current_role.label("current_user_role"),
        )

    async def list_visible(
        self,
        *,
        user_id: int,
        is_admin: bool,
        skip: int,
        limit: int,
        portfolio_id: int | None = None,
        status: ProjectStatus | None = None,
        methodology: ProjectMethodology | None = None,
        search: str | None = None,
        start_date_from: date | None = None,
        end_date_to: date | None = None,
    ):
        access_filter = self._access_filter(user_id, is_admin)
        filters = [Project.deleted_at.is_(None), access_filter]
        if portfolio_id is not None:
            filters.append(Project.portfolio_id == portfolio_id)
        if status is not None:
            filters.append(Project.status == status)
        if methodology is not None:
            filters.append(Project.methodology == methodology)
        if search:
            pattern = f"%{search.strip()}%"
            filters.append(or_(Project.name.ilike(pattern), Project.description.ilike(pattern)))
        if start_date_from is not None:
            filters.append(Project.start_date >= start_date_from)
        if end_date_to is not None:
            filters.append(Project.end_date <= end_date_to)

        stmt = self._summary_statement(user_id).where(*filters)
        count_stmt = select(func.count()).select_from(Project).where(*filters)
        total = (await self.db.execute(count_stmt)).scalar_one()
        rows = (
            await self.db.execute(
                stmt.order_by(Project.created_at.desc()).offset(skip).limit(limit)
            )
        ).all()
        return rows, total

    async def get_visible_summary(self, project_id: int, user_id: int, is_admin: bool):
        stmt = self._summary_statement(user_id).where(
            Project.id == project_id,
            Project.deleted_at.is_(None),
            self._access_filter(user_id, is_admin),
        )
        return (await self.db.execute(stmt)).one_or_none()

    async def get_visible_detail(self, project_id: int, user_id: int, is_admin: bool):
        stmt = (
            self._summary_statement(user_id)
            .options(
                selectinload(Project.pm),
                selectinload(Project.phases),
                selectinload(Project.milestones),
            )
            .where(
                Project.id == project_id,
                Project.deleted_at.is_(None),
                self._access_filter(user_id, is_admin),
            )
        )
        return (await self.db.execute(stmt)).one_or_none()

    async def get_active(self, project_id: int) -> Project | None:
        result = await self.db.execute(
            select(Project).where(Project.id == project_id, Project.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def get_task_stats(self, project_id: int) -> tuple[int, int]:
        row = (
            await self.db.execute(
                select(
                    func.count(Task.id),
                    func.coalesce(
                        func.sum(case((Task.status == TaskStatus.DONE, 1), else_=0)),
                        0,
                    ),
                ).where(Task.project_id == project_id)
            )
        ).one()
        return int(row[0]), int(row[1])

    async def get_member_role(self, project_id: int, user_id: int) -> Role | None:
        result = await self.db.execute(
            select(Role)
            .join(project_members, project_members.c.role_id == Role.id)
            .where(
                project_members.c.project_id == project_id,
                project_members.c.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_members(self, project_id: int):
        return (
            await self.db.execute(
                select(User, Role, project_members.c.joined_at)
                .select_from(project_members)
                .join(User, User.id == project_members.c.user_id)
                .join(Role, Role.id == project_members.c.role_id)
                .where(project_members.c.project_id == project_id)
                .order_by(project_members.c.joined_at, User.full_name)
            )
        ).all()

    async def get_member(self, project_id: int, user_id: int):
        return (
            await self.db.execute(
                select(User, Role, project_members.c.joined_at)
                .select_from(project_members)
                .join(User, User.id == project_members.c.user_id)
                .join(Role, Role.id == project_members.c.role_id)
                .where(
                    project_members.c.project_id == project_id,
                    project_members.c.user_id == user_id,
                )
            )
        ).one_or_none()

    async def get_role(self, role_id: int) -> Role | None:
        return (
            await self.db.execute(select(Role).where(Role.id == role_id))
        ).scalar_one_or_none()

    async def get_role_by_name(self, name: str) -> Role | None:
        return (
            await self.db.execute(select(Role).where(Role.name == name))
        ).scalar_one_or_none()

    async def set_member_role(self, project_id: int, user_id: int, role_id: int) -> None:
        """Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`."""
        await self.db.execute(
            update(project_members)
            .where(
                project_members.c.project_id == project_id,
                project_members.c.user_id == user_id,
            )
            .values(role_id=role_id)
        )

    async def add_member(self, project_id: int, user_id: int, role_id: int) -> None:
        await self.db.execute(
            insert(project_members).values(
                project_id=project_id,
                user_id=user_id,
                role_id=role_id,
            )
        )
        await self.db.flush()

    async def remove_member(self, project_id: int, user_id: int) -> bool:
        result = await self.db.execute(
            delete(project_members).where(
                project_members.c.project_id == project_id,
                project_members.c.user_id == user_id,
            )
        )
        await self.db.flush()
        return bool(result.rowcount)

    async def soft_delete(self, project: Project, deleted_at: datetime) -> None:
        project.deleted_at = deleted_at
        await self.db.flush()

    async def list_activity(self, project_id: int, limit: int):
        return (
            await self.db.execute(
                select(AuditLog, User)
                .outerjoin(User, User.id == AuditLog.user_id)
                .where(AuditLog.entity_type == "Project", AuditLog.entity_id == project_id)
                .order_by(AuditLog.created_at.desc())
                .limit(limit)
            )
        ).all()
