import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  AsyncThunk,
  AsyncThunkAction,
} from "@reduxjs/toolkit";
import { ControlPosition } from "leaflet";
import { Dispatch } from "redux";
import { TariffZone } from "../../models/TariffZone";
import { AppDispatch, RootState } from "../../store/store";
import { useZones } from "./useZones";
import { ZonesControl } from "./ZonesControl";
import { ZonesLayer } from "./ZonesLayer";

export interface ZonesProps<T extends TariffZone> {
  controlPosition: ControlPosition;
  controlTitle: string;
  getZoneLabel: (zone: T) => string;
  getZoneColor: (zone: T) => string;
  showSelector: (state: RootState) => boolean;
  zonesForFilterSelector: (state: RootState) => T[];
  zonesSelector: (state: RootState) => T[];
  selectedZonesSelector: (state: RootState) => string[];
  getZonesForFilterAction: AsyncThunk<T[], void, { state: RootState }>;
  getZonesAction: AsyncThunk<T[], string[], { state: RootState }>;
  setSelectedZonesAction: ActionCreatorWithPayload<string[], string>;
}

export const Zones = <T extends TariffZone>({
  controlPosition,
  controlTitle,
  getZoneLabel,
  getZoneColor,
  showSelector,
  zonesForFilterSelector,
  zonesSelector,
  selectedZonesSelector,
  getZonesForFilterAction,
  getZonesAction,
  setSelectedZonesAction,
}: ZonesProps<T>) => {
  const {
    show,
    zonesForFilter,
    zonesToDisplay,
    selectedZones,
    setSelectedZones,
  } = useZones<T>({
    showSelector,
    zonesForFilterSelector,
    zonesSelector,
    selectedZonesSelector,
    getZonesForFilterAction,
    getZonesAction,
    setSelectedZonesAction,
  });

  return (
    <>
      {show && (
        <>
          <ZonesControl<T>
            position={controlPosition}
            title={controlTitle}
            zonesForFilter={zonesForFilter}
            selectedZones={selectedZones}
            setSelectedZones={setSelectedZones}
            getZoneLabel={getZoneLabel}
          />
          <ZonesLayer<T>
            zones={zonesToDisplay}
            getTooltipText={getZoneLabel}
            getColor={getZoneColor}
          />
        </>
      )}
    </>
  );
};
