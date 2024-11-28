from typing import Annotated
from fastapi import APIRouter, Depends
from redis.asyncio import Redis

from app.air.air_service import AirService
from app.air.deps import get_air_service
from app.redis.redis_config import get_redis_client

from .schemas import (
    AirParameters,
    AirQualityMeasurements,
    AirStationList,
    AirStation,
)
from .external_air_api import (
    get_all_air_stations,
)

router = APIRouter()


@router.get("/stations")
async def get_all_air_measurement_stations() -> AirStationList:
    stations = await get_all_air_stations()

    response_obj = AirStationList(
        airStations=[AirStation.model_validate(station) for station in stations],
        count=len(stations),
    )

    return response_obj


@router.get("/quality/{station_id}")
async def get_air_quality(
    station_id: int, air_service: Annotated[AirService, Depends(get_air_service)]
) -> AirQualityMeasurements:
    measurements = await air_service.get_air_quality_for_station(station_id)

    return AirQualityMeasurements(measurements=measurements)


@router.get("/parameters/{station_id}")
async def get_air_parameters_for_station(
    station_id: int, air_service: Annotated[AirService, Depends(get_air_service)],
    redis: Annotated[Redis, Depends(get_redis_client)]
) -> AirParameters:
    return AirParameters(
        parameters=await air_service.get_air_parameters_for_station(station_id, redis)
    )
