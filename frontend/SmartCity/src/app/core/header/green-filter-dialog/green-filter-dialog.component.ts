import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
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

export interface DialogData {
  radius: number;
  greenPercentage: number;
}

@Component({
  selector: 'app-green-filter-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './green-filter-dialog.component.html',
  styleUrl: './green-filter-dialog.component.scss'
})
export class GreenFilterDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GreenFilterDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly radius = model(this.data.radius);
  readonly greenPercentage = model(this.data.greenPercentage);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
