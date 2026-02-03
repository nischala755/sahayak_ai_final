"""Redis caching service with TTL management."""
import redis
import json
import hashlib
from typing import Optional, Any
from ..config import get_settings

settings = get_settings()

# Redis connection
try:
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    REDIS_AVAILABLE = redis_client.ping()
except:
    redis_client = None
    REDIS_AVAILABLE = False


def get_cache_key(context: dict) -> str:
    """Generate cache key from context."""
    key_parts = [
        str(context.get("grade", "")),
        context.get("subject", "").lower(),
        context.get("topic", "").lower()[:50],
        context.get("language", "hi")
    ]
    raw_key = ":".join(key_parts)
    return f"sahayak:sos:{hashlib.md5(raw_key.encode()).hexdigest()[:12]}"


def get_problem_cache_key(problem_text: str) -> str:
    """Generate cache key from problem text."""
    normalized = problem_text.lower().strip()[:100]
    return f"sahayak:problem:{hashlib.md5(normalized.encode()).hexdigest()[:12]}"


async def get_cached_response(cache_key: str) -> Optional[dict]:
    """Get cached response if available."""
    if not REDIS_AVAILABLE:
        return None
    
    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"Cache get error: {e}")
    
    return None


async def set_cached_response(cache_key: str, response: dict, ttl: int = 3600):
    """Cache a response with TTL."""
    if not REDIS_AVAILABLE:
        return False
    
    try:
        redis_client.setex(cache_key, ttl, json.dumps(response, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"Cache set error: {e}")
        return False


async def increment_usage(cache_key: str):
    """Increment usage count for a cached solution."""
    if not REDIS_AVAILABLE:
        return
    
    try:
        usage_key = f"{cache_key}:usage"
        redis_client.incr(usage_key)
    except Exception as e:
        print(f"Usage increment error: {e}")


async def get_popular_problems(limit: int = 10) -> list:
    """Get most frequently accessed problems."""
    if not REDIS_AVAILABLE:
        return []
    
    try:
        # Get all usage keys
        keys = redis_client.keys("sahayak:*:usage")
        usage_data = []
        for key in keys[:limit]:
            count = redis_client.get(key)
            if count:
                base_key = key.replace(":usage", "")
                cached = redis_client.get(base_key)
                if cached:
                    usage_data.append({
                        "key": base_key,
                        "count": int(count),
                        "data": json.loads(cached)
                    })
        return sorted(usage_data, key=lambda x: x["count"], reverse=True)
    except Exception as e:
        print(f"Popular problems error: {e}")
        return []


def is_cache_available() -> bool:
    """Check if Redis is available."""
    return REDIS_AVAILABLE
