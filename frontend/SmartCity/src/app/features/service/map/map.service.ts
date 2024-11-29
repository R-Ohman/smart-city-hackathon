import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { DialogData } from '@core/header/green-filter-dialog/green-filter-dialog.component';
import { ApiPath } from '@features/enums/api.enum';
import { DataMarker } from '@features/map/map.util';
import { GeoLocation } from '@features/models/map.model';
import * as Leaflet from 'leaflet';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;

  airFilterOption = signal('');

  mapShow = signal(new Map() as Map<string, boolean>);

  mapsList = signal([] as string[]);

  greenAreasConfig = signal(null as DialogData|null);

  greenAreasCircles = signal([] as GeoLocation[]);

  constructor(private http: HttpClient) {
    this.http.get<string[]>(ApiPath.Maps)
      .pipe(
        tap((response) => {
          this.mapsList.set(response);

          let mapCopy = new Map(this.mapShow());
          for (let map of response) {
            mapCopy.set(map, false);
          }
          this.mapShow.set(mapCopy);
        })
      ).subscribe();

      effect(() => {
        let conf = this.greenAreasConfig();
        if (!conf) return;
        this.http.get<GeoLocation[]>(ApiPath.GreenAreas, { params: {
            radius: conf.radius,
            percentage: conf.greenPercentage
          } 
        })
        .subscribe();
      });
  }
}
