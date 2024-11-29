import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { AirStore } from '../store/air/air.store';
import { AirStation } from '../models/air.model';
import { HeaderService } from '../../core/service/header/header.service';
import { AirService } from '../service/air/air.service';
import { ScaleComponent } from '../../core/scale/scale.component';
import { AreaDetailsComponent } from '@features/area-details/area-details.component';
import { MapService } from '@features/service/map/map.service';
import { HttpClient } from '@angular/common/http';
import 'leaflet.heat/dist/leaflet-heat.js'

declare const HeatmapOverlay: any;

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

  private readonly httpClient = inject(HttpClient);

  private mapService = inject(MapService);

  private heatData: any = {
    data: [
    ]
  }

  private heatLayerConfig = {
    "radius": 0.5,
    "maxOpacity": .2,
    "scaleRadius": true,
    
    // property below is responsible for colorization of heat layer
    "useLocalExtrema": false,
    // here we need to assign property value which represent lat in our data
    latField: 'lat',
    // here we need to assign property value which represent lng in our data
    lngField: 'lng',
    // here we need to assign property value which represent valueField in our data
    valueField: 'value'
  };


  protected readonly qualityLabelFilter = this.mapService.airFilterOption;

  private heatmapLayer = new HeatmapOverlay(this.heatLayerConfig);

  map: Leaflet.Map = this.mapService.map;

  markers: DataMarker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 12,
    center: { lat: 54.35, lng: 18.65 }
  }

  constructor(private headerService: HeaderService) {
    effect(() => {
      let [lat, lng] = headerService.geoLocationBySearch();
      if (lat && lng)
        this.map.flyTo({lat, lng}, 15);
    })
    
    effect(() => {
      let qualityFilter = this.qualityLabelFilter();
      console.log('filtering marjers', qualityFilter);
      if (qualityFilter !== "" && qualityFilter !== "Wszystko") {
        for (let marker of this.markers) {
            // undefined -> continue
            if (!marker.measurementLabel) continue;
            console.log(marker.measurementLabel);
            if (marker.measurementLabel !== qualityFilter) {
              this.map.removeLayer(marker);
            } else {
              marker.addTo(this.map);
            }
        }
      } else {
        // add all layers
        for (let marker of this.markers) {
          if (!this.map.hasLayer(marker)) {
            marker.addTo(this.map);
          }
      }
      }
    })
  }

  public ngOnInit(): void {
    this.airStore.getAirStations()
      .then(() => this.initMarkers());
    this.loadGeojson();

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
      {
        const current_markers =  this.getFeaturesInView();
        let undefinedQualities = 0;
          for (let marker of current_markers){
            
            const id = marker.getData()?.id;
            if (id && !this.airStore.airStationsEntityMap()[id].quality //&& undefinedQualities <= 10
          ){
              undefinedQualities += 1;
              this.airService.getStationQualities(id)
                .then((stationQualities) => {
                  const quality = stationQualities.measurements[0].indexLevelName;
                  this.airStore.patchAirStation(id, {
                    quality: quality
                  }) 
                  marker.setMeasurementLabel(quality);
                  if (quality == "Bardzo dobry"){
                    marker.setStyle({ color: "#33cc33"})
                  }else if (quality == "Dobry"){
                    marker.setStyle({ color: "#99ff33"})
                  }else if (quality == "Umiarkowany"){
                    marker.setStyle({ color: "#ffff99"})
                  }else if (quality == "Dostateczny"){
                    marker.setStyle({ color: "#ffffcc"})
                  }else if (quality == "Zły"){
                    marker.setStyle({ color: "#ff9999"})
                  }else if (quality == "Bardzo zły"){
                    marker.setStyle({ color: "#ff0000"})
                  }
                  marker.addTo(this.map);
                  let filter = this.qualityLabelFilter();
                  if (filter !== '' && filter !== 'Wszystko' && marker.measurementLabel !== filter) {
                    this.map.removeLayer(marker);
                  }
                  this.addHeatValue(marker, quality);
                } 
              );
            }
          }
    }
    , 3000);
  }

  private addHeatValue(marker: any, quality: String){
    let value = 0;
    if (quality == "Bardzo dobry"){
      value = 1;
    }else if (quality == "Dobry"){
      value = 1;
    }else if (quality == "Umiarkowany"){
      value = 140;
    }else if (quality == "Dostateczny"){
      value = 0.3;
    }else if (quality == "Zły"){
      value = 0.4;
    }else if (quality == "Bardzo zły"){
      value = 0.5;
    }
    console.log({ lat: marker.getData().gegrLat, lng: marker.getData().gegrLon, value });
    this.heatData.data.push({ lat: marker.getData().gegrLat, lng: marker.getData().gegrLon, value: value });
    this.heatmapLayer.setData(this.heatData);
  }


  private loadGeojson(){

    let geojson: any = null;
    this.httpClient.get("/assets/greean_areas_with_coords.geojson").subscribe((data) => {
      geojson = data;

      // const stateLayer = Leaflet.geoJSON(geojson, {
      //   style: (feature) => ({
      //     weight: 3,
      //     opacity: 0.5,
      //     color: '#008f68',
      //     fillOpacity: 0.8,
      //     fillColor: '#6DB65B'
      //   })
      // });
  
      // this.map.addLayer(stateLayer);

      
  })
}


  generateMarker(data: AirStation, index: number): DataMarker {
    const marker = new DataMarker({lat: +data.gegrLat, lng: +data.gegrLon}, data, { radius: 20 });
    marker.setStyle({ color: "#8c98ab"}) // light grey
 

    return marker.on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
    
    this.heatmapLayer.setData(this.heatData);
    this.heatmapLayer.addTo(this.map);
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
    const nearest_station = this.getNearestStation($event.latlng.lat, $event.latlng.lng);
    this.chosenStationId.set(nearest_station.id);
    this.map.flyTo({lat: +nearest_station.gegrLat, lng: +nearest_station.gegrLon}, 15, { duration: 1.5 });

      let marker = this.markers.filter(
        (marker) => marker.getLatLng().lat == +nearest_station.gegrLat 
        && marker.getLatLng().lng == +nearest_station.gegrLon)[0];
      marker.bindPopup(nearest_station.stationName).openPopup();
      marker.getPopup()!.on('remove', () => {
        this.chosenStationId.set(null);
      });
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
    this.mapClicked($event);
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

export class DataMarker extends Leaflet.CircleMarker {
  data: AirStation | undefined;
  measurementLabel: string | undefined;

  constructor(latLng: L.LatLngExpression, data: AirStation, options: L.CircleMarkerOptions) {
    super(latLng, options);
    this.setData(data);
  }

  getData() {
    return this.data;
  }

  setData(data: AirStation) {
    this.data = data;
  }

  setMeasurementLabel(measurementLabel: string) {
    this.measurementLabel = measurementLabel;
  }
}