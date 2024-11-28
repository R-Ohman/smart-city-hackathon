from datetime import datetime
from fastapi import APIRouter

from .schemas import (
    AirParameter,
    AirParameters,
    AirQualityItem,
    AirQualityMeasurements,
    AirStationList,
    AirStation,
)
from .external_air_api import (
    get_air_quality_info,
    get_all_air_stations,
    get_station_sensors,
    get_sensor_parameters,
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
async def get_air_quality(station_id: int) -> AirQualityMeasurements:
    air_quality = await get_air_quality_info(station_id)

    measurements = []
    params = ["st", "so2", "no2", "pm10", "pm25", "o3"]
    date_format = "%Y-%m-%d %H:%M:%S"
    for param in params:
        if air_quality[param + "IndexLevel"] is not None:
            measurements.append(
                AirQualityItem(
                    levelName=param,
                    measurementDate=datetime.strptime(
                        air_quality[param + "SourceDataDate"], date_format
                    ),
                    calculationDate=datetime.strptime(
                        air_quality[param + "CalcDate"], date_format
                    ),
                    indexLevelName=air_quality[param + "IndexLevel"]["indexLevelName"],
                )
            )
    return AirQualityMeasurements(measurements=measurements)


@router.get("/parameters/{station_id}")
async def get_air_parameters_for_station(station_id: int) -> AirParameters:
    sensors = await get_station_sensors(station_id)

    all_parameters = []

    for sensor in sensors:
        parameters = await get_sensor_parameters(sensor["id"])
        i = 0
        while parameters["values"][i]["value"] is None:
            i += 1
        all_parameters.append(
            AirParameter(
                name=sensor["param"]["paramName"],
                value=parameters["values"][i]["value"],
                formula=sensor["param"]["paramFormula"],
                measurementDate=parameters["values"][i]["date"],
            )
        )

    return AirParameters(parameters=all_parameters)
