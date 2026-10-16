"""Schema cổng nhà đầu tư (Phase 5, 5.3)."""
from datetime import datetime

from pydantic import BaseModel, EmailStr


class InvestorGrantCreate(BaseModel):
    email: EmailStr


class InvestorGrantResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    granted_at: datetime
    granted_by_id: int | None
