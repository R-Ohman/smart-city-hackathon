import { Routes } from '@angular/router';
import { MapComponent } from './features/map/map.component';
import { ConfigComponent } from '@features/config/config.component';

export const routes: Routes = [
    {
        path: 'config',
        component: ConfigComponent,
    },
    {
        path: '**',
        component: MapComponent,
    }
];
