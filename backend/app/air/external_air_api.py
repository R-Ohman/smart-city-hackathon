from httpx import AsyncClient

BASE_AIR_API_URL = "https://api.gios.gov.pl"

async def get_all_air_stations() -> list[dict]:

    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/station/findAll")
        data = r.json()
        return data
