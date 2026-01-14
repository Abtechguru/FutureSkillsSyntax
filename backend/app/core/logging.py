# backend/app/core/logging.py
import logging
import sys
from loguru import logger
import json
from datetime import datetime

class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Get corresponding Loguru level
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        
        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1
        
        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def setup_logging():
    # Intercept standard logging
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    
    # Remove default handler
    logger.remove()
    
    # Add structured JSON logging for production
    logger.add(
        sys.stdout,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        level="INFO",
        serialize=True  # Output as JSON
    )
    
    # Add file logging
    logger.add(
        "logs/app_{time:YYYY-MM-DD}.log",
        rotation="00:00",  # Rotate at midnight
        retention="30 days",
        compression="zip",
        level="INFO",
        serialize=True
    )
    
    # Add error logging
    logger.add(
        "logs/error_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="90 days",
        level="ERROR",
        serialize=True
    )

# Custom logger with context
class ContextLogger:
    def __init__(self):
        self.logger = logger
    
    def info(self, message: str, **kwargs):
        self.logger.info(message, **kwargs)
    
    def error(self, message: str, **kwargs):
        self.logger.error(message, **kwargs)
    
    def with_context(self, **context):
        """Add context to all subsequent log messages"""
        return logger.bind(**context)

# Initialize logging
setup_logging()
log = ContextLogger()