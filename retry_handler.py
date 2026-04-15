# retry_handler.py
# Place in: C:\Users\YourName\AI_Employee_Project\retry_handler.py
# Used by: all Gold watchers — import and use @with_retry decorator

import time
import logging
import functools

logger = logging.getLogger(__name__)

class TransientError(Exception):
    """Raised for errors that are safe to retry: network timeouts, rate limits."""
    pass

class AuthenticationError(Exception):
    """Raised for auth failures — do NOT retry, alert human immediately."""
    pass

def with_retry(max_attempts=3, base_delay=1, max_delay=60):
    """
    Exponential backoff retry decorator.
    Constitution: base 1s, max 60s, 3 attempts.
    Only retries TransientError — not AuthenticationError or other exceptions.

    Usage:
        @with_retry(max_attempts=3, base_delay=1, max_delay=60)
        def call_facebook_api(payload):
            ...
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except TransientError as e:
                    if attempt == max_attempts - 1:
                        logger.error(f'{func.__name__} failed after {max_attempts} attempts: {e}')
                        raise
                    delay = min(base_delay * (2 ** attempt), max_delay)
                    logger.warning(
                        f'{func.__name__} attempt {attempt + 1}/{max_attempts} failed. '
                        f'Retrying in {delay}s. Error: {e}'
                    )
                    time.sleep(delay)
                except AuthenticationError as e:
                    # Do NOT retry — log and raise immediately
                    logger.critical(f'{func.__name__} AUTH ERROR — human must fix: {e}')
                    raise
        return wrapper
    return decorator


def classify_http_error(status_code, message=''):
    """
    Helper: classify HTTP errors into Transient vs Authentication vs other.
    Call this inside your watcher's except block.
    """
    if status_code in (429, 503, 502, 504):
        raise TransientError(f'HTTP {status_code}: {message}')
    elif status_code in (401, 403):
        raise AuthenticationError(f'HTTP {status_code}: {message}')
    else:
        raise Exception(f'HTTP {status_code}: {message}')