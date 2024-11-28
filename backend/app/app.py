from typing import Annotated
import redis.asyncio as aioredis
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.air.router import router as air_router
from app.geo_search.router import router as geo_router
from app.redis.redis_config import get_redis_client

app = FastAPI()


origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(air_router, prefix="/api/air", tags=["Air API"])
app.include_router(geo_router, prefix="/api/geo", tags=["Geo search"])


@app.get("/health-check")
def health_check():
    return {"status": "ok hi"}


@app.get("/health-check/redis")
async def health_check_redis(
    redis: Annotated[aioredis.Redis, Depends(get_redis_client)],
):
    try:
        await redis.ping()
        return {"status": "redis is ok"}
    except Exception:
        return {"status": "redis is down"}
