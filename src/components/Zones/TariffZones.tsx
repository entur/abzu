import { ControlPosition } from "leaflet";
import React from "react";
import { useIntl } from "react-intl";
import { TariffZone } from "../../models/TariffZone";
import {
  getTariffZonesByIdsAction,
  getTariffZonesForFilterAction,
  setSelectedTariffZones,
} from "../../reducers/zonesSlice";
import { getColorByCodespace } from "./getColorByCodespace";
import { Zones } from "./Zones";

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
        getColorByCodespace(fareZone.id?.split(":")[0] || "default")
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
