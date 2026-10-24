from typing import Literal

from pydantic import BaseModel, Field


class DeviceRegisterRequest(BaseModel):
    token: str = Field(..., min_length=20, max_length=512, pattern=r"^[A-Za-z0-9_:\-\.]+$")
    platform: Literal["android", "ios"] = "android"
    app_version: str | None = Field(default=None, max_length=32)
    locale: Literal["vi", "en"] = "vi"


class DeviceResponse(BaseModel):
    id: int
    platform: str
    app_version: str | None
    locale: str

    model_config = {"from_attributes": True}
