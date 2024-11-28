import { computed, Injectable, signal } from '@angular/core';
import { DataMarker } from '@features/map/map.component';
import * as Leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;

  airFilterOption = signal('');

  constructor() { }
}
