/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import React from "react";
import { FareZone } from "../../../models/FareZone";
import {
  getFareZonesByIdsAction,
  getFareZonesForFilterAction,
  setSelectedFareZones,
} from "../../../reducers/zonesSlice";
import { getColorByCodespace } from "../../Zones/getColorByCodespace";
import { useZones } from "../../Zones/useZones";
import { ZonesLayer } from "../../Zones/ZonesLayer";

/**
 * Modern UI version of FareZones - renders only the map layer without the Leaflet control
 */
export const FareZonesLayer: React.FC = () => {
  const { show, zonesToDisplay } = useZones<FareZone>({
    showSelector: (state) => state.zones.showFareZones,
    zonesForFilterSelector: (state) => state.zones.fareZonesForFilter,
    zonesSelector: (state) => state.zones.fareZones,
    selectedZonesSelector: (state) => state.zones.selectedFareZones,
    getZonesForFilterAction: getFareZonesForFilterAction,
    getZonesAction: getFareZonesByIdsAction,
    setSelectedZonesAction: setSelectedFareZones,
  });

  if (!show) {
    return null;
  }

  return (
    <ZonesLayer<FareZone>
      zones={zonesToDisplay}
      getTooltipText={(zone) =>
        `${zone.name.value} - ${zone.privateCode.value} (${zone.id})`
      }
      getColor={(zone) =>
        getColorByCodespace(zone.id?.split(":")[0] || "default")
      }
    />
  );
};
