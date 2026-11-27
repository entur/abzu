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
import { MARKER_SIZES } from "../components/modern/Map/markerSize/markerSizePreference";

const SIZE_FACTORS = Object.values(MARKER_SIZES);

describe("markerScaleForZoom (F-93)", () => {
  test.each(SIZE_FACTORS)(
    "size %s keeps one working size from zoom 15 in, instead of growing",
    (factor) => {
      expect(markerScaleForZoom(15, factor)).toBe(factor);
      expect(markerScaleForZoom(18, factor)).toBe(factor);
      expect(markerScaleForZoom(21, factor)).toBe(factor);
    },
  );

  test("markers shrink when zooming out, down to a floor", () => {
    const factor = MARKER_SIZES.medium;
    expect(markerScaleForZoom(10, factor)).toBeCloseTo(
      Math.pow(2, -1) * factor,
    );
    expect(markerScaleForZoom(5, factor)).toBe(0.5 * factor);
    expect(markerScaleForZoom(0, factor)).toBe(0.5 * factor);
  });

  test.each(SIZE_FACTORS)(
    "size %s: zooming in never shrinks markers, nor takes them past the working size",
    (factor) => {
      for (let zoom = 0; zoom < 22; zoom += 0.5) {
        expect(markerScaleForZoom(zoom + 0.5, factor)).toBeGreaterThanOrEqual(
          markerScaleForZoom(zoom, factor),
        );
        expect(markerScaleForZoom(zoom, factor)).toBeLessThanOrEqual(factor);
      }
    },
  );
});
