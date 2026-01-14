# backend/app/core/logging_config.py
import logging
import logging.config
import json
from pythonjsonlogger import jsonlogger
from datetime import datetime
from typing import Dict, Any
import sys
import os

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super().add_fields(log_record, record, message_dict)
        
        # Add custom fields
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        log_record['module'] = record.module
        log_record['function'] = record.funcName
        log_record['line'] = record.lineno
        
        # Add thread information
        log_record['thread'] = record.thread
        log_record['thread_name'] = record.threadName
        
        # Add process information
        log_record['process'] = record.process
        log_record['process_name'] = record.processName
        
        # Remove unwanted fields
        if 'msg' in log_record:
            log_record['message'] = log_record.pop('msg')
        if 'args' in log_record:
            del log_record['args']
        if 'exc_info' in log_record:
            del log_record['exc_info']

def setup_logging():
    """Setup comprehensive logging configuration for production."""
    
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    log_format = os.getenv('LOG_FORMAT', 'json')
    
    # Logging configuration
    config = {
        'version': 1,
        'disable_existing_loggers': False,
        
        'formatters': {
            'json': {
                '()': CustomJsonFormatter,
                'format': '%(timestamp)s %(level)s %(name)s %(module)s %(funcName)s %(message)s',
            },
            'verbose': {
                'format': '%(asctime)s [%(levelname)s] [%(name)s:%(lineno)d] %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S',
            },
            'simple': {
                'format': '%(asctime)s [%(levelname)s] %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S',
            },
        },
        
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': log_level,
                'formatter': log_format if log_format in ['json', 'verbose', 'simple'] else 'json',
                'stream': sys.stdout,
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'INFO',
                'formatter': 'json',
                'filename': os.getenv('LOG_FILE', '/var/log/futureskills/app.log'),
                'maxBytes': 10485760,  # 10MB
                'backupCount': 10,
                'encoding': 'utf8',
            },
            'error_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'ERROR',
                'formatter': 'json',
                'filename': os.getenv('ERROR_LOG_FILE', '/var/log/futureskills/error.log'),
                'maxBytes': 10485760,  # 10MB
                'backupCount': 10,
                'encoding': 'utf8',
            },
            'access_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'INFO',
                'formatter': 'json',
                'filename': os.getenv('ACCESS_LOG_FILE', '/var/log/futureskills/access.log'),
                'maxBytes': 10485760,  # 10MB
                'backupCount': 10,
                'encoding': 'utf8',
            },
        },
        
        'loggers': {
            '': {  # Root logger
                'handlers': ['console', 'file', 'error_file'],
                'level': log_level,
                'propagate': False,
            },
            'uvicorn': {
                'handlers': ['console', 'file'],
                'level': 'INFO',
                'propagate': False,
            },
            'uvicorn.access': {
                'handlers': ['access_file'],
                'level': 'INFO',
                'propagate': False,
            },
            'uvicorn.error': {
                'handlers': ['console', 'error_file'],
                'level': 'INFO',
                'propagate': False,
            },
            'sqlalchemy.engine': {
                'handlers': ['console'],
                'level': 'WARNING',
                'propagate': False,
            },
            'aioredis': {
                'handlers': ['console'],
                'level': 'WARNING',
                'propagate': False,
            },
            'celery': {
                'handlers': ['console', 'file'],
                'level': 'INFO',
                'propagate': False,
            },
        },
    }
    
    logging.config.dictConfig(config)
    
    # Capture warnings
    logging.captureWarnings(True)
    
    return logging.getLogger(__name__)

class StructuredLogger:
    """Logger that supports structured logging with context."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.context = {}
    
    def add_context(self, **kwargs):
        """Add context to all subsequent log messages."""
        self.context.update(kwargs)
        return self
    
    def clear_context(self):
        """Clear all context."""
        self.context.clear()
        return self
    
    def _log_with_context(self, level: int, msg: str, extra: Dict[str, Any] = None, **kwargs):
        """Log a message with context."""
        if extra is None:
            extra = {}
        
        # Merge context and extra
        full_extra = {**self.context, **extra, **kwargs}
        
        # Log with extra context
        self.logger.log(level, msg, extra=full_extra)
    
    def debug(self, msg: str, **kwargs):
        self._log_with_context(logging.DEBUG, msg, **kwargs)
    
    def info(self, msg: str, **kwargs):
        self._log_with_context(logging.INFO, msg, **kwargs)
    
    def warning(self, msg: str, **kwargs):
        self._log_with_context(logging.WARNING, msg, **kwargs)
    
    def error(self, msg: str, **kwargs):
        self._log_with_context(logging.ERROR, msg, **kwargs)
    
    def critical(self, msg: str, **kwargs):
        self._log_with_context(logging.CRITICAL, msg, **kwargs)
    
    def exception(self, msg: str, exc_info=True, **kwargs):
        """Log an exception with context."""
        full_extra = {**self.context, **kwargs}
        self.logger.exception(msg, exc_info=exc_info, extra=full_extra)

# Global logger instance
logger = StructuredLogger(__name__)