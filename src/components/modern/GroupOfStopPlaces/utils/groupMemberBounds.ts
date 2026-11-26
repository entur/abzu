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

import type { LatLng } from "../../Map/markers/types";

export interface LocatedMember {
  location?: LatLng | null;
}

/** MapLibre bounds: `[[west, south], [east, north]]`, each as `[lng, lat]`. */
export type LngLatBounds = [[number, number], [number, number]];

/**
 * The smallest box holding every member's location, ready for MapLibre's
 * `fitBounds`. Redux stores `[lat, lng]`; the result is `[lng, lat]`.
 * Members without a location are skipped; `null` when none has one.
 */
export const groupMemberBounds = (
  members: LocatedMember[],
): LngLatBounds | null => {
  const locations = members
    .map((member) => member.location)
    .filter((location): location is LatLng => !!location);
  if (!locations.length) return null;

  const latitudes = locations.map(([lat]) => lat);
  const longitudes = locations.map(([, lng]) => lng);
  return [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ];
};
