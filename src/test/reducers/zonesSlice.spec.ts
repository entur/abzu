import { describe, expect, it } from "vitest";
import { normaliseZoneCoordinates } from "../../reducers/zonesSlice";

describe("normaliseZoneCoordinates", () => {
  it("reverses lon/lat to lat/lon for a simple Polygon", () => {
    const polygon = {
      type: "Polygon",
      coordinates: [
        [
          [10.0, 59.0],
          [11.0, 59.0],
          [11.0, 60.0],
          [10.0, 59.0],
        ],
      ],
    };

    const result = normaliseZoneCoordinates(polygon);

    expect(result).toEqual([
      [
        [59.0, 10.0],
        [59.0, 11.0],
        [60.0, 11.0],
        [59.0, 10.0],
      ],
    ]);
  });

  it("preserves hole rings for a Polygon with a hole", () => {
    const polygon = {
      type: "Polygon",
      coordinates: [
        [
          [10.0, 59.0],
          [13.0, 59.0],
          [13.0, 62.0],
          [10.0, 59.0],
        ],
        [
          [11.0, 60.0],
          [12.0, 60.0],
          [12.0, 61.0],
          [11.0, 60.0],
        ],
      ],
    };

    const result = normaliseZoneCoordinates(polygon);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([
      [59.0, 10.0],
      [59.0, 13.0],
      [62.0, 13.0],
      [59.0, 10.0],
    ]);
    expect(result[1]).toEqual([
      [60.0, 11.0],
      [60.0, 12.0],
      [61.0, 12.0],
      [60.0, 11.0],
    ]);
  });

  it("reverses lon/lat to lat/lon for a MultiPolygon", () => {
    const polygon = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [10.0, 59.0],
            [11.0, 59.0],
            [11.0, 60.0],
            [10.0, 59.0],
          ],
        ],
        [
          [
            [20.0, 65.0],
            [21.0, 65.0],
            [21.0, 66.0],
            [20.0, 65.0],
          ],
        ],
      ],
    };

    const result = normaliseZoneCoordinates(polygon);

    expect(result).toEqual([
      [
        [
          [59.0, 10.0],
          [59.0, 11.0],
          [60.0, 11.0],
          [59.0, 10.0],
        ],
      ],
      [
        [
          [65.0, 20.0],
          [65.0, 21.0],
          [66.0, 21.0],
          [65.0, 20.0],
        ],
      ],
    ]);
  });

  it("preserves hole rings within a MultiPolygon sub-polygon", () => {
    const polygon = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [10.0, 59.0],
            [13.0, 59.0],
            [13.0, 62.0],
            [10.0, 59.0],
          ],
          [
            [11.0, 60.0],
            [12.0, 60.0],
            [12.0, 61.0],
            [11.0, 60.0],
          ],
        ],
      ],
    };

    const result = normaliseZoneCoordinates(polygon);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });
});
