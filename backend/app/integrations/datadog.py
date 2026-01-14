# backend/app/integrations/datadog.py
from datadog import initialize, statsd
from datadog import ThreadStats
from datadog.api.constants import CheckStatus
import time
from functools import wraps
from app.core.config import settings

def init_datadog():
    options = {
        'api_key': settings.DATADOG_API_KEY,
        'app_key': settings.DATADOG_APP_KEY,
        'statsd_host': 'localhost',
        'statsd_port': 8125
    }
    
    initialize(**options)
    
    # Start ThreadStats for custom metrics
    thread_stats = ThreadStats()
    thread_stats.start()
    
    return thread_stats

# Custom metrics decorator
def track_metric(metric_name):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                
                # Send timing metric
                statsd.histogram(
                    f"futureskills.{metric_name}.duration",
                    duration,
                    tags=[f"endpoint:{func.__name__}"]
                )
                
                # Send success count
                statsd.increment(
                    f"futureskills.{metric_name}.success",
                    tags=[f"endpoint:{func.__name__}"]
                )
                
                return result
            except Exception as e:
                # Send error count
                statsd.increment(
                    f"futureskills.{metric_name}.error",
                    tags=[f"endpoint:{func.__name__}", f"error:{type(e).__name__}"]
                )
                raise
        
        return wrapper
    return decorator

# Health check for Datadog
def datadog_health_check():
    try:
        statsd.increment("futureskills.health_check")
        return CheckStatus.OK, "Service is healthy"
    except Exception as e:
        return CheckStatus.CRITICAL, str(e)