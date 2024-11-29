import { AirStation } from "@features/models/air.model";
import * as Leaflet from 'leaflet';

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
  
  export function qualityLabelToColor(quality: string): string {
    let color = "";
    if (quality == "Bardzo dobry"){
        color = "#33cc33";
      }else if (quality == "Dobry"){
        color = "#99ff33"
      }else if (quality == "Umiarkowany"){
        color = "#ffff99";
      }else if (quality == "Dostateczny"){
        color = "#ffffcc";
      }else if (quality == "Zły"){
        color = "#ff9999";
      }else if (quality == "Bardzo zły"){
        color = "#ff0000";
      }
      return color;
  }

  export const colorConfig = {
    'Parks': {
      color: '#008f68',
      fillColor: '#6DB65B', 
    },
    'Noise': {
      color: '#yellow',
      fillColor: '#aba509', 
    }
  }