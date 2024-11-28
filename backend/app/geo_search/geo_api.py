import os

from httpx import AsyncClient


GEOCODE_API_KEY = os.environ.get("GEOCODE_API_KEY")


if GEOCODE_API_KEY is None:
    raise Exception('geocode api key is not provided')


async def get_locations_from_text(text: str):
    async with AsyncClient() as client:
        r = await client.get(f'https://geocode.maps.co/search?q={text}&api_key={GEOCODE_API_KEY}')
        return r.json()

