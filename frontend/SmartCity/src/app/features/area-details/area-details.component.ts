import { Component, effect, input, OnInit, signal } from '@angular/core';
import { AirStationDetails } from '@features/models/air.model';
import { AirService } from '@features/service/air/air.service';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-area-details',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './area-details.component.html',
  styleUrl: './area-details.component.scss'
})
export class AreaDetailsComponent {
  stationId = input.required<number>();
  stationDetails = signal([] as AirStationDetails[]);

  displayedColumns: string[] = ['name', 'formula', 'value', 'measurementDate'];

  constructor(private airService: AirService) {
    effect(() => {
      // hide previous details until new details are loaded
      this.stationDetails.set([]);
      this.airService.getStationDetails(this.stationId()).then((details) => this.stationDetails.set(details))
      },
      {
        allowSignalWrites: true,
      }
    )
  }
}
