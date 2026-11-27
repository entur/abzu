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
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import type { NeighbourStop } from "../markers/types";
import { useMapCurrentStop } from "../hooks/useMapCurrentStop";
import { buildMultimodalEdges } from "./utils/buildMultimodalEdges";

/* The parent's link to its children has to stay readable over aerial imagery,
   so it is a chunky dash on a translucent white band rather than a hairline.
   MapLibre measures `line-dasharray` in multiples of the line width, so at
   EDGE_WIDTH 5 this is a 15px dash with a 7.5px gap. */
const EDGE_WIDTH = 5;
const EDGE_DASH_PATTERN = [3, 1.5];
const EDGE_CASING_WIDTH = 9;
const EDGE_CASING_OPACITY = 0.75;

export const MultimodalEdgesLayer = () => {
  const theme = useTheme();
  const current = useMapCurrentStop();
  const neighbours = useAppSelector(
    (state) => (state.stopPlace as any).neighbourStops as NeighbourStop[],
  );
  const showEdges = useAppSelector(
    (state) => (state.stopPlace as any).showMultimodalEdges as boolean,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );

  const geoJson = useMemo(
    () => buildMultimodalEdges(current, neighbours ?? [], showExpiredStops),
    [current, neighbours, showExpiredStops],
  );

  if (!showEdges || !geoJson.features.length) return null;

  return (
    <Source id="multimodal-edges" type="geojson" data={geoJson}>
      <Layer
        id="multimodal-edges-casing"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          /* A translucent white band, wider than the line and deliberately not
             dashed: it shows through the gaps as well as around the edges, so
             the dashes keep their contrast over dark aerial imagery without
             painting a hard white stripe across the map. Follows the token's
             own contrast colour rather than a fixed white. */
          "line-color":
            theme.palette.multimodal?.contrastText ??
            theme.palette.background.paper,
          "line-width": EDGE_CASING_WIDTH,
          "line-opacity": EDGE_CASING_OPACITY,
        }}
      />
      <Layer
        id="multimodal-edges-line"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          /* Same token as the parent marker, so the line always leaves the
             parent in the parent's own colour. */
          "line-color":
            theme.palette.multimodal?.main ?? theme.palette.primary.main,
          "line-width": EDGE_WIDTH,
          "line-dasharray": EDGE_DASH_PATTERN,
          "line-opacity": 1,
        }}
      />
    </Source>
  );
};
