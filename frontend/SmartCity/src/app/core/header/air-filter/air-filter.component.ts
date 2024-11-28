import { Component, effect, model, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MapService } from '@features/service/map/map.service';

@Component({
  selector: 'app-air-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './air-filter.component.html',
  styleUrl: './air-filter.component.scss'
})
export class AirFilterComponent {
  options = [
    "Wszystko",
    "Bardzo dobry",
    "Dobry",
    "Umiarkowany",
    "Dostateczny",
    "Zły",
    "Bardzo zły"
  ]

  selectedOption = signal("Wszystko");

  constructor(private mapService: MapService) {}

  onNewOption(option: string) {
    this.selectedOption.set(option);
    this.mapService.airFilterOption.set(option);
  }
}
