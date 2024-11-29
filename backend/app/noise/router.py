from fastapi import APIRouter

from app.noise.noise_api import get_noise_level

router = APIRouter()


@router.get("/current/{lat}/{lon}")
async def get_noise_pollution_in_coordinates(lat: float, lon: float):
    return await get_noise_level(lat, lon)
