/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

/**
 * A newly added quay or parking used to be created at the stop place's own
 * coordinates, which put it directly underneath the stop place marker where it
 * was invisible. Offsetting it clear of that marker is what makes the creation
 * visible at all.
 */
const OFFSET_METERS = 25;
const METERS_PER_DEGREE_LATITUDE = 111_320;

/** Successive additions step around a ring so they never stack on each other. */
const RING_POSITIONS = 8;

/** Guards the longitude conversion against a vanishing cosine near the poles. */
const MIN_LATITUDE_COSINE = 0.01;

/**
 * Position for a newly created child element, offset clear of the stop place
 * marker. Takes and returns `[latitude, longitude]` — Redux order, not MapLibre's.
 */
export const offsetPositionForNewElement = (
  [latitude, longitude]: [number, number],
  existingCount: number,
): [number, number] => {
  const angle =
    ((existingCount % RING_POSITIONS) * 2 * Math.PI) / RING_POSITIONS;

  const latitudeCosine = Math.max(
    Math.abs(Math.cos((latitude * Math.PI) / 180)),
    MIN_LATITUDE_COSINE,
  );

  const latitudeOffset =
    (OFFSET_METERS * Math.cos(angle)) / METERS_PER_DEGREE_LATITUDE;
  const longitudeOffset =
    (OFFSET_METERS * Math.sin(angle)) /
    (METERS_PER_DEGREE_LATITUDE * latitudeCosine);

  return [latitude + latitudeOffset, longitude + longitudeOffset];
};
