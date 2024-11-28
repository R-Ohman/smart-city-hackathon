from httpx import AsyncClient

BASE_AIR_API_URL = "https://api.gios.gov.pl"

async def get_all_air_stations() -> list[dict]:

    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/station/findAll")
        data = r.json()
        return data

async def get_all_sensors_info(station_id) -> list[dict]:

    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/station/sensors/" + f"{station_id}")
        data = r.json()
        return data


async def get_air_quality_info(station_id) -> list[dict]:

    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/s/aqindex/getIndex/" + f"{station_id}")
        data = r.json()
        return data
