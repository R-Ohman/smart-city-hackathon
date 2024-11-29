import { Component, inject, signal } from '@angular/core';
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
  private mapService = inject(MapService);

  mapOptions = this.mapService.mapsList;

  onSelect(mapOptions: string[]) {
    let mapCopy = new Map(this.mapService.mapShow());
    this.mapService.mapShow().forEach((_, key) => {
      mapCopy.set(key, mapOptions.includes(key));
    })
    this.mapService.mapShow.set(mapCopy);
  }
}
