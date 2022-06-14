import React from "react";
import { ControlPosition } from "leaflet";
import { Zones } from "./Zones";
import { TariffZone } from "../../models/TariffZone";
import { getColorByCodespace } from "./getColorByCodespace";
import { useIntl } from "react-intl";
import {
  getTariffZonesByIdsAction,
  getTariffZonesForFilterAction,
  setSelectedTariffZones,
} from "../../reducers/zonesSlice";

export interface TariffZonesProps {
  position: ControlPosition;
}

export const TariffZones: React.FC<TariffZonesProps> = ({ position }) => {
  const { formatMessage } = useIntl();
  return (
    <Zones<TariffZone>
      controlPosition={position}
      controlTitle={formatMessage({ id: "tariffZonesDeprecated" })}
      getZoneLabel={(fareZone: TariffZone) =>
        `${fareZone.name.value} (${fareZone.id})`
      }
      getZoneColor={(fareZone) =>
        getColorByCodespace(fareZone.id.split(":")[0])
      }
      showSelector={(state) => state.zones.showTariffZones}
      zonesForFilterSelector={(state) => state.zones.tariffZonesForFilter}
      zonesSelector={(state) => state.zones.tariffZones}
      selectedZonesSelector={(state) => state.zones.selectedTariffZones}
      getZonesForFilterAction={getTariffZonesForFilterAction}
      getZonesAction={getTariffZonesByIdsAction}
      setSelectedZonesAction={setSelectedTariffZones}
    />
  );
};
