import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ApiPath } from '@features/enums/api.enum';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  geoFile?: File;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const formData = new FormData();
    formData.append('map_file', this.geoFile!, this.geoFile!.name);
    this.http.put(ApiPath.MapsUpload + this.geoFile!.name, formData).subscribe();
    this.router.navigateByUrl('/');
  }

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.geoFile = file;
      this.onSubmit();
    }
  }
}
