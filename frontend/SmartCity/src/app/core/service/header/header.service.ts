import { effect, Injectable, signal } from '@angular/core';
import { ApiPath } from '@enums/api.enum';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { GeoLocation } from '@models/map.model';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  searchQuery = signal('');

  geoLocationBySearch = signal([] as number[]);

  constructor(private http: HttpClient) {
    effect(() => {
      let searchQuery = this.searchQuery();
      if (!searchQuery) return;
      this.http.get<GeoLocation>(ApiPath.GeoByText, { params: { text: searchQuery } })
      .pipe(
        tap((response) => {
          this.geoLocationBySearch.set([response.latitude, response.longitude]);
        })
      ).subscribe();
    })
  }
}
