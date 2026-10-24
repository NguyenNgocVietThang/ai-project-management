from pydantic import BaseModel


class AppConfigResponse(BaseModel):
    """Cấu hình công khai cho app di động, gọi trước khi đăng nhập."""
    min_supported_version: str
    latest_version: str
    maintenance: bool
    maintenance_message: str | None = None
