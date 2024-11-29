from httpx import AsyncClient


async def get_noise_level(lat: float, lon: float):
    async with AsyncClient() as client:
        r = await client.get(
            f"https://noise-map.com/noise.php?batch=1576396593&lat={lat}&lng={lon}"
        )
        return r.json()
