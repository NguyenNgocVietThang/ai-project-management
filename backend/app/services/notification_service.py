"""
NotificationService – CRUD + helper để tạo notifications từ các service khác.

Cách dùng (từ task_service hoặc các service khác):
    await NotificationService.push(
        db, user_id=member.id,
        title="Công việc đã được phân công",
        message=f"Bạn đã được phân công công việc '{task.name}'",
        ntype=NotificationType.TASK_ASSIGNED,
        link=f"/projects/{task.project_id}/tasks/{task.id}",
        entity_type="Task",
        entity_id=task.id,
    )
"""
import logging
from collections.abc import Sequence
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import Depends
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.device_token import DeviceToken
from app.models.notification import Notification, NotificationType
from app.schemas.notification import (
    MarkReadResponse,
    NotificationListResponse,
    NotificationResponse,
    UnreadCountResponse,
)

logger = logging.getLogger(__name__)

# Push quá cũ không còn giá trị (người dùng đã thấy thông báo trong app); hết hạn thì bỏ.
PUSH_JOB_TTL = timedelta(hours=6)


async def enqueue_push_jobs(db: AsyncSession, notifications: Sequence[Notification]) -> None:
    """Xếp hàng push cho thiết bị của người nhận, CÙNG transaction với thông báo.

    Mỗi (thông báo × thiết bị) một job: retry một thiết bị không gửi trùng sang thiết bị khác.
    Không làm gì khi `PUSH_PROVIDER=disabled` (hành vi mặc định) và không bao giờ làm hỏng
    nghiệp vụ gọi nó: lỗi hàng đợi chỉ mất push, còn thông báo trong app vẫn còn.
    """
    if settings.PUSH_PROVIDER == "disabled" or not notifications:
        return
    from app.services.job_service import enqueue

    try:
        # Savepoint: lỗi ở đây không được làm hỏng transaction nghiệp vụ đang mở.
        async with db.begin_nested():
            user_ids = {notification.user_id for notification in notifications}
            devices = (
                await db.scalars(
                    select(DeviceToken).where(
                        DeviceToken.user_id.in_(user_ids), DeviceToken.revoked_at.is_(None)
                    )
                )
            ).all()
            by_user: dict[int, list[DeviceToken]] = {}
            for device in devices:
                by_user.setdefault(device.user_id, []).append(device)
            expires_at = datetime.now(UTC) + PUSH_JOB_TTL
            for notification in notifications:
                for device in by_user.get(notification.user_id, []):
                    await enqueue(
                        db,
                        "push.send",
                        {"notification_id": notification.id, "device_id": device.id},
                        f"push:{notification.id}:{device.id}",
                        owner_id=notification.user_id,
                        expires_at=expires_at,
                    )
    except Exception:
        # Không log nội dung lỗi: câu SQL có thể chứa tham số.
        logger.warning("Could not queue push notification jobs")


class NotificationService:

    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    async def push_many(
        db: AsyncSession,
        user_ids: Sequence[int],
        *,
        title: str,
        message: str,
        ntype: NotificationType,
        link: str | None = None,
        entity_type: str | None = None,
        entity_id: int | None = None,
    ) -> list[Notification]:
        """Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish.

        Gọi `push()` trong vòng lặp tốn một `flush()` và một round-trip Redis cho
        MỖI thành viên, tất cả nằm trong request đang chờ. Với một dự án 50 người,
        mỗi lần đổi trạng thái task phải trả giá đó. Ở đây tất cả các dòng được
        flush cùng nhau và các payload WS đi trong một pipeline.
        """
        if not user_ids:
            return []

        notifications = [
            Notification(
                user_id=user_id,
                title=title,
                message=message,
                notification_type=ntype,
                link=link,
                related_entity_type=entity_type,
                related_entity_id=entity_id,
            )
            for user_id in user_ids
        ]
        db.add_all(notifications)
        # Một lần flush cho cả lô: cần id và created_at do server sinh ra để dựng
        # payload WS, giống như push() đơn lẻ.
        await db.flush()
        await enqueue_push_jobs(db, notifications)

        from app.core.ws_manager import publish_many

        await publish_many(
            [
                (
                    f"notif:user:{notification.user_id}",
                    {
                        "id": notification.id,
                        "title": title,
                        "message": message,
                        "notification_type": ntype.value,
                        "link": link,
                        "related_entity_type": entity_type,
                        "related_entity_id": entity_id,
                        "created_at": (
                            notification.created_at.isoformat()
                            if notification.created_at
                            else None
                        ),
                    },
                )
                for notification in notifications
            ]
        )
        return notifications
    #  Danh sách
    async def list(
        self,
        user_id: int,
        *,
        unread_only: bool = False,
        page: int = 1,
        page_size: int = 20,
    ) -> NotificationListResponse:
        stmt = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            stmt = stmt.where(Notification.is_read.is_(False))
        stmt = stmt.order_by(Notification.created_at.desc())

        total = await self.db.scalar(
            select(func.count()).select_from(stmt.subquery())
        ) or 0

        unread_count = await self._unread_count(user_id)

        rows = (
            await self.db.execute(
                stmt.offset((page - 1) * page_size).limit(page_size)
            )
        ).scalars().all()

        total_pages = (total + page_size - 1) // page_size if total else 0
        return NotificationListResponse(
            items=[self._to_response(n) for n in rows],
            total=total,
            unread_count=unread_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    #  Số lượng chưa đọc (nhẹ, được gọi thường xuyên cho badge)
    async def unread_count(self, user_id: int) -> UnreadCountResponse:
        count = await self._unread_count(user_id)
        return UnreadCountResponse(unread_count=count)

    async def _unread_count(self, user_id: int) -> int:
        return int(
            await self.db.scalar(
                select(func.count()).where(
                    Notification.user_id == user_id,
                    Notification.is_read.is_(False),
                )
            )
            or 0
        )
    #  Đánh dấu một notification là đã đọc
    async def mark_read(self, notification_id: int, user_id: int) -> NotificationResponse:
        notification = await self.db.scalar(
            select(Notification).where(Notification.id == notification_id)
        )
        if notification is None:
            raise NotFoundException("Notification not found")
        if notification.user_id != user_id:
            raise ForbiddenException("Access denied")

        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.now(UTC)
            await self.db.flush()

        return self._to_response(notification)
    #  Đánh dấu tất cả là đã đọc
    async def mark_all_read(self, user_id: int) -> MarkReadResponse:
        now = datetime.now(UTC)
        result = await self.db.execute(
            update(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read.is_(False),
            )
            .values(is_read=True, read_at=now)
        )
        updated = result.rowcount
        return MarkReadResponse(updated=updated, unread_count=0)
    #  Xóa notification
    async def delete(self, notification_id: int, user_id: int) -> None:
        notification = await self.db.scalar(
            select(Notification).where(Notification.id == notification_id)
        )
        if notification is None:
            raise NotFoundException("Notification not found")
        if notification.user_id != user_id:
            raise ForbiddenException("Access denied")
        await self.db.delete(notification)
        await self.db.flush()
    #  Hàm hỗ trợ static: đẩy một notification (được gọi từ các service khác)
    @staticmethod
    async def push(
        db: AsyncSession,
        *,
        user_id: int,
        title: str,
        message: str,
        ntype: NotificationType,
        link: str | None = None,
        entity_type: str | None = None,
        entity_id: int | None = None,
    ) -> Notification:
        """Tạo, lưu và phát real-time một notification.

        Gọi flush ngay lập tức (cần thiết để lấy id/created_at do server sinh ra
        cho payload WS) — đây là thay đổi hành vi so với hợp đồng trước đây
        "chỉ add, caller tự flush", nhưng flush() chỉ gửi các câu SQL đang chờ
        mà không commit, nên an toàn khi gọi giữa transaction.
        """
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=ntype,
            link=link,
            related_entity_type=entity_type,
            related_entity_id=entity_id,
        )
        db.add(notification)
        await db.flush()
        await enqueue_push_jobs(db, [notification])

        from app.core.ws_manager import (
            publish,  # import cục bộ: tránh nạp hạ tầng ws mỗi lần load service
        )

        await publish(
            f"notif:user:{user_id}",
            {
                "id": notification.id,
                "title": title,
                "message": message,
                "notification_type": ntype.value,
                "link": link,
                "related_entity_type": entity_type,
                "related_entity_id": entity_id,
                "created_at": notification.created_at.isoformat() if notification.created_at else None,
            },
        )
        return notification
    #  Bộ chuyển đổi (serialiser)
    @staticmethod
    def _to_response(n: Notification) -> NotificationResponse:
        return NotificationResponse(
            id=n.id,
            title=n.title,
            message=n.message,
            notification_type=n.notification_type,
            is_read=n.is_read,
            read_at=n.read_at,
            link=n.link,
            related_entity_type=n.related_entity_type,
            related_entity_id=n.related_entity_id,
            created_at=n.created_at,
        )


# ── Khai báo dependency injection cho FastAPI ──────────────────────────────────────────────

async def get_notification_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> NotificationService:
    return NotificationService(db)


NotificationServiceDep = Annotated[NotificationService, Depends(get_notification_service)]
