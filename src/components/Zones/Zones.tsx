import { ControlPosition } from "leaflet";
import { TariffZone } from "../../models/TariffZone";
import { useZones } from "./useZones";
import { ZonesControl } from "./ZonesControl";
import { ZonesLayer } from "./ZonesLayer";

export interface ZonesProps<T extends TariffZone> {
  controlPosition: ControlPosition;
  controlTitle: string;
  getZoneLabel: (zone: T) => string;
  getZoneColor: (zone: T) => string;
  showSelector: (state: any) => boolean;
  zonesForFilterSelector: (state: any) => T[];
  zonesSelector: (state: any) => T[];
  getZonesForFilterAction: () => (
    dispatch: any,
    getState: any
  ) => Promise<void>;
  getZonesAction: (
    ids: string[]
  ) => (dispatch: any, getState: any) => Promise<void>;
}

export const Zones = <T extends TariffZone>({
  controlPosition,
  controlTitle,
  getZoneLabel,
  getZoneColor,
  showSelector,
  zonesForFilterSelector,
  zonesSelector,
  getZonesForFilterAction,
  getZonesAction,
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
    getZonesForFilterAction,
    getZonesAction,
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
