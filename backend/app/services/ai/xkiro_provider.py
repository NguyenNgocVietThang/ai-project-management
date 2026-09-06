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
        )

    async def generate_text(
        self,
        prompt: str,
        system_prompt: str = "",
        task: AITaskType = AITaskType.CHAT_QUICK,
    ) -> str:
        model = resolve_model(task)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message.content

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str = "",
        task: AITaskType = AITaskType.CHAT_QUICK,
    ) -> dict[str, Any]:
        text = await self.generate_text(prompt, system_prompt, task=task)
        return parse_json_object(text)
