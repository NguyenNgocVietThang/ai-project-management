from typing import Any, Dict
from openai import AsyncOpenAI
from app.core.config import settings
from app.services.ai.base import BaseAIProvider


class OpenAIProvider(BaseAIProvider):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL

    async def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message.content

    async def generate_json(self, prompt: str, system_prompt: str = "") -> Dict[str, Any]:
        import json
        text = await self.generate_text(prompt, system_prompt)
        # Extract JSON from response
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
