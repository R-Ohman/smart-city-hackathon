from fastapi import APIRouter, HTTPException, status

from app.geo_search.geo_api import get_locations_from_text
from app.geo_search.schemas import Coordinates


router = APIRouter()


@router.get("/coordinates")
async def get_location_by_description(text: str = "") -> Coordinates:
    if len(text) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Too short text"
        )

    locations = await get_locations_from_text(text)

    if len(locations) < 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return Coordinates(latitude=locations[0]["lat"], longitude=locations[0]["lon"])
