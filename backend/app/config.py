"""Configuration settings for SAHAYAK AI backend."""
from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path

# Load .env from project root (sikshalokam_finals/.env)
# backend/app/config.py -> backend/app -> backend -> sikshalokam_finals
ENV_PATH = Path(__file__).parent.parent.parent / ".env"

class Settings(BaseSettings):
    """Application settings."""
    
    # API Keys
    gemini_api_key: str = ""
    mistral_api_key: str = ""
    youtube_api_key: str = ""
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # JWT
    jwt_secret: str = "sahayak-ai-secret-key-2024-finals"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 24
    
    # App
    app_name: str = "SAHAYAK AI"
    debug: bool = True
    
    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
