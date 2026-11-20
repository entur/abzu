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

import type { Feature, FeatureCollection, LineString } from "geojson";
import type {
  ChildStop,
  LatLng,
  MapStopPlace,
  NeighbourStop,
} from "../../markers/types";
import { isHiddenAsExpired } from "../../markers/utils/isHiddenAsExpired";
import { resolveChildLocation } from "../../markers/utils/resolveChildLocation";

const buildEdgesForParent = (
  parentLocation: LatLng,
  children: ChildStop[],
): Feature<LineString>[] => {
  const [parentLat, parentLng] = parentLocation;

  return children
    .map((child) => {
      const childLocation = resolveChildLocation(child);
      if (!childLocation) return null;
      const [childLat, childLng] = childLocation;
      return {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [parentLng, parentLat],
            [childLng, childLat],
          ] as [number, number][],
        },
        properties: {},
      };
    })
    .filter(Boolean) as Feature<LineString>[];
};

/* A neighbouring parent that has expired loses its lines
   with its marker; the open stop keeps them, like its child markers. */
export const buildMultimodalEdges = (
  current: MapStopPlace | null,
  neighbours: NeighbourStop[],
  showExpiredStops: boolean,
): FeatureCollection<LineString> => {
  const features: Feature<LineString>[] = [];

  if (current?.isParent && current.location && current.children?.length) {
    features.push(...buildEdgesForParent(current.location, current.children));
  }

  for (const stop of neighbours) {
    if (isHiddenAsExpired(stop, showExpiredStops)) continue;
    if (stop.isParent && stop.location && stop.children?.length) {
      features.push(...buildEdgesForParent(stop.location, stop.children));
    }
  }

  return { type: "FeatureCollection", features };
};
