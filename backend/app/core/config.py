from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator, model_validator
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings with Supabase integration."""
    
    # Application
    APP_NAME: str = "OnaAseyori"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database - Supabase PostgreSQL
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:54322/postgres"
    
    # Supabase Configuration
    SUPABASE_URL: str = "https://jpnonlszlqvcdvqdorab.supabase.co"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # MongoDB Configuration (for Goals system)
    MONGODB_URI: str = "mongodb+srv://careernig24:<db_password>@cluster0.c4h1ona.mongodb.net/?appName=Cluster0"
    MONGODB_DB_NAME: str = "futureskills"
    MONGODB_PASSWORD: Optional[str] = None  # Set in .env
    
    # Redis (optional - for caching)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 300
    
    # Child-safety rollout switches: interactive communication and code runners
    # must remain disabled until vetted supervision and a sandbox are deployed.
    CHILD_INTERACTIVE_FEATURES_ENABLED: bool = False
    CODE_EXECUTION_ENABLED: bool = False
    NON_AVATAR_UPLOADS_ENABLED: bool = False
    MENTOR_ONBOARDING_ENABLED: bool = False
    MENTOR_MATCHING_ENABLED: bool = False
    MENTORSHIP_SCHEDULING_ENABLED: bool = False

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    @model_validator(mode="after")
    def validate_production_security(self):
        if self.ENVIRONMENT.lower() == "production":
            if self.SECRET_KEY == "your-secret-key-change-in-production" or len(self.SECRET_KEY) < 32:
                raise ValueError("Production SECRET_KEY must be a strong unique value of at least 32 characters")
            if self.DEBUG:
                raise ValueError("DEBUG must be disabled in production")
            if self.DEV_LOG_EMAILS:
                raise ValueError("DEV_LOG_EMAILS must be disabled in production")
            if not self.EMAILS_ENABLED or not all(
                (self.SMTP_HOST, self.SMTP_USER, self.SMTP_PASSWORD, self.EMAIL_FROM)
            ):
                raise ValueError("Production signup requires a configured transactional email service")
            if not self.FRONTEND_URL.startswith("https://"):
                raise ValueError("FRONTEND_URL must use HTTPS in production")
            if not self.CORS_ORIGINS or "*" in self.CORS_ORIGINS:
                raise ValueError("Production CORS_ORIGINS must explicitly name trusted origins")
        return self

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("["):
                import json
                return json.loads(v)
            return [i.strip() for i in v.split(",")]
        return v
    
    # File Uploads
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: Optional[str] = "jpg,jpeg,png,gif,pdf,doc,docx"
    
    def get_allowed_extensions(self) -> List[str]:
        """Get allowed extensions as a list."""
        if isinstance(self.ALLOWED_EXTENSIONS, str):
            return [ext.strip() for ext in self.ALLOWED_EXTENSIONS.split(",")]
        return self.ALLOWED_EXTENSIONS or []
    
    # Gamification
    INITIAL_XP: int = 100
    XP_PER_MODULE: int = 50
    XP_PER_SESSION: int = 100
    XP_PER_BADGE: int = 200
    LEVEL_THRESHOLDS: List[int] = [100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000]
    
    # Email (SMTP)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: Optional[str] = None
    EMAIL_FROM_NAME: Optional[str] = "OnaAseyori"
    
    # Frontend URL for email links
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Email control flags
    EMAILS_ENABLED: bool = False  # Set to True when SMTP is configured
    DEV_LOG_EMAILS: bool = True   # Log email content to console in development
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 3600
    
    # AWS S3 (optional - for file storage fallback)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: Optional[str] = None
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()