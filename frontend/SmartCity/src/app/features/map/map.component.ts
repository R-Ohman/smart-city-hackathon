import { Component, inject, OnInit, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { AirStore } from '../store/air/air.store';
import { AirStation } from '../models/air.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  private readonly airStore = inject(AirStore);

  private airStations = this.airStore.airStationsEntities;

  protected isAirLoading = signal(true);

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 12,
    center: { lat: 28.626137, lng: 79.821603 }
  }

  public ngOnInit(): void {
    this.airStore.getAirStations()
    .then(() => this.initMarkers());
  }

  // private marker = Leaflet.icon({
  //   iconUrl: 'assets/map-marker.svg',
  //   shadowUrl: 'assets/map-marker.svg',

  //   iconSize:     [38, 95], // size of the icon
  //   shadowSize:   [50, 64], // size of the shadow
  //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //   shadowAnchor: [4, 62],  // the same for the shadow
  //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  // });

  initMarkers() {
    const airStations = this.airStations();
    for (let index = 0; index < airStations.length; index++) {
      const data = airStations[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>vitalii</b>`);
      this.map.panTo({lat: +data.gegrLat, lng: +data.gegrLon});
      this.markers.push(marker)
    }
  }

  generateMarker(data: AirStation, index: number) {
    return Leaflet.marker({lat: +data.gegrLat, lng: +data.gegrLon}, { draggable: false/*, icon: this.marker*/ })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
}
