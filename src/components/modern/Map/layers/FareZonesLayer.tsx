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

import { Box, Typography } from "@mui/material";
import type { FeatureCollection, Polygon } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { Layer, Popup, Source, useMap } from "react-map-gl/maplibre";
import { FareZone } from "../../../../models/FareZone";
import {
  getFareZonesByIdsAction,
  getFareZonesForFilterAction,
  setSelectedFareZones,
} from "../../../../reducers/zonesSlice";
import { getColorByCodespace } from "../../../Zones/getColorByCodespace";
import { useZones } from "../../../Zones/useZones";

const FILL_OPACITY = 0.1;
const OUTLINE_WIDTH = 2;
const LAYER_FILL_ID = "fare-zones-fill";

interface ZonePopup {
  lng: number;
  lat: number;
  name: string;
  privateCode: string;
  id: string;
}

const buildGeoJson = (zones: FareZone[]): FeatureCollection<Polygon> => ({
  type: "FeatureCollection",
  features: zones.map((zone) => ({
    type: "Feature" as const,
    id: zone.id,
    properties: {
      color: `#${getColorByCodespace(zone.id?.split(":")[0] ?? "default")}`,
      zoneId: zone.id,
      name: zone.name.value,
      privateCode: zone.privateCode.value,
    },
    geometry: {
      type: "Polygon" as const,
      // polygon.coordinates is [lat, lng] (reversed by zonesSlice); GeoJSON/MapLibre requires [lng, lat]
      coordinates: [zone.polygon.coordinates.map(([lat, lng]) => [lng, lat])],
    },
  })),
});

export const FareZonesLayer = () => {
  const { current: mapRef } = useMap();
  const [popup, setPopup] = useState<ZonePopup | null>(null);

  const { show, zonesToDisplay } = useZones<FareZone>({
    showSelector: (state) => state.zones.showFareZones,
    zonesForFilterSelector: (state) => state.zones.fareZonesForFilter,
    zonesSelector: (state) => state.zones.fareZones,
    selectedZonesSelector: (state) => state.zones.selectedFareZones,
    getZonesForFilterAction: getFareZonesForFilterAction,
    getZonesAction: getFareZonesByIdsAction,
    setSelectedZonesAction: setSelectedFareZones,
  });

  const geoJson = useMemo(() => buildGeoJson(zonesToDisplay), [zonesToDisplay]);

  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.getMap();

    const handleClick = (e: any) => {
      const feature = e.features?.[0];
      if (!feature) return;
      setPopup({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        id: feature.properties.zoneId,
        name: feature.properties.name,
        privateCode: feature.properties.privateCode,
      });
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", LAYER_FILL_ID, handleClick);
    map.on("mouseenter", LAYER_FILL_ID, handleMouseEnter);
    map.on("mouseleave", LAYER_FILL_ID, handleMouseLeave);

    return () => {
      map.off("click", LAYER_FILL_ID, handleClick);
      map.off("mouseenter", LAYER_FILL_ID, handleMouseEnter);
      map.off("mouseleave", LAYER_FILL_ID, handleMouseLeave);
    };
  }, [mapRef]);

  // Clear popup when zones panel is closed
  useEffect(() => {
    if (!show) setPopup(null);
  }, [show]);

  if (!show || geoJson.features.length === 0) return null;

  return (
    <>
      <Source id="fare-zones" type="geojson" data={geoJson}>
        <Layer
          id={LAYER_FILL_ID}
          type="fill"
          paint={{
            "fill-color": ["get", "color"],
            "fill-opacity": FILL_OPACITY,
          }}
        />
        <Layer
          id="fare-zones-outline"
          type="line"
          paint={{
            "line-color": ["get", "color"],
            "line-width": OUTLINE_WIDTH,
          }}
        />
      </Source>
      {popup && (
        <Popup
          longitude={popup.lng}
          latitude={popup.lat}
          onClose={() => setPopup(null)}
          closeButton
          maxWidth="240px"
        >
          <Box sx={{ p: 0.5 }}>
            <Typography variant="subtitle2">{popup.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {popup.privateCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {popup.id}
            </Typography>
          </Box>
        </Popup>
      )}
    </>
  );
};
