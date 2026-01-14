# backend/app/core/sentry.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.asyncio import AsyncioIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from sentry_sdk.integrations.httpx import HttpxIntegration
import os
from contextlib import asynccontextmanager
from typing import Optional
import logging

logger = logging.getLogger(__name__)

def init_sentry():
    """Initialize Sentry SDK for error tracking."""
    sentry_dsn = os.getenv("SENTRY_DSN")
    
    if not sentry_dsn:
        logger.warning("SENTRY_DSN not set, Sentry disabled")
        return
    
    try:
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[
                FastApiIntegration(),
                StarletteIntegration(),
                SqlalchemyIntegration(),
                RedisIntegration(),
                CeleryIntegration(),
                AsyncioIntegration(),
                HttpxIntegration(),
            ],
            # Performance monitoring
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            
            # Session tracking
            auto_session_tracking=True,
            
            # Environment
            environment=os.getenv("ENVIRONMENT", "production"),
            release=os.getenv("VERSION", "1.0.0"),
            
            # Filter sensitive data
            send_default_pii=False,
            
            # Debug
            debug=os.getenv("SENTRY_DEBUG", "False").lower() == "true",
        )
        
        logger.info("Sentry initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Sentry: {e}")

def capture_exception(error: Exception, context: Optional[dict] = None):
    """Capture an exception with additional context."""
    try:
        with sentry_sdk.push_scope() as scope:
            if context:
                for key, value in context.items():
                    scope.set_extra(key, value)
            
            # Add user context if available
            # This would be set elsewhere in your application
            # scope.user = {"id": user_id, "email": user_email}
            
            sentry_sdk.capture_exception(error)
            
    except Exception as e:
        logger.error(f"Failed to capture exception in Sentry: {e}")

def capture_message(message: str, level: str = "info", context: Optional[dict] = None):
    """Capture a message with a specific level."""
    try:
        with sentry_sdk.push_scope() as scope:
            if context:
                for key, value in context.items():
                    scope.set_extra(key, value)
            
            sentry_sdk.capture_message(message, level=level)
            
    except Exception as e:
        logger.error(f"Failed to capture message in Sentry: {e}")

@asynccontextmanager
async def sentry_transaction(name: str, op: str = "default"):
    """Context manager for Sentry transactions."""
    transaction = sentry_sdk.start_transaction(name=name, op=op)
    
    try:
        yield transaction
        transaction.finish(status="ok")
    except Exception as e:
        transaction.finish(status="internal_error")
        capture_exception(e)
        raise

# Decorator for automatic error tracking
def track_errors(func):
    """Decorator to automatically track errors in functions."""
    async def async_wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            capture_exception(e, {
                "function": func.__name__,
                "args": str(args),
                "kwargs": str(kwargs)
            })
            raise
    
    def sync_wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            capture_exception(e, {
                "function": func.__name__,
                "args": str(args),
                "kwargs": str(kwargs)
            })
            raise
    
    return async_wrapper if hasattr(func, '__await__') else sync_wrapper