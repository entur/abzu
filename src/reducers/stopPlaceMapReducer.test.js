import { getStateByOperation } from "./stopPlaceReducerUtils";

const cluster = {
  count: 4,
  longitude: 10.75,
  latitude: 59.91,
  lonMin: 10.7,
  latMin: 59.9,
  lonMax: 10.8,
  latMax: 59.92,
};

const stop = {
  __typename: "StopPlace",
  id: "NSR:StopPlace:1",
  version: 1,
  name: { value: "Jernbanetorget", lang: "nor" },
  geometry: { coordinates: [10.75, 59.91] },
  stopPlaceType: "onstreetBus",
};

const mapResult = (data) => ({
  operationName: "stopPlaceMapBBox",
  result: { data: { stopPlaceMapBBox: data } },
});

describe("stopPlaceMapBBox", () => {
  it("stores clusters and clears neighbour stops when zoomed out", () => {
    const state = getStateByOperation(
      { neighbourStops: [{ id: "NSR:StopPlace:old" }] },
      mapResult({ clustered: true, clusters: [cluster], stopPlaces: [] }),
    );

    expect(state.stopPlaceClusters).toEqual([cluster]);
    expect(state.neighbourStops).toEqual([]);
  });

  it("stores stop places and clears clusters when zoomed in", () => {
    const state = getStateByOperation(
      { stopPlaceClusters: [cluster] },
      mapResult({ clustered: false, clusters: [], stopPlaces: [stop] }),
    );

    expect(state.stopPlaceClusters).toEqual([]);
    expect(state.neighbourStops.map((s) => s.id)).toEqual(["NSR:StopPlace:1"]);
  });
});

describe("stopPlaceMapBBox single-stop clusters", () => {
  it("shows a cluster of one as its stop place instead of as a cluster", () => {
    const single = {
      ...cluster,
      count: 1,
      stopPlace: { ...stop, id: "NSR:StopPlace:2" },
    };
    const state = getStateByOperation(
      {},
      mapResult({
        clustered: true,
        clusters: [{ ...cluster, stopPlace: null }, single],
        stopPlaces: [],
      }),
    );

    expect(state.stopPlaceClusters).toHaveLength(1);
    expect(state.stopPlaceClusters[0].count).toBe(4);
    expect(state.neighbourStops.map((s) => s.id)).toEqual(["NSR:StopPlace:2"]);
  });
});

describe("stopPlaceBBox", () => {
  it("clears clusters left over from the map query", () => {
    const state = getStateByOperation(
      { stopPlaceClusters: [cluster] },
      {
        operationName: "stopPlaceBBox",
        result: { data: { stopPlaceBBox: [stop] } },
      },
    );

    expect(state.stopPlaceClusters).toEqual([]);
    expect(state.neighbourStops).toHaveLength(1);
  });
});
