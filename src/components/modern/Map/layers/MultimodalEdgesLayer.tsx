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

import { useTheme } from "@mui/material";
import type { FeatureCollection, LineString } from "geojson";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import type { ChildStop, LatLng, MapStopPlace } from "../markers/types";

/** Returns the location of a child stop, falling back to geometry.coordinates. */
const resolveChildLocation = (child: ChildStop): LatLng | null => {
  if (child.location) return child.location;

  const coords = child.geometry?.coordinates;
  if (coords) return [coords[1], coords[0]]; // swap [lng, lat] → [lat, lng]

  return null;
};

const buildGeoJson = (
  current: MapStopPlace | null,
): FeatureCollection<LineString> => {
  if (!current?.isParent || !current.location || !current.children?.length) {
    return { type: "FeatureCollection", features: [] };
  }

  const [parentLat, parentLng] = current.location;

  const features = current.children
    .map((child) => {
      const childLocation = resolveChildLocation(child);
      if (!childLocation) return null;

      const [childLat, childLng] = childLocation;
      return {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          // MapLibre expects [lng, lat]
          coordinates: [
            [parentLng, parentLat],
            [childLng, childLat],
          ] as [number, number][],
        },
        properties: {},
      };
    })
    .filter(Boolean) as FeatureCollection<LineString>["features"];

  return { type: "FeatureCollection", features };
};

export const MultimodalEdgesLayer = () => {
  const theme = useTheme();
  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const showEdges = useAppSelector(
    (state) => (state.stopPlace as any).showMultimodalEdges as boolean,
  );

  const geoJson = useMemo(() => buildGeoJson(current), [current]);

  if (!showEdges || !geoJson.features.length) return null;

  return (
    <Source id="multimodal-edges" type="geojson" data={geoJson}>
      <Layer
        id="multimodal-edges-line"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          "line-color": theme.palette.success.light,
          "line-width": 3,
          "line-dasharray": [8, 2],
          "line-opacity": 0.9,
        }}
      />
    </Source>
  );
};
