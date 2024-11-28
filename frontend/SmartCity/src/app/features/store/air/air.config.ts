import { entityConfig } from '@ngrx/signals/entities';
import { AirStation } from '../../models/air.model';
import { type } from '@ngrx/signals';

export const airConfig = entityConfig({
    entity: type<AirStation>(),
    collection: 'airStations',
    selectId: (airStation) => airStation.id,
})
