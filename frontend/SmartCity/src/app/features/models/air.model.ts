export interface AirStation {
    name: string;
    latitude: number;
    longitude: number;
    measurements: {
        
    } 
}

export interface AirStationsDto {
    stations: AirStation[];
}