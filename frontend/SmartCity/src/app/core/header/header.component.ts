import { Component } from '@angular/core';
import { SearchComponent } from "./search/search.component";
import { AirFilterComponent } from "./air-filter/air-filter.component";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MapService } from '@features/service/map/map.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent, AirFilterComponent, MatSlideToggleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private mapService: MapService) {}

  onToggleParks() {
    this.mapService.showParks.update((v) => !v);
  }
}
