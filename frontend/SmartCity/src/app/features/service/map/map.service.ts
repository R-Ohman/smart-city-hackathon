import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ApiPath } from '@features/enums/api.enum';
import { DataMarker } from '@features/map/map.util';
import * as Leaflet from 'leaflet';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;

  airFilterOption = signal('');

  mapShow = signal(new Map() as Map<string, boolean>);

  mapsList = signal([] as string[]);

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
  }
}
