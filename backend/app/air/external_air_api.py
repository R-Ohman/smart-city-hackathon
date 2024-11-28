from httpx import AsyncClient

BASE_AIR_API_URL = "https://api.gios.gov.pl"


async def get_all_air_stations() -> list[dict]:
    async with AsyncClient() as client:
        r = await client.get(BASE_AIR_API_URL + "/pjp-api/rest/station/findAll")
        return r.json()


async def get_station_sensors(station_id: int) -> dict:
    async with AsyncClient() as client:
        r = await client.get(
            BASE_AIR_API_URL + f"/pjp-api/rest/station/sensors/{station_id}"
        )
        return r.json()


async def get_sensor_parameters(sensor_id: int) -> dict:
    async with AsyncClient() as client:
        r = await client.get(
            f"https://api.gios.gov.pl/pjp-api/rest/data/getData/{sensor_id}"
        )
        return r.json()


async def get_air_quality_info(station_id: int) -> dict:
    async with AsyncClient() as client:
        r = await client.get(
            BASE_AIR_API_URL + f"/pjp-api/rest/aqindex/getIndex/{station_id}"
        )
        return r.json()
