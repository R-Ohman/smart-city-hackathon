import { Component } from '@angular/core';
import { MapService } from '@features/service/map/map.service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-map-options',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './map-options.component.html',
  styleUrl: './map-options.component.scss'
})
export class MapOptionsComponent {
  mapOptions = [
    "Parks",
    "Noise",
  ]

  constructor(private mapService: MapService) {}

  onSelect(mapOptions: string[]) {
    this.mapService.showParks.set(mapOptions.includes("Parks"));
    this.mapService.showNoise.set(mapOptions.includes("Noise"));
  }
}
