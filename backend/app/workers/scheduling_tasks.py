"""Tính lại đường găng ngoài request, có gộp trùng.

`recalculate_project` là thao tác toàn dự án: nạp mọi task và mọi dependency, chạy
CPM, rồi ghi lại sáu cột trên từng dòng. Chi phí tăng theo kích thước dự án, nhưng
những thao tác kích hoạt nó — đổi tên một task, kéo một thẻ sang cột khác — thì
không. Với dự án vài nghìn task, một lần kéo thả kéo theo hàng nghìn lệnh UPDATE
trong khi người dùng đang chờ.

Trên ngưỡng cấu hình được, việc tính lại chuyển sang đây. Các yêu cầu được gộp qua
một khoá Redis: chỉnh sửa liên tiếp trên cùng một dự án chỉ tạo ra một lần tính,
vì chỉ kết quả cuối cùng mới có ý nghĩa.
"""
import asyncio
import logging

from app.db.session import AsyncSessionLocal
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

PENDING_KEY_PREFIX = "cpm:pending:"
# Cửa sổ gộp. Đủ dài để một loạt chỉnh sửa chỉ tốn một lần tính, đủ ngắn để một
# worker chết không khiến dự án bị kẹt trạng thái "đã lên lịch" quá lâu.
PENDING_TTL_SECONDS = 120


def _pending_key(project_id: int) -> str:
    return f"{PENDING_KEY_PREFIX}{project_id}"


async def schedule_recalculation(project_id: int) -> bool:
    """Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ.

    Trả về True nếu lần này thực sự được xếp hàng. Nếu không đặt được khoá gộp
    (Redis gián đoạn) thì vẫn xếp hàng: thà tính thừa còn hơn để dữ liệu lịch trình
    cũ nằm im.
    """
    from app.core.redis_client import get_redis

    try:
        claimed = await get_redis().set(
            _pending_key(project_id), "1", ex=PENDING_TTL_SECONDS, nx=True
        )
        if not claimed:
            return False
    except Exception:
        logger.warning(
            "CPM debounce lookup failed for project_id=%s; enqueueing anyway",
            project_id,
            exc_info=True,
        )

    recalculate_project_task.delay(project_id)
    return True


@celery_app.task(
    bind=True,
    name="scheduling.recalculate_project",
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def recalculate_project_task(self, project_id: int) -> dict:
    """Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất."""
    return asyncio.run(_recalculate_with_own_session(project_id))


async def _recalculate_with_own_session(project_id: int) -> dict:
    from app.core.redis_client import get_redis
    from app.services.scheduling_service import recalculate_project

    try:
        async with AsyncSessionLocal() as db:
            # force_sync: đã ở trong worker rồi, đẩy tiếp sang worker nữa là vòng lặp.
            await recalculate_project(db, project_id, force_sync=True)
            await db.commit()
    finally:
        # Nhả khoá gộp dù thành hay bại, để lần chỉnh sửa kế tiếp xếp hàng được.
        try:
            await get_redis().delete(_pending_key(project_id))
        except Exception:
            logger.warning(
                "failed to clear CPM debounce key for project_id=%s", project_id, exc_info=True
            )
    return {"project_id": project_id, "status": "recalculated"}
