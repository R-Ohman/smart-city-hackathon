import { patchState, signalStore, withMethods } from "@ngrx/signals";
import { airConfig } from "./air.config";
import { setAllEntities, withEntities } from "@ngrx/signals/entities";
import { inject } from "@angular/core";
import { AirService } from "../../service/air/air.service";

export const AirStore = signalStore(
    { providedIn: 'root' },
    withEntities(airConfig),

    withMethods((store, airService = inject(AirService)) => ({
        async getAirStations() {
            if (!store.airStationsIds().length) {
                const airStations = await airService.loadAirStations();
                patchState(store, setAllEntities(airStations, airConfig))
            }
        }
    }))
);