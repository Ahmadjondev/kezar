"""Application configuration loaded from environment variables."""

from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Global application settings.

    Args:
        database_url: Async SQLAlchemy database URL.
        secret_key: JWT signing key.
        admin_username: Default admin username.
        admin_password: Default admin password.
        cors_origins: Allowed CORS origins.
        upload_dir: Directory for uploaded files.
        access_token_expire_minutes: JWT token lifetime.
    """

    database_url: str = "sqlite+aiosqlite:///./kezar.db"
    secret_key: str = "change-me"
    admin_username: str = "kezar_admin"
    admin_password: str = "Kezar2026"
    cors_origins: list[str] = ["http://localhost:3000"]
    upload_dir: str = "uploads"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# Ensure upload directory exists
UPLOAD_PATH = Path(settings.upload_dir)
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
