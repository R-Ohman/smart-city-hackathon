export interface AirStation {
    id: number,
    stationName: string,
    gegrLat: string,
    gegrLon: string,
    city: {
    id: number,
    name: string,
    commune: {
        communeName: string,
        districtName: string,
        provinceName: string
    }
    },
    addressStreet: string,
    quality: string
}

export interface AirStationsDto {
    airStations: AirStation[];
}

export interface AirStationDetails {
    name: string,
    formula: string,
    value: number,
    measurementDate: string
}

export interface AirStationDetailsDto {
    parameters: AirStationDetails[];
}

export interface AirStationQuality {
    levelName: string,
    measurementDate: string,
    calculationDate: string,
    indexLevelName: string
}

export interface AirStationQualities {
    measurements: AirStationQuality[];
}