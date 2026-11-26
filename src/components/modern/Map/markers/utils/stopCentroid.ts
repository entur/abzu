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

import type { LatLng, MapStopPlace } from "../types";

/** Tiamat stores coordinates with six decimals; legacy rounds the same way. */
const COORDINATE_DECIMALS = 6;

const round = (value: number): number =>
  Number(value.toFixed(COORDINATE_DECIMALS));

/**
 * Where "Auto-adjust centroid" puts a stop (F-30): the centre of the bounding
 * box of its children (multimodal) or its quays (ordinary stop), the same
 * point legacy's Leaflet-based `getCentroid` gives. Entries without a
 * location, e.g. a staged child (F-91), are skipped; `null` when none has one.
 */
export const centroidOfStop = (stop: MapStopPlace): LatLng | null => {
  const places = stop.isParent ? stop.children : stop.quays;
  const locations = (places ?? [])
    .map((place) => place.location)
    .filter((location): location is LatLng => !!location);
  if (!locations.length) return null;

  const latitudes = locations.map(([lat]) => lat);
  const longitudes = locations.map(([, lng]) => lng);
  return [
    round((Math.min(...latitudes) + Math.max(...latitudes)) / 2),
    round((Math.min(...longitudes) + Math.max(...longitudes)) / 2),
  ];
};
