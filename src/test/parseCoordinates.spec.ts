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

import { describe, expect, test } from "vitest";
import { parseCoordinates } from "../components/modern/Shared/coordinates/parseCoordinates";

describe("parseCoordinates (F-94)", () => {
  test.each([
    [
      "decimal degrees with a comma",
      "59.910357, 10.753051",
      [59.910357, 10.753051],
    ],
    [
      "decimal degrees with a space",
      "58.100494 7.976486",
      [58.100494, 7.976486],
    ],
    [
      "Google Maps DMS (the tester's example)",
      `62°12'11.5"N 6°08'18.2"E`,
      [62.203194, 6.138389],
    ],
    [
      "DMS with spaces and a comma",
      `62° 12' 11.5" N, 6° 8' 18.2" E`,
      [62.203194, 6.138389],
    ],
    [
      "degrees and decimal minutes",
      "62°12.192'N 6°8.303'E",
      [62.2032, 6.138383],
    ],
    ["letters before the numbers", "N 59.91 E 10.75", [59.91, 10.75]],
    ["longitude first, told by the letters", "10.75E 59.91N", [59.91, 10.75]],
    [
      "southern and western hemispheres",
      `33°51'54"S 151°12'34"E`,
      [-33.865, 151.209444],
    ],
    ["Norwegian Ø/V letters", "59.91N 10.75Ø", [59.91, 10.75]],
    [
      "prime and double-prime symbols",
      "62°12′11.5″N 6°08′18.2″E",
      [62.203194, 6.138389],
    ],
  ])("%s", (_name, text, expected) => {
    expect(parseCoordinates(text)).toEqual(expected);
  });

  test.each([
    ["a stop name", "Sjøstrand skole"],
    ["a stop id", "NSR:StopPlace:24869"],
    ["a street address with numbers", "Storgata 5 7"],
    ["a name with a number", "Sentrum 12"],
    ["one number", "59.91"],
    ["out of range", "123.4 456.7"],
    ["latitude over 90 in DMS", `95°0'0"N 10°0'0"E`],
    ["empty", "   "],
  ])("not coordinates: %s", (_name, text) => {
    expect(parseCoordinates(text)).toBeNull();
  });
});
