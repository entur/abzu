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

import type { Map as MapLibreMap } from "maplibre-gl";
import { useCallback } from "react";
import { useAppSelector } from "../../../../../store/hooks";

/** Neighbour stops load above zoom 13, so 14 shows the stops around the spot. */
const COORDINATE_ZOOM = 14;
const FLY_TO_DURATION = 800;

export type FlyToCoordinates = (coordinates: [number, number]) => void;

/**
 * Moves the persistent map to `[lat, lng]` coordinates (F-84). The map only
 * reads its stored centre once at mount, so storing a new centre isn't
 * enough; it has to be told to fly. The map's own move handler then records
 * the new centre and loads the stops nearby.
 */
export const useFlyToCoordinates = (): FlyToCoordinates => {
  const activeMap = useAppSelector(
    (state) => (state as any).mapUtils?.activeMap as MapLibreMap | undefined,
  );

  return useCallback(
    ([lat, lng]) => {
      activeMap?.flyTo({
        center: [Number(lng), Number(lat)],
        zoom: COORDINATE_ZOOM,
        duration: FLY_TO_DURATION,
      });
    },
    [activeMap],
  );
};
