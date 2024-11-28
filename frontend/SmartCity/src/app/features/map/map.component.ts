import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { AirStore } from '../store/air/air.store';
import { AirStation } from '../models/air.model';
import { HeaderService } from '../../core/service/header/header.service';
import { AirService } from '../service/air/air.service';

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

  private readonly airService = inject(AirService);

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

  constructor(private headerService: HeaderService) {
    effect(() => {
      let [lat, lng] = headerService.geoLocationBySearch();
      if (lat && lng)
        this.map.flyTo({lat, lng}, 15);
    })
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
      marker.addTo(this.map);
      this.map.panTo({lat: +data.gegrLat, lng: +data.gegrLon});
      this.markers.push(marker)
    }
  }

  generateMarker(data: AirStation, index: number) {
    return Leaflet.marker({lat: +data.gegrLat, lng: +data.gegrLon}, {
      icon: Leaflet.icon({
        iconUrl: 'wind_station.png',
        iconSize:     [38, 95],
        })
      })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
    const nearest_station = this.getNearestStation($event.latlng.lat, $event.latlng.lng);
    this.map.flyTo({lat: +nearest_station.gegrLat, lng: +nearest_station.gegrLon}, 15);

    const stationDetails = this.airService.getStationDetails(nearest_station.id).then((stationDetails) => {
      this.markers.filter((marker) => marker.getLatLng().lat == +nearest_station.gegrLat 
      && marker.getLatLng().lng == +nearest_station.gegrLon)[0].bindPopup(nearest_station.stationName).openPopup()
    }
    );
  }

  getNearestStation(latitude: number, longtitude: number): AirStation {
    const stations = this.airStations();

    const distance = (x0: number, y0: number, x1: number, y1: number) => Math.hypot(x1 - x0, y1 - y0);

    let nearest_station = {
      station: stations[Math.floor(Math.random() * stations.length)],
      distance: 100000000
    }
    for (let current_station of stations){
      const current_distance = distance(latitude, longtitude, +current_station.gegrLat, +current_station.gegrLon);
      if (current_distance < nearest_station.distance){
        nearest_station = {
          distance: current_distance,
          station: current_station
        }
      }
    }
    return nearest_station.station;
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
}
