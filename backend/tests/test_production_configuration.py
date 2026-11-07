"""Production settings must fail closed before accepting user traffic."""
import pytest
from pydantic import ValidationError

from app.core.config import Settings


SAFE_SETTINGS = {
    "ENVIRONMENT": "production",
    "SECRET_KEY": "production-test-key-only-" + ("a" * 40),
    "DATABASE_URL": "postgresql+asyncpg://user:password@database.example.com/future",
    "FRONTEND_URL": "https://example.com",
    "CORS_ORIGINS": ["https://example.com"],
    "DEBUG": False,
    "DEV_LOG_EMAILS": False,
    "EMAILS_ENABLED": True,
    "SMTP_HOST": "smtp.example.com",
    "SMTP_USER": "smtp-account",
    "SMTP_PASSWORD": "not-a-real-password",
    "EMAIL_FROM": "noreply@example.com",
}


def test_explicit_production_configuration_is_accepted():
    settings = Settings(_env_file=None, **SAFE_SETTINGS)
    assert settings.ENVIRONMENT == "production"


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("SECRET_KEY", "weak"),
        ("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:54322/postgres"),
        ("FRONTEND_URL", "http://localhost:5173"),
        ("CORS_ORIGINS", ["http://localhost:5173"]),
        ("CORS_ORIGINS", ["*"]),
        ("DEV_LOG_EMAILS", True),
        ("EMAILS_ENABLED", False),
        ("SMTP_PASSWORD", ""),
    ],
)
def test_unsafe_production_setting_is_rejected(field, value):
    with pytest.raises((ValidationError, ValueError)):
        Settings(_env_file=None, **{**SAFE_SETTINGS, field: value})
