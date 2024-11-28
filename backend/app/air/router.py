from fastapi import APIRouter

from .schemas import AirStationList, AirStation, AirStationSensorList, AirStationSensor, AirQualityMeasurements
from .external_air_api import get_all_air_stations, get_all_sensors_info, get_air_quality_info

router = APIRouter()


@router.get("/stations")
async def get_all_air_measurement_stations() -> AirStationList:
    stations = await get_all_air_stations()

    response_obj = AirStationList(
        airStations=[AirStation.model_validate(station) for station in stations],
        count=len(stations),
    )

    return response_obj

@router.get("/sensors")
async def get_all_stations_sensors_info() -> AirStationSensorList:
    sensors = await get_all_sensors_info()

    response_obj = AirStationSensorList(
        airStationsSensors = [AirStationSensor.model_validate(sensor) for sensor in sensors],
        count = len(sensors)
    )

    return response_obj
