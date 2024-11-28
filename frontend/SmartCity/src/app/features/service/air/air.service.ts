import { Injectable } from '@angular/core';
import { AirStation, AirStationsDto } from '../../models/air.model';
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


  private responseToAirStations(response: AirStationsDto): AirStation[] { 
      return response.airStations;
  }
}
