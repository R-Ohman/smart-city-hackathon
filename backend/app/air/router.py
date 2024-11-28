from datetime import datetime
from fastapi import APIRouter

from .schemas import AirQualityItem, AirQualityMeasurements, AirStationList, AirStation, AirStationSensorList, AirStationSensor
from .external_air_api import get_air_quality_info, get_all_air_stations, get_all_sensors_info

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
async def get_air_quality(station_id: int) -> AirQualityMeasurements:
    
    air_quality = await get_air_quality_info(station_id)

    measurements = []
    params = ['st', 'so2', 'no2', 'pm10', 'pm25', 'o3']
    date_format = '%Y-%m-%d %H:%M:%S'
    for param in params:
        if air_quality[param + 'IndexLevel'] is not None:
            
            measurements.append(AirQualityItem(
                levelName=param,
                measurementDate=datetime.strptime(air_quality[param + 'SourceDataDate'], date_format),
                calculationDate=datetime.strptime(air_quality[param + 'CalcDate'], date_format),
                indexLevelName=air_quality[param + 'IndexLevel']['indexLevelName']
            ))
    return AirQualityMeasurements(measurements=measurements) 
