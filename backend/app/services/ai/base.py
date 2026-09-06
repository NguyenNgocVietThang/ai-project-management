from abc import ABC, abstractmethod
from typing import Any


class BaseAIProvider(ABC):
    """Lớp cơ sở trừu tượng cho các AI provider."""

    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        pass

    @abstractmethod
    async def generate_json(self, prompt: str, system_prompt: str = "") -> dict[str, Any]:
        pass
