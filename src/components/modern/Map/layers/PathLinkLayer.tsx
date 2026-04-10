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

import type { FeatureCollection, LineString } from "geojson";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import type { PathLink } from "../markers/types";

/** Distinct colours for each path link — index-matched, wraps around */
const PATH_LINK_COLORS = [
  "#e53935",
  "#7b1fa2",
  "#1565c0",
  "#2e7d32",
  "#e65100",
  "#00695c",
  "#880e4f",
];

const colorForIndex = (index: number) =>
  PATH_LINK_COLORS[index % PATH_LINK_COLORS.length];

/**
 * Builds an ordered [lng, lat] coordinate array for a single path link.
 *
 * Coordinate conventions in Redux state:
 *  - legacyCoordinates: [lng, lat]  → GeoJSON order, use as-is
 *  - inBetween:         [lat, lng]  → Redux order, must swap
 */
const buildLineCoordinates = (pathLink: PathLink): [number, number][] => {
  const coords: [number, number][] = [];

  const fromLegacy =
    pathLink.from?.placeRef?.addressablePlace?.geometry?.legacyCoordinates?.[0];
  if (fromLegacy) coords.push([fromLegacy[1], fromLegacy[0]]); // [lat,lng] → [lng,lat]

  (pathLink.inBetween ?? []).forEach(([lat, lng]) => coords.push([lng, lat]));

  const toLegacy =
    pathLink.to?.placeRef?.addressablePlace?.geometry?.legacyCoordinates?.[0];
  if (toLegacy) coords.push([toLegacy[1], toLegacy[0]]); // [lat,lng] → [lng,lat]

  return coords;
};

const buildGeoJson = (
  pathLinks: PathLink[],
): FeatureCollection<LineString> => ({
  type: "FeatureCollection",
  features: pathLinks
    .map((pathLink, index) => {
      const coordinates = buildLineCoordinates(pathLink);
      if (coordinates.length < 2) return null;
      return {
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates },
        properties: {
          color: colorForIndex(index),
          complete: pathLink.to != null,
        },
      };
    })
    .filter(Boolean) as FeatureCollection<LineString>["features"],
});

export const PathLinkLayer = () => {
  const pathLinks = useAppSelector(
    (state) => (state.stopPlace as any).pathLink as PathLink[],
  );
  const enabled = useAppSelector(
    (state) => (state.stopPlace as any).enablePolylines as boolean,
  );

  const geoJson = useMemo(() => buildGeoJson(pathLinks ?? []), [pathLinks]);

  if (!enabled || !pathLinks?.length) return null;

  return (
    <Source id="path-links" type="geojson" data={geoJson}>
      <Layer
        id="path-links-line"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          "line-color": ["get", "color"],
          "line-width": 6,
          "line-dasharray": [4, 2],
          "line-opacity": ["case", ["get", "complete"], 1, 0.7],
        }}
      />
    </Source>
  );
};
