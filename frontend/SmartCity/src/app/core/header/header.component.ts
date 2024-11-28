import { Component } from '@angular/core';
import { SearchComponent } from "./search/search.component";
import { AirFilterComponent } from "./air-filter/air-filter.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent, AirFilterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
