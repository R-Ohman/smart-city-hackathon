from datetime import datetime

from pydantic import BaseModel
from typing import List


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
    airStations: List[AirStation]
    count: int


class Param(BaseModel):
    paramName: str
    paramFormula: str
    paramCode: str
    idParam: int


class AirStationSensor(BaseModel):
    id: int
    stationId: int
    param: Param


class AirStationSensorList(BaseModel):
    airStationSensors: List[AirStationSensor]
    count: int


class AirQualityItem(BaseModel):
    levelName: str
    measurementDate: datetime
    calculationDate: datetime
    indexLevelName: str


    class Config:
        json_encoders = {
            datetime: lambda dt: dt.strftime('%Y-%m-%d %H:%M:%S')
        }


class AirQualityMeasurements(BaseModel):
    measurements: List[AirQualityItem]
