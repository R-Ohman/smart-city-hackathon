import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { GreenFilterDialogComponent } from '../green-filter-dialog/green-filter-dialog.component'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MapService } from '@features/service/map/map.service';

@Component({
  selector: 'app-park-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './park-filter.component.html',
  styleUrl: './park-filter.component.scss'
})
export class ParkFilterComponent {
  readonly radius = signal(0);
  readonly greenPercentage = signal(0);
  readonly dialog = inject(MatDialog);

  constructor(private mapService: MapService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(GreenFilterDialogComponent, {
      data: {radius: null, greenPercentage: null},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.radius.set(result[0]);
        this.greenPercentage.set(result[1]);
        this.mapService.greenAreasConfig.set({
          radius: this.radius(),
          greenPercentage: this.greenPercentage()
        })
      }
    });
  }
}
