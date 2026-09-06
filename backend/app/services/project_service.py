import asyncio
import builtins
import logging
from datetime import UTC, date, datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.project import Project, ProjectMethodology, ProjectStatus
from app.models.user import User
from app.repositories.portfolio_repository import PortfolioRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.user_repository import UserRepository
from app.schemas.project import (
    AuditEventResponse,
    MilestoneSummary,
    PhaseSummary,
    ProjectCapabilities,
    ProjectCreate,
    ProjectDetailResponse,
    ProjectMemberCreate,
    ProjectMemberResponse,
    ProjectResponse,
    ProjectSummaryResponse,
    ProjectUpdate,
    RoleSummary,
    UserSummary,
)
from app.services.phase2_common import is_admin as _is_admin
from app.services.phase2_common import json_value as _json_value
from app.workers.email_tasks import send_project_invitation_email_task

logger = logging.getLogger(__name__)
PROJECT_ROLES = {"PM", "BA", "PO", "Member", "Customer"}


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProjectRepository(db)
        self.portfolios = PortfolioRepository(db)
        self.users = UserRepository(db)

    @staticmethod
    def _capabilities(
        project: Project, user: User, current_role: str | None
    ) -> ProjectCapabilities:
        can_manage = _is_admin(user) or project.pm_id == user.id or current_role == "PM"
        return ProjectCapabilities(
            can_update=can_manage,
            can_delete=can_manage,
            can_manage_members=can_manage,
        )

    def _summary(
        self,
        project: Project,
        portfolio_name: str | None,
        member_count: int,
        current_role: str | None,
        user: User,
    ) -> ProjectSummaryResponse:
        return ProjectSummaryResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            status=project.status.value,
            methodology=project.methodology.value,
            start_date=project.start_date,
            end_date=project.end_date,
            progress_percent=project.progress,
            budget=project.budget,
            budget_spent=project.actual_cost,
            currency=project.currency,
            portfolio_id=project.portfolio_id,
            portfolio_name=portfolio_name,
            pm_id=project.pm_id,
            member_count=int(member_count),
            created_at=project.created_at,
            updated_at=project.updated_at,
            current_user_role=current_role,
            capabilities=self._capabilities(project, user, current_role),
        )

    def _audit(
        self,
        actor_id: int,
        action: str,
        project: Project,
        *,
        old_values: dict | None = None,
        new_values: dict | None = None,
        description: str | None = None,
    ) -> None:
        self.db.add(
            AuditLog(
                user_id=actor_id,
                action=action,
                entity_type="Project",
                entity_id=project.id,
                # Đặt tường minh thay vì dựa vào request context: CREATE xảy ra
                # trước khi có bất kỳ lời gọi get_project_context() nào.
                project_id=project.id,
                old_values=old_values,
                new_values=new_values,
                description=description or f"{action.title()} project {project.name}",
            )
        )

    async def list(
        self,
        user: User,
        *,
        skip: int = 0,
        limit: int = 100,
        portfolio_id: int | None = None,
        status: ProjectStatus | None = None,
        methodology: ProjectMethodology | None = None,
        search: str | None = None,
        start_date_from: date | None = None,
        end_date_to: date | None = None,
    ) -> tuple[list[ProjectSummaryResponse], int]:
        rows, total = await self.repo.list_visible(
            user_id=user.id,
            is_admin=_is_admin(user),
            skip=skip,
            limit=limit,
            portfolio_id=portfolio_id,
            status=status,
            methodology=methodology,
            search=search,
            start_date_from=start_date_from,
            end_date_to=end_date_to,
        )
        return [self._summary(row[0], row[1], row[2], row[3], user) for row in rows], total

    async def _visible_row(self, project_id: int, user: User, *, detail: bool = False):
        project = await self.repo.get_active(project_id)
        if project is None:
            raise NotFoundException("Project not found")
        getter = self.repo.get_visible_detail if detail else self.repo.get_visible_summary
        row = await getter(project_id, user.id, _is_admin(user))
        if row is None:
            raise ForbiddenException("You do not have access to this project")
        return row

    async def _require_manager(self, project_id: int, user: User):
        row = await self._visible_row(project_id, user)
        project, _, _, current_role = row
        if not self._capabilities(project, user, current_role).can_update:
            raise ForbiddenException("Project PM privileges required")
        return row

    async def _validate_portfolio(self, portfolio_id: int, user: User) -> None:
        portfolio = await self.portfolios.get_active(portfolio_id)
        if portfolio is None:
            raise NotFoundException("Portfolio not found")
        if not _is_admin(user) and portfolio.owner_id != user.id:
            raise ForbiddenException("Only the portfolio owner can add projects")

    async def create(self, data: ProjectCreate, pm: User) -> ProjectResponse:
        if data.portfolio_id is not None:
            await self._validate_portfolio(data.portfolio_id, pm)

        project = Project(
            name=data.name,
            description=data.description,
            portfolio_id=data.portfolio_id,
            start_date=data.start_date,
            end_date=data.end_date,
            budget=data.budget,
            currency=data.currency,
            methodology=data.methodology,
            pm_id=pm.id,
        )
        project = await self.repo.create(project)
        pm_role = await self.repo.get_role_by_name("PM")
        if pm_role is None:
            raise BadRequestException("PM role is not configured")
        await self.repo.add_member(project.id, pm.id, pm_role.id)
        self._audit(
            pm.id,
            "CREATE",
            project,
            new_values={
                "name": project.name,
                "portfolio_id": project.portfolio_id,
                "methodology": project.methodology.value,
                "pm_id": project.pm_id,
            },
        )
        row = await self.repo.get_visible_summary(project.id, pm.id, _is_admin(pm))
        return ProjectResponse(**self._summary(*row, pm).model_dump())

    async def get(self, project_id: int, user: User) -> ProjectDetailResponse:
        project, portfolio_name, member_count, current_role = await self._visible_row(
            project_id, user, detail=True
        )
        task_count, completed_task_count = await self.repo.get_task_stats(project_id)
        base = self._summary(project, portfolio_name, member_count, current_role, user)
        return ProjectDetailResponse(
            **base.model_dump(),
            owner=UserSummary.model_validate(project.pm),
            task_count=task_count,
            completed_task_count=completed_task_count,
            phases=[PhaseSummary.model_validate(item) for item in project.phases],
            milestones=[MilestoneSummary.model_validate(item) for item in project.milestones],
        )

    async def update(self, project_id: int, data: ProjectUpdate, user: User) -> ProjectResponse:
        project, portfolio_name, member_count, current_role = await self._require_manager(
            project_id, user
        )
        changes = data.model_dump(exclude_unset=True)
        if not changes:
            summary = self._summary(
                project, portfolio_name, member_count, current_role, user
            )
            return ProjectResponse(
                **summary.model_dump()
            )
        for required_field in ("name", "currency", "status", "methodology"):
            if required_field in changes and changes[required_field] is None:
                label = required_field.replace("_", " ").title()
                raise BadRequestException(f"{label} cannot be null")

        if "portfolio_id" in changes and changes["portfolio_id"] is not None:
            await self._validate_portfolio(changes["portfolio_id"], user)
        start_date = changes.get("start_date", project.start_date)
        end_date = changes.get("end_date", project.end_date)
        if start_date is None or end_date is None:
            raise BadRequestException("Project start and end dates are required")
        if end_date < start_date:
            raise BadRequestException("End date must be on or after start date")

        old_values = {field: _json_value(getattr(project, field)) for field in changes}
        await self.repo.update(project, changes)
        self._audit(
            user.id,
            "UPDATE",
            project,
            old_values=old_values,
            new_values={field: _json_value(value) for field, value in changes.items()},
        )
        refreshed = await self.repo.get_visible_summary(project.id, user.id, _is_admin(user))
        return ProjectResponse(**self._summary(*refreshed, user).model_dump())

    async def delete(self, project_id: int, user: User) -> None:
        project, _, _, _ = await self._require_manager(project_id, user)
        now = datetime.now(UTC)
        await self.repo.soft_delete(project, now)
        self._audit(
            user.id,
            "DELETE",
            project,
            old_values={"deleted_at": None},
            new_values={"deleted_at": now.isoformat()},
        )

    async def list_members(self, project_id: int, user: User) -> builtins.list[ProjectMemberResponse]:
        project, _, _, _ = await self._visible_row(project_id, user)
        rows = await self.repo.list_members(project_id)
        return [
            ProjectMemberResponse(
                user=UserSummary.model_validate(member),
                role=RoleSummary.model_validate(role),
                joined_at=joined_at,
                is_owner=member.id == project.pm_id,
            )
            for member, role, joined_at in rows
        ]

    async def add_member(
        self,
        project_id: int,
        data: ProjectMemberCreate,
        inviter: User,
    ) -> ProjectMemberResponse:
        project, _, _, _ = await self._require_manager(project_id, inviter)
        member = await self.users.get_by_id(data.user_id)
        if member is None or not member.is_active:
            raise NotFoundException("Active user not found")
        role = await self.repo.get_role(data.role_id)
        if role is None or role.name not in PROJECT_ROLES:
            raise BadRequestException("Role is not assignable to a project")
        if await self.repo.get_member_role(project_id, member.id) is not None:
            raise ConflictException("User is already a project member")

        await self.repo.add_member(project_id, member.id, role.id)
        self._audit(
            inviter.id,
            "ADD_MEMBER",
            project,
            new_values={"user_id": member.id, "role_id": role.id, "role": role.name},
            description=f"Added {member.full_name} as {role.name}",
        )
        try:
            await asyncio.wait_for(
                asyncio.to_thread(
                    send_project_invitation_email_task.apply_async,
                    args=[
                        member.email,
                        inviter.full_name,
                        project.name,
                        role.name,
                        f"{settings.FRONTEND_URL.rstrip('/')}/projects/{project.id}/overview",
                    ],
                    retry=False,
                ),
                timeout=2.0,
            )
        except TimeoutError:
            logger.warning(
                "Timed out enqueueing project invitation for project_id=%s user_id=%s",
                project.id,
                member.id,
            )
        except Exception:
            logger.exception(
                "Failed to enqueue project invitation for project_id=%s user_id=%s",
                project.id,
                member.id,
            )
        row = await self.repo.get_member(project_id, member.id)
        return ProjectMemberResponse(
            user=UserSummary.model_validate(row[0]),
            role=RoleSummary.model_validate(row[1]),
            joined_at=row[2],
            is_owner=member.id == project.pm_id,
        )

    async def change_member_role(
        self, project_id: int, user_id: int, role_id: int, actor: User
    ) -> ProjectMemberResponse:
        """Doi vai tro cua mot thanh vien tai cho.

        Truoc day khong co duong nao lam viec nay: doi BA thanh PM phai xoa roi
        them lai, lam mat `joined_at` va de lai mot cap ADD/REMOVE gia trong audit
        trail nhu the nguoi do da roi du an.
        """
        project, _, _, _ = await self._require_manager(project_id, actor)
        member_row = await self.repo.get_member(project_id, user_id)
        if member_row is None:
            raise NotFoundException("Project member not found")
        member, old_role, joined_at = member_row

        role = await self.repo.get_role(role_id)
        if role is None or role.name not in PROJECT_ROLES:
            raise BadRequestException("Role is not assignable to a project")
        if user_id == project.pm_id and role.name != "PM":
            # `pm_id` va `project_members` phai noi cung mot dieu - xem
            # phase2_common.get_project_context, noi ca hai duoc doc.
            raise BadRequestException(
                "Transfer project ownership before changing the owner's role"
            )

        if old_role.id != role.id:
            await self.repo.set_member_role(project_id, user_id, role.id)
            self._audit(
                actor.id,
                "CHANGE_MEMBER_ROLE",
                project,
                old_values={"user_id": user_id, "role": old_role.name},
                new_values={"user_id": user_id, "role": role.name},
                description=f"Changed {member.full_name} from {old_role.name} to {role.name}",
            )

        return ProjectMemberResponse(
            user=UserSummary.model_validate(member),
            role=RoleSummary.model_validate(role),
            joined_at=joined_at,
            is_owner=user_id == project.pm_id,
        )

    async def remove_member(self, project_id: int, user_id: int, actor: User) -> None:
        project, _, _, _ = await self._require_manager(project_id, actor)
        if user_id == project.pm_id:
            raise BadRequestException("Project owner cannot be removed")
        member_row = await self.repo.get_member(project_id, user_id)
        if member_row is None:
            raise NotFoundException("Project member not found")
        await self.repo.remove_member(project_id, user_id)
        member, role, _ = member_row
        self._audit(
            actor.id,
            "REMOVE_MEMBER",
            project,
            old_values={"user_id": member.id, "role_id": role.id, "role": role.name},
            description=f"Removed {member.full_name} from the project",
        )

    async def activity(
        self, project_id: int, user: User, limit: int = 10
    ) -> builtins.list[AuditEventResponse]:
        await self._visible_row(project_id, user)
        rows = await self.repo.list_activity(project_id, limit)
        return [
            AuditEventResponse(
                id=audit.id,
                action=audit.action,
                old_values=audit.old_values,
                new_values=audit.new_values,
                description=audit.description,
                created_at=audit.created_at,
                actor=UserSummary.model_validate(actor) if actor else None,
            )
            for audit, actor in rows
        ]


async def get_project_service(db: Annotated[AsyncSession, Depends(get_db)]) -> ProjectService:
    return ProjectService(db)


ProjectServiceDep = Annotated[ProjectService, Depends(get_project_service)]
