from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379

    GEOCODE_API_KEY: str

    UPLOADED_MAPS_LOCATION: str = '/var/uploads/'
    
    @property
    def redis_url(self):
        return f'redis://{self.REDIS_HOST}:{self.REDIS_PORT}?decode_responses=True'


settings = Settings()
