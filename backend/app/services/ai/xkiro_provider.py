from typing import Any

from openai import AsyncOpenAI

from app.core.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.model_router import AITaskType, resolve_model
from app.services.ai.parsing import parse_json_object


class XkiroProvider(BaseAIProvider):
    """Provider gọi xKiro — cổng AI tương thích OpenAI, gộp nhiều model miễn phí
    (DeepSeek, Mistral, GLM, ...) sau 1 API key duy nhất.

    Không có 1 model mặc định cố định: mỗi lời gọi chọn model theo `task`
    (xem app/services/ai/model_router.py) để việc phức tạp dùng model mạnh
    hơn, việc đơn giản/nhanh dùng model độ trễ thấp hơn.
    """

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.XKIRO_API_KEY,
            base_url=settings.XKIRO_BASE_URL,
            max_retries=0,
            timeout=settings.AI_HTTP_TIMEOUT_SECONDS,
        )

    async def generate_text(
        self,
        prompt: str,
        system_prompt: str = "",
        task: AITaskType = AITaskType.CHAT_QUICK,
    ) -> str:
        try:
            return await self._generate_text(prompt, system_prompt, task)
        finally:
            # Providers are constructed per job: release sockets on every outcome.
            await self.client.close()

    async def _generate_text(self, prompt: str, system_prompt: str, task: AITaskType) -> str:
        model = resolve_model(task)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        from openai import APIConnectionError, APIStatusError, APITimeoutError

        from app.core.job_runner import AmbiguousJobError, PermanentJobError, RetryableJobError
        from app.services.ai.job_context import active_ai_context, reserve_ai_call

        context = active_ai_context.get()
        if context is not None and context.job.staged_result is not None:
            return context.job.staged_result["text"]
        if not settings.XKIRO_API_KEY:
            raise PermanentJobError("provider_rejected")
        if context is not None:
            await context.mark_dispatched(before_dispatch=reserve_ai_call)
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=settings.AI_MAX_OUTPUT_TOKENS,
            )
        except (APIConnectionError, APITimeoutError) as exc:
            raise AmbiguousJobError() from exc
        except APIStatusError as exc:
            # 429 is a rejected call; no output to charge/replay. 5xx can be ambiguous.
            if exc.status_code < 500:
                if context is not None:
                    async with context.session_factory() as db, db.begin():
                        from app.services.job_service import JobService
                        owned = await JobService.lock_owned(db, context.job_id, context.lease_token)
                        owned.request_dispatched = False
                    context.job.request_dispatched = False
                if exc.status_code == 429:
                    raise RetryableJobError("provider_error") from exc
                raise PermanentJobError("provider_rejected") from exc
            if exc.status_code >= 500:
                raise AmbiguousJobError() from exc
            raise PermanentJobError("provider_rejected") from exc
        content = response.choices[0].message.content
        if not isinstance(content, str) or len(content) > 200_000:
            raise PermanentJobError("invalid_provider_response")
        if context is not None:
            await context.stage_result({"text": content})
        return content

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str = "",
        task: AITaskType = AITaskType.CHAT_QUICK,
    ) -> dict[str, Any]:
        text = await self.generate_text(prompt, system_prompt, task=task)
        return parse_json_object(text)
