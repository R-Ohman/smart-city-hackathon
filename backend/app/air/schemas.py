from datetime import datetime
from typing import List

from pydantic import BaseModel


class CustomBaseModel(BaseModel):
    class Config:
        json_encoders = {datetime: lambda dt: dt.strftime("%Y-%m-%d %H:%M:%S")}


class Commune(BaseModel):
    communeName: str
    districtName: str
    provinceName: str


class City(BaseModel):
    id: int
    name: str
    commune: Commune


class Param(BaseModel):
    paramName: str
    paramFormula: str
    paramCode: str
    idParam: int


class AirQualityItem(CustomBaseModel):
    levelName: str
    measurementDate: datetime
    calculationDate: datetime
    indexLevelName: str


class AirQualityMeasurements(BaseModel):
    measurements: List[AirQualityItem]


class AirStation(BaseModel):
    id: int
    stationName: str
    gegrLat: str
    gegrLon: str
    city: City
    addressStreet: str | None


class AirStationList(BaseModel):
    airStations: List[AirStation]
    count: int


class AirParameter(CustomBaseModel):
    name: str
    formula: str
    value: float
    measurementDate: datetime


class AirParameters(BaseModel):
    parameters: List[AirParameter]
