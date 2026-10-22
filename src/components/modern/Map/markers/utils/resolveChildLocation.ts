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

import type { ChildStop, LatLng } from "../types";

/**
 * A multimodal child's position. A child staged with "add to multimodal"
 * comes from getAddStopPlaceInfo with only `geometry` (`[lng, lat]`), so
 * reading `location` alone drew its connection line but no marker (F-91).
 */
export const resolveChildLocation = (child: ChildStop): LatLng | null => {
  if (child.location) return child.location;
  const coordinates = child.geometry?.coordinates;
  if (coordinates) return [coordinates[1], coordinates[0]];
  return null;
};
