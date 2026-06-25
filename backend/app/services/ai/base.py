from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseAIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        pass

    @abstractmethod
    async def generate_json(self, prompt: str, system_prompt: str = "") -> Dict[str, Any]:
        pass
