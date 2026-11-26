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
import { markerScaleForZoom } from "../components/modern/Map/hooks/useMarkerScale";

const WORKING_SCALE = 0.75;
const SMALLEST_SCALE = 0.5 * 0.75;

describe("markerScaleForZoom (F-93)", () => {
  test("markers keep one working size from zoom 15 in, instead of growing", () => {
    expect(markerScaleForZoom(15)).toBe(WORKING_SCALE);
    expect(markerScaleForZoom(18)).toBe(WORKING_SCALE);
    expect(markerScaleForZoom(21)).toBe(WORKING_SCALE);
  });

  test("they shrink when zooming out, down to a floor", () => {
    expect(markerScaleForZoom(10)).toBeCloseTo(Math.pow(2, -1) * 0.75);
    expect(markerScaleForZoom(5)).toBe(SMALLEST_SCALE);
    expect(markerScaleForZoom(0)).toBe(SMALLEST_SCALE);
  });

  test("zooming in never shrinks them, nor takes them past the working size", () => {
    for (let zoom = 0; zoom < 22; zoom += 0.5) {
      expect(markerScaleForZoom(zoom + 0.5)).toBeGreaterThanOrEqual(
        markerScaleForZoom(zoom),
      );
      expect(markerScaleForZoom(zoom)).toBeLessThanOrEqual(WORKING_SCALE);
    }
  });
});
