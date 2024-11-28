import { patchState, signalStore, withMethods } from "@ngrx/signals";
import { airConfig } from "./air.config";
import { setAllEntities, updateEntity, withEntities } from "@ngrx/signals/entities";
import { inject } from "@angular/core";
import { AirService } from "../../service/air/air.service";
import { AirStation } from "../../models/air.model";

export const AirStore = signalStore(
    { providedIn: 'root' },
    withEntities(airConfig),

    withMethods((store, airService = inject(AirService)) => ({
        async getAirStations() {
            if (!store.airStationsIds().length) {
                const airStations = await airService.loadAirStations();
                patchState(store, setAllEntities(airStations, airConfig))
            }
        },

        patchAirStation(id: number, airStationPatch: Partial<AirStation>) {
            patchState(
                store,
                updateEntity(
                    {
                        id,
                        changes: airStationPatch
                    },
                    airConfig
                )
            )
        }
    }))
);