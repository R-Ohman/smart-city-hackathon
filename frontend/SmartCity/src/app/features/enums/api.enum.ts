const baseUrl = 'http://localhost:5052/api/';

export enum ApiPath {
    AirStations = baseUrl + 'air/stations',
    GeoByText = baseUrl + 'geo/coordinates',
    AirStationDetails = baseUrl + 'air/parameters/',
    AirStationQuality = baseUrl + 'air/quality/',
    Maps = baseUrl + 'maps',
    GreenAreas = baseUrl + 'green', // TODO: adjust
    MapsUpload = baseUrl + 'maps/upload/',
}