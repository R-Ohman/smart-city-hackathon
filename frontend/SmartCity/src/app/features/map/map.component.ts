import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { AirStore } from '../store/air/air.store';
import { AirStation } from '../models/air.model';
import { HeaderService } from '../../core/service/header/header.service';
import { AirService } from '../service/air/air.service';
import { ScaleComponent } from '../../core/scale/scale.component';
import { AreaDetailsComponent } from '@features/area-details/area-details.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, ScaleComponent, AreaDetailsComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  chosenStationId = signal(null as number|null);

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
    center: { lat: 54.377492, lng: 16.310728 }
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

  initMarkers() {
    const airStations = this.airStations();
    for (let index = 0; index < airStations.length; index++) {
      const data = airStations[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map);
      this.map.panTo({lat: +data.gegrLat, lng: +data.gegrLon});
      this.markers.push(marker)
    }

    setInterval(() =>
      // this.map.on('moveend',(e) => 
      {
        const current_markers =  this.getFeaturesInView();
        let undefinedQualities = 0;
        // for (let marker of current_markers){
        //   const id = marker.getData()?.id;
        //   if (id && !this.airStore.airStationsEntityMap()[id].quality) {
        //     undefinedQualities += 1;
        //   }
        // }
        // if (undefinedQualities <= 5){
          for (let marker of current_markers){
            
            const id = marker.getData()?.id;
            if (id && !this.airStore.airStationsEntityMap()[id].quality && undefinedQualities <= 10){
              undefinedQualities += 1;
              this.airService.getStationQualities(id)
                .then((stationQualities) => {
                  const quality = stationQualities.measurements[0].indexLevelName;
                  this.airStore.patchAirStation(id, {
                    quality: quality
                  }) 
                  if (quality == "Bardzo dobry"){
                    marker.circle?.setStyle({ color: "#33cc33"})
                  }else if (quality == "Dobry"){
                    marker.circle?.setStyle({ color: "#99ff33"})
                  }else if (quality == "Umiarkowany"){
                    marker.circle?.setStyle({ color: "#ffff99"})
                  }else if (quality == "Dostateczny"){
                    marker.circle?.setStyle({ color: "#ffffcc"})
                  }else if (quality == "Zły"){
                    marker.circle?.setStyle({ color: "#ff9999"})
                  }else if (quality == "Bardzo zły"){
                    marker.circle?.setStyle({ color: "#ff0000"})
                  }
                  marker.circle?.addTo(this.map);
                } 
              );
            }
          }
        // }
    // 
    }
    , 3000);
  }

  generateMarker(data: AirStation, index: number) {
    const marker = new DataMarker({lat: +data.gegrLat, lng: +data.gegrLon}, data);
    marker.circle = Leaflet.circle([+data.gegrLat, +data.gegrLon], 5000);
    marker.circle.setStyle({ color: 'green'});


    return marker.on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
    const nearest_station = this.getNearestStation($event.latlng.lat, $event.latlng.lng);
    this.chosenStationId.set(nearest_station.id);
    this.map.flyTo({lat: +nearest_station.gegrLat, lng: +nearest_station.gegrLon}, 15, { duration: 1.5 });

    const stationDetails = this.airService.getStationDetails(nearest_station.id).then((stationDetails) => {
      let marker = this.markers.filter(
        (marker) => marker.getLatLng().lat == +nearest_station.gegrLat 
        && marker.getLatLng().lng == +nearest_station.gegrLon)[0];
      marker.bindPopup(nearest_station.stationName).openPopup();
      marker.getPopup()!.on('remove', () => {
        this.chosenStationId.set(null);
      });
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

  getFeaturesInView() {
    let clusters: DataMarker[] = []
     this.map.eachLayer((l) => {
          if( l instanceof DataMarker && this.map.getBounds().contains(l.getLatLng()) )
               clusters.push(l)
     })
     return clusters;
  }
}


export class DataMarker extends Leaflet.Marker {
  data: AirStation | undefined;

  circle: Leaflet.Circle | undefined;

  constructor(latLng: L.LatLngExpression, data: AirStation, options?: L.MarkerOptions) {
    super(latLng, options);
    this.setData(data);
  }

  getData() {
    return this.data;
  }

  setData(data: AirStation) {
    this.data = data;
  }
}