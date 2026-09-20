
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Giá trị placeholder được ship làm mặc định để một bản clone mới có thể khởi động ở môi trường development.
# Bị từ chối khi chạy ngoài development bởi Settings._reject_insecure_defaults bên dưới.
INSECURE_SECRET_KEY = "your-super-secret-key-change-in-production"
MIN_SECRET_KEY_LENGTH = 32


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # Ứng dụng
    APP_NAME: str = "AI Project Management API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    # Dùng chung cho lịch Celery Beat và `today` của các bản quét (xem app/workers/).
    APP_TIMEZONE: str = "Asia/Ho_Chi_Minh"
    MAX_DAILY_WORK_HOURS: float = 8.0
    # Trên ngưỡng này, tính lại đường găng được đẩy sang Celery vì chi phí tăng theo kích
    # thước dự án; dưới ngưỡng chạy đồng bộ để UI nhất quán ngay.
    CPM_SYNC_TASK_THRESHOLD: int = 300
    API_V1_PREFIX: str = "/api/v1"
    # Host cho TrustedHostMiddleware. "*" chỉ dùng cho development; production phải đặt
    # hostname thật để chặn Host-header poisoning.
    ALLOWED_HOSTS: list[str] = ["*"]
    # Chỉ bật khi chạy sau reverse proxy có ghi đè X-Forwarded-For, nếu không ai cũng giả
    # mạo được IP trong audit log.
    TRUST_PROXY_HEADERS: bool = False
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    # Cơ sở dữ liệu
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_project_management"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    SECRET_KEY: str = INSECURE_SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MinIO (S3-compatible)
    MINIO_ENDPOINT: str = "127.0.0.1:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "ai-project-files"
    MINIO_USE_SSL: bool = False

    # xKiro: cổng AI tương thích OpenAI. Mỗi task AI dùng model riêng, xem
    # app/services/ai/model_router.py.
    XKIRO_API_KEY: str = ""
    XKIRO_BASE_URL: str = "https://api.xkiro.com/v1"
    XKIRO_MODEL_PROJECT_GENERATION: str = "deepseek/deepseek-v4-pro"
    XKIRO_MODEL_DOCUMENT_PARSING: str = "qwen/qwen3-vl-plus:free"
    XKIRO_MODEL_IMPACT_ANALYSIS: str = "deepseek/deepseek-v4-flash"
    XKIRO_MODEL_SCHEDULE_OPTIMIZATION: str = "qwen/qwen3.7-max:free"
    XKIRO_MODEL_RESOURCE_RECOMMENDATION: str = "mistralai/mistral-medium-3.5"
    XKIRO_MODEL_RISK_ANALYSIS: str = "mistralai/mistral-large-2512"
    XKIRO_MODEL_CHAT_QUICK: str = "deepseek/deepseek-chat-v3.1"

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@projectmanagement.com"
    EMAIL_FROM_NAME: str = "AI Project Management"
    SMTP_STARTTLS: bool = True
    SMTP_SSL_TLS: bool = False
    SMTP_USE_CREDENTIALS: bool = True
    SMTP_VALIDATE_CERTS: bool = True

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Ứng dụng Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    # Đăng nhập mạng xã hội (OAuth 2.0)
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/oauth/google/callback"

    FACEBOOK_APP_ID: str = ""
    FACEBOOK_APP_SECRET: str = ""
    FACEBOOK_REDIRECT_URI: str = "http://localhost:8000/api/v1/oauth/facebook/callback"

    @model_validator(mode="after")
    def _reject_insecure_defaults(self) -> "Settings":
        """Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret placeholder được ship sẵn.

        SECRET_KEY ký mọi JWT *và* cả HMAC của `state` trong OAuth, nên một bản triển khai
        quên đặt nó thì có thể bị giả mạo dễ dàng. Thất bại ngay tại thời điểm import là
        cách đáng tin cậy duy nhất để bắt lỗi này — không có thành phần nào phía sau phát hiện được.
        """
        if self.APP_ENV == "development":
            return self

        problems: list[str] = []
        if not self.SECRET_KEY or self.SECRET_KEY == INSECURE_SECRET_KEY:
            problems.append("SECRET_KEY is unset or still the shipped placeholder")
        elif len(self.SECRET_KEY) < MIN_SECRET_KEY_LENGTH:
            problems.append(
                f"SECRET_KEY must be at least {MIN_SECRET_KEY_LENGTH} characters"
            )
        if self.MINIO_ACCESS_KEY == "minioadmin" or self.MINIO_SECRET_KEY == "minioadmin":
            problems.append("MINIO_ACCESS_KEY/MINIO_SECRET_KEY are still the defaults")

        # Ba mục dưới có mặc định dùng được cho development nên quên đặt vẫn khởi động bình
        # thường, vì vậy kiểm tra tường minh.
        if "*" in self.ALLOWED_HOSTS:
            problems.append(
                "ALLOWED_HOSTS still accepts any Host header; list the real hostnames "
                "so cache and proxy keys cannot be poisoned"
            )
        local_origins = [
            origin
            for origin in self.CORS_ORIGINS
            if "localhost" in origin or "127.0.0.1" in origin
        ]
        if local_origins:
            problems.append(
                f"CORS_ORIGINS still contains development origins: {local_origins}"
            )
        if "*" in self.CORS_ORIGINS:
            problems.append("CORS_ORIGINS must not be a wildcard when credentials are allowed")
        if not self.FRONTEND_URL.startswith("https://"):
            problems.append(
                "FRONTEND_URL must be https — password reset and email verification "
                "links are built from it"
            )

        if problems:
            raise ValueError(
                f"Insecure configuration for APP_ENV={self.APP_ENV!r}: "
                + "; ".join(problems)
                + ". Set these via the environment or backend/.env before starting."
            )
        return self


settings = Settings()
