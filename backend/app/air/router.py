from fastapi import APIRouter

from .schemas import AirStationList, AirStation
from .external_air_api import get_all_air_stations

router = APIRouter()


@router.get("/stations")
async def get_all_air_measurement_stations() -> AirStationList:
    stations = await get_all_air_stations()

    response_obj = AirStationList(
        airStations=[AirStation.model_validate(station) for station in stations],
        count=len(stations),
    )

    return response_obj
