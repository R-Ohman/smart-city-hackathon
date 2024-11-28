import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;

  constructor() { }
}
