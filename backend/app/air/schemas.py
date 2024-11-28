from pydantic import BaseModel


class Commune(BaseModel):
    communeName: str 
    districtName: str
    provinceName: str


class City(BaseModel):

    id: int
    name: str
    commune: Commune


class AirStation(BaseModel):
    
    id: int
    stationName: str
    gegrLat: str
    gegrLon: str
    city: City
    addressStreet: str | None


class AirStationList(BaseModel):

    airStations: list[AirStation]
    count: int
