import React from "react";
import {
  getFareZones,
  getFareZonesForFilter,
} from "../../actions/TiamatActions";
import { ControlPosition } from "leaflet";
import { FareZone } from "../../models/FareZone";
import { Zones } from "./Zones";
import { getColorByCodespace } from "./getColorByCodespace";
import { useIntl } from "react-intl";

export interface FareZonesProps {
  position: ControlPosition;
}

export const FareZones: React.FC<FareZonesProps> = ({ position }) => {
  const {formatMessage} = useIntl();
  return (
    <Zones<FareZone>
      controlPosition={position}
      controlTitle={formatMessage({id: 'fareZones'})}
      getZoneLabel={(fareZone: FareZone) =>
        `${fareZone.name.value} - ${fareZone.privateCode.value} (${fareZone.id})`
      }
      getZoneColor={(fareZone) =>
        getColorByCodespace(fareZone.id.split(":")[0])
      }
      showSelector={(state) => state.mapUtils.showFareZones}
      zonesForFilterSelector={(state) => state.mapUtils.fareZonesForFilter}
      zonesSelector={(state) => state.mapUtils.fareZones}
      getZonesForFilterAction={getFareZonesForFilter}
      getZonesAction={getFareZones}
    />
  );
};
