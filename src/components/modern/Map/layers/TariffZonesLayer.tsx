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

import type { FeatureCollection, Polygon } from "geojson";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { TariffZone } from "../../../../models/TariffZone";
import {
  getTariffZonesByIdsAction,
  getTariffZonesForFilterAction,
  setSelectedTariffZones,
} from "../../../../reducers/zonesSlice";
import { getColorByCodespace } from "../../../Zones/getColorByCodespace";
import { useZones } from "../../../Zones/useZones";

const FILL_OPACITY = 0.2;
const OUTLINE_WIDTH = 2;

const buildGeoJson = (zones: TariffZone[]): FeatureCollection<Polygon> => ({
  type: "FeatureCollection",
  features: zones.map((zone) => ({
    type: "Feature" as const,
    id: zone.id,
    properties: {
      color: `#${getColorByCodespace(zone.id?.split(":")[0] ?? "default")}`,
    },
    geometry: {
      type: "Polygon" as const,
      // polygon.coordinates is [lat, lng] (reversed by zonesSlice); GeoJSON/MapLibre requires [lng, lat]
      coordinates: [zone.polygon.coordinates.map(([lat, lng]) => [lng, lat])],
    },
  })),
});

export const TariffZonesLayer = () => {
  const { show, zonesToDisplay } = useZones<TariffZone>({
    showSelector: (state) => state.zones.showTariffZones,
    zonesForFilterSelector: (state) => state.zones.tariffZonesForFilter,
    zonesSelector: (state) => state.zones.tariffZones,
    selectedZonesSelector: (state) => state.zones.selectedTariffZones,
    getZonesForFilterAction: getTariffZonesForFilterAction,
    getZonesAction: getTariffZonesByIdsAction,
    setSelectedZonesAction: setSelectedTariffZones,
  });

  const geoJson = useMemo(() => buildGeoJson(zonesToDisplay), [zonesToDisplay]);

  if (!show || geoJson.features.length === 0) return null;

  return (
    <Source id="tariff-zones" type="geojson" data={geoJson}>
      <Layer
        id="tariff-zones-fill"
        type="fill"
        paint={{
          "fill-color": ["get", "color"],
          "fill-opacity": FILL_OPACITY,
        }}
      />
      <Layer
        id="tariff-zones-outline"
        type="line"
        paint={{
          "line-color": ["get", "color"],
          "line-width": OUTLINE_WIDTH,
        }}
      />
    </Source>
  );
};
