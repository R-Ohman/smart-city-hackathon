import json
from datetime import datetime
from typing import List

from redis.asyncio import Redis
from app.air.external_air_api import (
    get_air_quality_info,
    get_sensor_parameters,
    get_station_sensors,
)
from app.air.schemas import AirParameter, AirQualityItem


class AirService:
    def __init__(self):
        pass

    async def get_air_quality_for_station(
        self, station_id: int
    ) -> List[AirQualityItem]:
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
                        indexLevelName=air_quality[param + "IndexLevel"][
                            "indexLevelName"
                        ],
                    )
                )
        return measurements

    async def get_air_parameters_for_station(
            self, station_id: int, redis: Redis
    ) -> List[AirParameter]:

        cached = await redis.get(f"station:{station_id}:param")

        if cached is not None:
            print(cached)
            return [AirParameter.model_validate_json(param) for param in json.loads(cached)]

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
        
        now = datetime.now()
        ex = (60 - now.minute) * 60  # expire after ex seconds
        await redis.set(f"station:{station_id}:param", json.dumps([param.model_dump_json() for param in all_parameters]), ex=ex)

        return all_parameters
