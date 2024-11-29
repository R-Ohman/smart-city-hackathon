import os
from pathlib import Path
from typing import Annotated

import aiofiles
from app.settings import settings
from fastapi import APIRouter, HTTPException, UploadFile, status
from fastapi import Path as URLPath
from fastapi.responses import FileResponse, RedirectResponse

router = APIRouter()


@router.put("/upload/{map_name}", status_code=status.HTTP_204_NO_CONTENT)
async def upload_geojson_map(
    map_name: Annotated[str, URLPath(regex="[a-zA-Z0-9_]+")], map_file: UploadFile
):
    if not map_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong File Format"
        )

    if not map_file.filename.endswith(".geojson"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong File Format"
        )

    async with aiofiles.open(
        Path(settings.UPLOADED_MAPS_LOCATION) / (map_name + ".geojson"), "wb"
    ) as dst_file:
        await dst_file.write(await map_file.read())


@router.get("")
async def get_all_uploaded_geojson_maps():
    return [
        filename.split(".")[0]
        for filename in os.listdir(settings.UPLOADED_MAPS_LOCATION)
        if filename.endswith(".geojson")
    ]


@router.get("/{map_name}")
async def get_uploaded_map(map_name: str):
    file_location = Path(settings.UPLOADED_MAPS_LOCATION) / (map_name + ".geojson")
    if not os.path.isfile(file_location):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return RedirectResponse(f"/static/{map_name}.geojson")

@router.delete("/{map_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_uploaded_map(map_name: str):
    file_location = Path(settings.UPLOADED_MAPS_LOCATION) / (map_name + ".geojson")
    if os.path.isfile(file_location):
        os.remove(file_location)
     

