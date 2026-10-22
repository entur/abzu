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

/** `[lat, lng]`, the order Redux stores positions in. */
export type Position = [number, number];

const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;
const EARTH_RADIUS_METERS = 6371000;
/** How far a typed position may be from its reference before we ask (F-103). */
export const MAX_DISTANCE_FROM_REFERENCE_METERS = 1000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** A real position on Earth: finite, lat within ±90, lng within ±180. */
export const isValidPosition = ([lat, lng]: Position): boolean =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  Math.abs(lat) <= MAX_LATITUDE &&
  Math.abs(lng) <= MAX_LONGITUDE;

/** Great-circle (haversine) distance between two positions. */
export const distanceInMeters = (
  [fromLat, fromLng]: Position,
  [toLat, toLng]: Position,
): number => {
  const latDelta = toRadians(toLat - fromLat);
  const lngDelta = toRadians(toLng - fromLng);
  const halfChord =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(lngDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(halfChord));
};

/**
 * The swapped position when lat and lng look typed the wrong way round: the
 * typed position is far from the reference, but swapping them lands close to
 * it. `10.75, 59.91` for Oslo would otherwise end up off the Horn of Africa.
 */
export const suggestSwappedPosition = (
  position: Position,
  reference: Position,
): Position | null => {
  const swapped: Position = [position[1], position[0]];
  if (!isValidPosition(swapped)) return null;
  const isTypedFar =
    distanceInMeters(position, reference) > MAX_DISTANCE_FROM_REFERENCE_METERS;
  const isSwappedNear =
    distanceInMeters(swapped, reference) <= MAX_DISTANCE_FROM_REFERENCE_METERS;
  return isTypedFar && isSwappedNear ? swapped : null;
};

export type TypedPositionCheck =
  | { status: "invalid" }
  | { status: "ok" }
  | { status: "far"; distanceMeters: number; swapped: Position | null };

/** Checks a typed position, optionally against where it is expected to be. */
export const checkTypedPosition = (
  position: Position,
  reference?: Position,
): TypedPositionCheck => {
  if (!isValidPosition(position)) return { status: "invalid" };
  if (!reference) return { status: "ok" };
  const distance = distanceInMeters(position, reference);
  if (distance <= MAX_DISTANCE_FROM_REFERENCE_METERS) return { status: "ok" };
  return {
    status: "far",
    distanceMeters: distance,
    swapped: suggestSwappedPosition(position, reference),
  };
};
