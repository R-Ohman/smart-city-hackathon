from httpx import AsyncClient

BASE_AIR_API_URL = "https://api.gios.gov.pl"


async def get_all_air_stations() -> list[dict]:
    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/station/findAll")
        data = r.json()
        return data


async def get_all_sensors_info(station_id: int) -> dict:
    async with AsyncClient() as client:
        r = await client.get(
            BASE_AIR_API_URL + f"/pjp-api/rest/station/sensors/{station_id}"
        )
        data = r.json()
        return data


async def get_air_quality_info(station_id: int) -> dict:
    async with AsyncClient() as client:
        r = await client.get(
            BASE_AIR_API_URL + f"/pjp-api/rest/aqindex/getIndex/{station_id}"
        )
        data = r.json()
        return data
