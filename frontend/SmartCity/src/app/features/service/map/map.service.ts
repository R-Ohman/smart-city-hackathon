import { computed, Injectable, signal } from '@angular/core';
import { DataMarker } from '@features/map/map.util';
import * as Leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;

  airFilterOption = signal('');

  showParks = signal(false);

  showNoise = signal(false);

  constructor() { }
}
