import { Injectable } from '@angular/core';
import { AirStation, AirStationDetails, AirStationDetailsDto, AirStationQualities, AirStationsDto } from '../../models/air.model';
import { firstValueFrom, switchMap, map } from 'rxjs';
import { ApiPath } from '../../enums/api.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AirService {

  constructor(
    private http: HttpClient,
  ) { }

  loadAirStations(): Promise<AirStation[]> {
      return firstValueFrom(
        this.http.get<AirStationsDto>(ApiPath.AirStations)
        .pipe(
          map((response) => this.responseToAirStations(response))
        )
      );
  }

  getStationDetails(stationId: number): Promise<AirStationDetailsDto> {
    return firstValueFrom(
      this.http.get<AirStationDetailsDto>(ApiPath.AirStationDetails + stationId)
      .pipe(
        map((response) => response)
      )
    );
  }

  getStationQualities(stationId: number): Promise<AirStationQualities> {
    return firstValueFrom(
      this.http.get<AirStationQualities>(ApiPath.AirStationQuality + stationId)
    );
  }

  private responseToAirStations(response: AirStationsDto): AirStation[] { 
      return response.airStations;
  }
}
