from collections.abc import AsyncGenerator
from typing import Any
import redis.asyncio as aioredis
from app.settings import settings

async def get_redis_client() -> AsyncGenerator[aioredis.Redis, Any]:
    client = await aioredis.from_url(settings.redis_url)
    yield client
    await client.aclose()
