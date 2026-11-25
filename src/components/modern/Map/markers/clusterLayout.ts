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

import type { StopPlaceCluster } from "./types";

const MIN_CLUSTER_SIZE = 32;
const DIAMETER_PER_ORDER_OF_MAGNITUDE = 10;
/** MapLibre tiles are 512 pixels wide */
const MAPLIBRE_TILE_SIZE = 512;
/** Space kept between two bubbles; closer bubbles are merged */
export const MIN_GAP_PIXELS = 8;
/** Bubbles whose centres are closer than this are merged even when they do not touch */
export const MERGE_RADIUS_PIXELS = 100;

/** Diameter grows with the order of magnitude of the count, so large clusters stay readable */
export const clusterDiameter = (count: number) =>
  Math.round(
    MIN_CLUSTER_SIZE +
      DIAMETER_PER_ORDER_OF_MAGNITUDE * Math.log10(Math.max(count, 1)),
  );

interface ScreenPoint {
  x: number;
  y: number;
}

const toWorldPixels = (
  longitude: number,
  latitude: number,
  zoom: number,
): ScreenPoint => {
  const worldSize = MAPLIBRE_TILE_SIZE * Math.pow(2, zoom);
  const latitudeRadians = (latitude * Math.PI) / 180;
  const mercatorY =
    Math.log(Math.tan(Math.PI / 4 + latitudeRadians / 2)) / (2 * Math.PI);
  return {
    x: ((longitude + 180) / 360) * worldSize,
    y: (0.5 - mercatorY) * worldSize,
  };
};

interface Bubble {
  cluster: StopPlaceCluster;
  point: ScreenPoint;
  diameter: number;
}

const toBubble = (cluster: StopPlaceCluster, zoom: number): Bubble => ({
  cluster,
  point: toWorldPixels(cluster.longitude, cluster.latitude, zoom),
  diameter: clusterDiameter(cluster.count),
});

const areTooClose = (first: Bubble, second: Bubble) =>
  Math.hypot(first.point.x - second.point.x, first.point.y - second.point.y) <
  Math.max(
    (first.diameter + second.diameter) / 2 + MIN_GAP_PIXELS,
    MERGE_RADIUS_PIXELS,
  );

/** Count-weighted mean position and the union of the bounds give the exact values for all members */
const combine = (members: StopPlaceCluster[]): StopPlaceCluster => {
  const count = members.reduce((sum, member) => sum + member.count, 0);
  const weightedMean = (value: (member: StopPlaceCluster) => number) =>
    members.reduce((sum, member) => sum + member.count * value(member), 0) /
    count;
  return {
    count,
    longitude: weightedMean((member) => member.longitude),
    latitude: weightedMean((member) => member.latitude),
    lonMin: Math.min(...members.map((member) => member.lonMin)),
    latMin: Math.min(...members.map((member) => member.latMin)),
    lonMax: Math.max(...members.map((member) => member.lonMax)),
    latMax: Math.max(...members.map((member) => member.latMax)),
  };
};

const byCountThenPosition = (
  first: StopPlaceCluster,
  second: StopPlaceCluster,
) =>
  second.count - first.count ||
  first.longitude - second.longitude ||
  first.latitude - second.latitude;

/** One pass: the largest free cluster takes every free cluster that its bubble would touch */
const mergePass = (
  clusters: StopPlaceCluster[],
  zoom: number,
): StopPlaceCluster[] => {
  const bubbles = [...clusters]
    .sort(byCountThenPosition)
    .map((cluster) => toBubble(cluster, zoom));
  const taken = new Array<boolean>(bubbles.length).fill(false);
  const result: StopPlaceCluster[] = [];
  bubbles.forEach((bubble, index) => {
    if (taken[index]) return;
    taken[index] = true;
    const members = [bubble.cluster];
    for (let other = index + 1; other < bubbles.length; other++) {
      if (taken[other] || !areTooClose(bubble, bubbles[other])) continue;
      taken[other] = true;
      members.push(bubbles[other].cluster);
    }
    result.push(members.length === 1 ? bubble.cluster : combine(members));
  });
  return result;
};

/**
 * Merges clusters whose bubbles would touch or overlap at the given MapLibre zoom.
 * A merged bubble is larger and can move, so passes repeat until no bubbles touch.
 */
export const mergeOverlappingClusters = (
  clusters: StopPlaceCluster[],
  zoom: number,
): StopPlaceCluster[] => {
  let current = clusters;
  for (;;) {
    const merged = mergePass(current, zoom);
    if (merged.length === current.length) return merged;
    current = merged;
  }
};
