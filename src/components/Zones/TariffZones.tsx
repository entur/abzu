import React from "react";
import {
  getTariffZonesByIds,
  getTariffZonesForFilter,
} from "../../actions/TiamatActions";
import { ControlPosition } from "leaflet";
import { Zones } from "./Zones";
import { TariffZone } from "../../models/TariffZone";
import { getColorByCodespace } from "./getColorByCodespace";
import { useIntl } from "react-intl";

export interface TariffZonesProps {
  position: ControlPosition;
}

export const TariffZones: React.FC<TariffZonesProps> = ({ position }) => {
  const { formatMessage } = useIntl();
  return (
    <Zones<TariffZone>
      controlPosition={position}
      controlTitle={formatMessage({ id: "tariffZones" })}
      getZoneLabel={(fareZone: TariffZone) =>
        `${fareZone.name.value} (${fareZone.id})`
      }
      getZoneColor={(fareZone) =>
        getColorByCodespace(fareZone.id.split(":")[0])
      }
      showSelector={(state) => state.mapUtils.showTariffZones}
      zonesForFilterSelector={(state) => state.mapUtils.tariffZonesForFilter}
      zonesSelector={(state) => state.mapUtils.tariffZones}
      getZonesForFilterAction={getTariffZonesForFilter}
      getZonesAction={getTariffZonesByIds}
    />
  );
};
