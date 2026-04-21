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
import type { PathLink } from "../markers/types";

const colorForIndex = (colors: string[], index: number) =>
  colors[index % colors.length];

/**
 * Builds an ordered [lng, lat] coordinate array for a single path link.
 *
 * Coordinate conventions in Redux state:
 *  - geometry.coordinates: [lat, lng]  → PathLink.js reverses the API value in-place; must swap
 *  - inBetween:            [lat, lng]  → Redux order, must swap
 */
const buildLineCoordinates = (pathLink: PathLink): [number, number][] => {
  const coords: [number, number][] = [];

  const fromCoords =
    pathLink.from?.placeRef?.addressablePlace?.geometry?.coordinates;
  if (fromCoords) coords.push([fromCoords[1], fromCoords[0]]); // [lat,lng] → [lng,lat]

  (pathLink.inBetween ?? []).forEach(([lat, lng]) => coords.push([lng, lat]));

  const toCoords =
    pathLink.to?.placeRef?.addressablePlace?.geometry?.coordinates;
  if (toCoords) coords.push([toCoords[1], toCoords[0]]); // [lat,lng] → [lng,lat]

  return coords;
};

const buildGeoJson = (
  pathLinks: PathLink[],
  colors: string[],
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
          color: colorForIndex(colors, index),
          complete: pathLink.to != null,
        },
      };
    })
    .filter(Boolean) as FeatureCollection<LineString>["features"],
});

export const PathLinkLayer = () => {
  const theme = useTheme();
  const pathLinks = useAppSelector(
    (state) => (state.stopPlace as any).pathLink as PathLink[],
  );
  const enabled = useAppSelector(
    (state) => (state.stopPlace as any).enablePolylines as boolean,
  );

  /** Distinct colours for each path link — index-matched, wraps around */
  const pathLinkColors = useMemo(
    () => [
      theme.palette.error.main,
      theme.palette.secondary.main,
      theme.palette.primary.dark,
      theme.palette.success.dark,
      theme.palette.warning.dark,
      theme.palette.info.dark,
      theme.palette.secondary.dark,
    ],
    [theme],
  );

  const geoJson = useMemo(
    () => buildGeoJson(pathLinks ?? [], pathLinkColors),
    [pathLinks, pathLinkColors],
  );

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
