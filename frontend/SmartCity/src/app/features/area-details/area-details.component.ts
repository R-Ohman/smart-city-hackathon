import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { AirStationDetails } from '@features/models/air.model';
import { AirService } from '@features/service/air/air.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-area-details',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './area-details.component.html',
  styleUrl: './area-details.component.scss'
})
export class AreaDetailsComponent {
  stationId = input.required<number>();
  stationDetails = signal([] as AirStationDetails[]);

  close = output<boolean>();

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

  onClose() {
    this.close.emit(true);
  }
}
