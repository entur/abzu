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
import type { LatLng } from "../markers/types";

const buildGeoJson = (locations: LatLng[]): FeatureCollection<LineString> => {
  if (locations.length < 2) return { type: "FeatureCollection", features: [] };

  const centerLat =
    locations.reduce((sum, [lat]) => sum + lat, 0) / locations.length;
  const centerLng =
    locations.reduce((sum, [, lng]) => sum + lng, 0) / locations.length;

  const features = locations.map(([lat, lng]) => ({
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [centerLng, centerLat],
        [lng, lat],
      ] as [number, number][],
    },
    properties: {},
  }));

  return { type: "FeatureCollection", features };
};

export const GroupEdgesLayer = () => {
  const theme = useTheme();

  const members = useAppSelector(
    (state) =>
      (state as any).stopPlacesGroup?.current?.members as
        | Array<{ location?: LatLng }>
        | undefined,
  );

  const isEditingGroup = useAppSelector(
    (state) => !!(state as any).stopPlacesGroup?.current?.id,
  );

  const locations = useMemo(
    () =>
      (members ?? [])
        .map((m) => m.location)
        .filter((loc): loc is LatLng => !!loc),
    [members],
  );

  const geoJson = useMemo(() => buildGeoJson(locations), [locations]);

  if (!isEditingGroup || !geoJson.features.length) return null;

  return (
    <Source id="group-edges" type="geojson" data={geoJson}>
      <Layer
        id="group-edges-line"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          "line-color": theme.palette.secondary.light,
          "line-width": 3,
          "line-dasharray": [8, 2],
          "line-opacity": 0.9,
        }}
      />
    </Source>
  );
};
