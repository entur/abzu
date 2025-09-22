import { ControlPosition } from "leaflet";
import React from "react";
import { useIntl } from "react-intl";
import { FareZone } from "../../models/FareZone";
import {
  getFareZonesByIdsAction,
  getFareZonesForFilterAction,
  setSelectedFareZones,
} from "../../reducers/zonesSlice";
import { Zones } from "./Zones";
import { getColorByCodespace } from "./getColorByCodespace";

export interface FareZonesProps {
  position: ControlPosition;
}

export const FareZones: React.FC<FareZonesProps> = ({ position }) => {
  const { formatMessage } = useIntl();
  return (
    <Zones<FareZone>
      controlPosition={position}
      controlTitle={formatMessage({ id: "tariffZones" })}
      getZoneLabel={(fareZone: FareZone) =>
        `${fareZone.name.value} - ${fareZone.privateCode.value} (${fareZone.id})`
      }
      getZoneColor={(fareZone) =>
        getColorByCodespace(fareZone.id?.split(":")[0] || "default")
      }
      showSelector={(state) => state.zones.showFareZones}
      zonesForFilterSelector={(state) => state.zones.fareZonesForFilter}
      zonesSelector={(state) => state.zones.fareZones}
      selectedZonesSelector={(state) => state.zones.selectedFareZones}
      getZonesForFilterAction={getFareZonesForFilterAction}
      getZonesAction={getFareZonesByIdsAction}
      setSelectedZonesAction={setSelectedFareZones}
    />
  );
};
