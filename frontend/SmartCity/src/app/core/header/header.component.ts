import { Component } from '@angular/core';
import { SearchComponent } from "./search/search.component";
import { AirFilterComponent } from "./air-filter/air-filter.component";
import { MapOptionsComponent } from './map-options/map-options.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent, AirFilterComponent, MapOptionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor() {}
}
