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
import type { FeatureCollection, Polygon } from "geojson";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { Entities } from "../../../../models/Entities";
import { useAppSelector } from "../../../../store/hooks";
import type { LatLng } from "../markers/types";

const FILL_OPACITY = 0.15;
const OUTLINE_WIDTH = 2;
const MIN_POLYGON_POINTS = 3;

interface GroupPolygon {
  name: string;
  locations: LatLng[];
}

/**
 * Sorts points into convex polygon order using bounding-box centroid + angle sort.
 * Matches the legacy `sortPolygonByAngles` behaviour exactly (bbox mid, not mean centroid).
 * Points are [lat, lng] (Redux convention).
 */
const sortByAngle = (points: LatLng[]): LatLng[] => {
  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);

  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  return [...points].sort((a, b) => {
    const angleA = Math.atan2(a[1] - centerLng, a[0] - centerLat);
    const angleB = Math.atan2(b[1] - centerLng, b[0] - centerLat);
    return angleB - angleA;
  });
};

const buildGeoJson = (groups: GroupPolygon[]): FeatureCollection<Polygon> => ({
  type: "FeatureCollection",
  features: groups
    .map(({ name, locations }) => {
      if (locations.length < MIN_POLYGON_POINTS) return null;

      const sorted = sortByAngle(locations);

      // GeoJSON polygon ring must be closed (first === last) and use [lng, lat]
      const ring = [...sorted, sorted[0]].map(
        ([lat, lng]) => [lng, lat] as [number, number],
      );

      return {
        type: "Feature" as const,
        geometry: { type: "Polygon" as const, coordinates: [ring] },
        properties: { name },
      };
    })
    .filter(Boolean) as FeatureCollection<Polygon>["features"],
});

export const StopGroupLayer = () => {
  const theme = useTheme();
  const groupColor = theme.palette.secondary.main;

  const members = useAppSelector(
    (state) =>
      (state.stopPlacesGroup as any).current?.members as
        | Array<{ location?: LatLng }>
        | undefined,
  );
  const groupName = useAppSelector(
    (state) =>
      (state.stopPlacesGroup as any).current?.name as string | undefined,
  );
  const activeSearchResult = useAppSelector(
    (state) => (state.stopPlace as any).activeSearchResult as any,
  );

  const groups = useMemo((): GroupPolygon[] => {
    const result: GroupPolygon[] = [];

    const memberLocations = (members ?? [])
      .map((m) => m.location)
      .filter((loc): loc is LatLng => !!loc);

    if (memberLocations.length) {
      result.push({ name: groupName ?? "", locations: memberLocations });
    }

    if (
      activeSearchResult?.entityType === Entities.GROUP_OF_STOP_PLACE &&
      activeSearchResult?.members?.length
    ) {
      const searchLocations = (
        activeSearchResult.members as Array<{ location?: LatLng }>
      )
        .map((m) => m.location)
        .filter((loc): loc is LatLng => !!loc);

      if (searchLocations.length) {
        result.push({
          name: activeSearchResult.name ?? "",
          locations: searchLocations,
        });
      }
    }

    return result;
  }, [members, groupName, activeSearchResult]);

  const geoJson = useMemo(() => buildGeoJson(groups), [groups]);

  if (!geoJson.features.length) return null;

  return (
    <Source id="stop-groups" type="geojson" data={geoJson}>
      <Layer
        id="stop-groups-fill"
        type="fill"
        paint={{
          "fill-color": groupColor,
          "fill-opacity": FILL_OPACITY,
        }}
      />
      <Layer
        id="stop-groups-outline"
        type="line"
        paint={{
          "line-color": groupColor,
          "line-width": OUTLINE_WIDTH,
        }}
      />
    </Source>
  );
};
