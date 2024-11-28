import os
from pathlib import Path
import aiofiles
from fastapi import APIRouter, HTTPException, UploadFile, status

from app.settings import settings


router = APIRouter()


@router.put("/upload/{map_name}", status_code=status.HTTP_204_NO_CONTENT)
async def upload_geojson_map(
    map_name: str,
    map_file: UploadFile
):
    if not map_file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong File Format")

    if not map_file.filename.endswith('.geojson'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong File Format")
    
    
    async with aiofiles.open(Path(settings.UPLOADED_MAPS_LOCATION) / (map_name + ".geojson"), 'wb') as dst_file:
        await dst_file.write(await map_file.read())


@router.get('')
async def get_all_uploaded_geojson_maps():
    return [filename.split('.')[0] for filename in os.listdir(settings.UPLOADED_MAPS_LOCATION) if filename.endswith('.geojson')]
