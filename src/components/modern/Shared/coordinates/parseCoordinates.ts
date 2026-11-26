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

import { extractCoordinates } from "../../../../utils";

/** `[lat, lng]`, the order Redux stores positions in. */
export type LatLngPair = [number, number];

const DECIMALS = 6;
const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;
const MINUTES_PER_DEGREE = 60;
const SECONDS_PER_DEGREE = 3600;

/** N/S give latitude, E/W (Norwegian Ø/V) longitude; S and W are negative. */
const LATITUDE_LETTERS = "NS";
const NEGATIVE_LETTERS = "SWV";

/**
 * One coordinate: degrees, optional minutes and seconds (decimals allowed in
 * the last part) and an optional hemisphere letter before or after, e.g.
 * `62°12'11.5"N`, `N 62° 12.192'`, `6°08'18.2"E`, `10.75`.
 */
const PART_PATTERN =
  /([NSEWØV])?\s*(-?\d+(?:[.,]\d+)?)\s*°?\s*(?:(\d+(?:[.,]\d+)?)\s*['′’]\s*)?(?:(\d+(?:[.,]\d+)?)\s*(?:["″”]|'')\s*)?([NSEWØV])?/giu;

interface CoordinatePart {
  value: number;
  letter?: string;
}

const toNumber = (text: string | undefined): number =>
  text ? Number(text.replace(",", ".")) : 0;

const round = (value: number): number => Number(value.toFixed(DECIMALS));

const readParts = (text: string): CoordinatePart[] =>
  [...text.matchAll(PART_PATTERN)]
    .filter((match) => match[2] !== undefined)
    .map((match) => {
      const degrees = toNumber(match[2]);
      const minutes = toNumber(match[3]);
      const seconds = toNumber(match[4]);
      const letter = (match[1] || match[5] || "").toUpperCase() || undefined;
      const magnitude =
        Math.abs(degrees) +
        minutes / MINUTES_PER_DEGREE +
        seconds / SECONDS_PER_DEGREE;
      const isNegative =
        degrees < 0 ||
        (letter !== undefined && NEGATIVE_LETTERS.includes(letter));
      return { value: isNegative ? -magnitude : magnitude, letter };
    });

const isInRange = ([lat, lng]: LatLngPair): boolean =>
  Math.abs(lat) <= MAX_LATITUDE && Math.abs(lng) <= MAX_LONGITUDE;

/**
 * Coordinates typed or pasted into the search (F-94), as `[lat, lng]`.
 * Accepts decimal degrees (the existing parser), degrees-minutes-seconds as
 * Google Maps copies them (`62°12'11.5"N 6°08'18.2"E`), degrees with decimal
 * minutes, and N/S/E/W (Ø/V) letters before or after each number. With
 * letters, longitude-first input is turned around. `null` for anything else.
 */
export const parseCoordinates = (text: string): LatLngPair | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const decimal = extractCoordinates(trimmed) as LatLngPair | null;
  if (decimal) {
    const latLng = decimal.map(Number) as LatLngPair;
    return isInRange(latLng) ? latLng : null;
  }

  const hasDegreeNotation = /[°'′"″NSEWØV]/iu.test(trimmed);
  if (!hasDegreeNotation) return null;

  // Only coordinates and separators: "Storgata 5 7" is an address, not 5, 7.
  const leftover = trimmed.replace(PART_PATTERN, "").replace(/[\s,;]/g, "");
  if (leftover) return null;

  const parts = readParts(trimmed);
  if (parts.length !== 2) return null;

  const [first, second] = parts;
  const isLongitudeFirst =
    (first.letter !== undefined && !LATITUDE_LETTERS.includes(first.letter)) ||
    (second.letter !== undefined && LATITUDE_LETTERS.includes(second.letter));
  const latLng: LatLngPair = isLongitudeFirst
    ? [round(second.value), round(first.value)]
    : [round(first.value), round(second.value)];

  return isInRange(latLng) ? latLng : null;
};
