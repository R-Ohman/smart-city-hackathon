from fastapi import APIRouter

router = APIRouter()


@router.get("/stations")
def get_all_air_measurement_stations():
    return []
