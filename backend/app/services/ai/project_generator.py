"""SOP-AI-001: AI Project Generator"""
from typing import Any, Dict
from app.core.config import settings


async def get_ai_provider():
    if settings.ACTIVE_AI_PROVIDER == "gemini":
        from app.services.ai.gemini_provider import GeminiProvider
        return GeminiProvider()
    from app.services.ai.openai_provider import OpenAIProvider
    return OpenAIProvider()


SYSTEM_PROMPT = '''You are an expert project manager. Generate a detailed project plan in JSON format.
The JSON must include: name, description, phases (list), tasks per phase with estimated_hours, dependencies.'''


async def generate_project_from_prompt(prompt: str) -> Dict[str, Any]:
    """Generate a full project structure from a natural language prompt."""
    provider = await get_ai_provider()
    result = await provider.generate_json(prompt, SYSTEM_PROMPT)
    return result
