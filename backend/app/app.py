from contextlib import asynccontextmanager
import os
from typing import Annotated
import redis.asyncio as aioredis
from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.settings import settings
from app.air.router import router as air_router
from app.geo_search.router import router as geo_router
from app.noise.router import router as noise_router
from app.geojson_maps.router import router as maps_router
from app.redis.redis_config import get_redis_client


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not os.path.isdir(settings.UPLOADED_MAPS_LOCATION):
        os.mkdir(settings.UPLOADED_MAPS_LOCATION)

    yield


app = FastAPI(lifespan=lifespan)

app.mount(
    "/static", StaticFiles(directory=settings.UPLOADED_MAPS_LOCATION), name="static"
)

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
app.include_router(noise_router, prefix="/api/noise", tags=["Noise API"])
app.include_router(maps_router, prefix="/api/maps", tags=["Maps in GeoJSON format"])


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
