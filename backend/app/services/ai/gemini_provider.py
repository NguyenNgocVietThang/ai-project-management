from typing import Any, Dict
import google.generativeai as genai
from app.core.config import settings
from app.services.ai.base import BaseAIProvider


class GeminiProvider(BaseAIProvider):
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    async def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        response = await self.model.generate_content_async(full_prompt)
        return response.text

    async def generate_json(self, prompt: str, system_prompt: str = "") -> Dict[str, Any]:
        import json
        text = await self.generate_text(prompt, system_prompt)
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
