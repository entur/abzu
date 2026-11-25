import { describe, expect, it } from "vitest";
import { mergeOverlappingClusters } from "./clusterLayout";
import type { StopPlaceCluster } from "./types";

const cluster = (
  count: number,
  longitude: number,
  latitude: number,
): StopPlaceCluster => ({
  count,
  longitude,
  latitude,
  lonMin: longitude - 0.01,
  latMin: latitude - 0.01,
  lonMax: longitude + 0.01,
  latMax: latitude + 0.01,
});

// At zoom 8 one degree of longitude is about 364 pixels at the equator, about 182 at latitude 60
const ZOOM = 8;

describe("mergeOverlappingClusters", () => {
  it("merges bubbles that would overlap into one with the summed count", () => {
    const merged = mergeOverlappingClusters(
      [cluster(900, 23.7, 61.5), cluster(1000, 23.8, 61.5)],
      ZOOM,
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].count).toBe(1900);
  });

  it("places the merged bubble at the count-weighted mean and covers both bounds", () => {
    const [merged] = mergeOverlappingClusters(
      [cluster(3, 25.0, 61.0), cluster(1, 25.1, 61.0)],
      ZOOM,
    );

    expect(merged.longitude).toBeCloseTo(25.025);
    expect(merged.lonMin).toBeCloseTo(24.99);
    expect(merged.lonMax).toBeCloseTo(25.11);
  });

  it("keeps bubbles that are far enough apart", () => {
    const clusters = [cluster(900, 23.7, 61.5), cluster(1000, 25.7, 62.2)];

    expect(mergeOverlappingClusters(clusters, ZOOM)).toHaveLength(2);
  });

  it("merges the same bubbles less when zoomed in", () => {
    const clusters = [cluster(50, 25.0, 61.0), cluster(50, 25.2, 61.0)];

    expect(mergeOverlappingClusters(clusters, 7)).toHaveLength(1);
    expect(mergeOverlappingClusters(clusters, 9)).toHaveLength(2);
  });

  it("merges again when a merged bubble grows into a neighbour", () => {
    // 90 px apart, and the small one is 95 px north of their midpoint: 105 px from each
    const clusters = [
      cluster(1000, 25.0, 61.0),
      cluster(1000, 25.2472, 61.0),
      cluster(9, 25.1236, 61.1265),
    ];

    const merged = mergeOverlappingClusters(clusters, ZOOM);

    expect(merged).toHaveLength(1);
    expect(merged[0].count).toBe(2009);
  });
});
