from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/ai_assistant"
    
    # Redis for Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # API Keys (using environment variables for security)
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Model Configuration
    SMALL_MODEL: str = "gpt-4o-mini"  # Fast, cost-effective
    MEDIUM_MODEL: str = "gpt-4o"  # Balanced
    # the newest Anthropic model is "claude-sonnet-4-20250514" which was released in 2025
    LARGE_MODEL: str = "claude-sonnet-4-20250514"  # Most capable
    
    # App Settings
    APP_NAME: str = "AI Assistant"
    DEBUG: bool = True
    
    # CORS - allow all Replit domains
    ALLOWED_ORIGINS: str = "*"
    
    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse ALLOWED_ORIGINS string into list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # STM/LTM Configuration
    STM_CONVERSATION_LIMIT: int = 5  # Keep last 5 conversations in short-term memory
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
