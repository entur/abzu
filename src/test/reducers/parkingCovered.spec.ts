import { describe, expect, test } from "vitest";
import * as types from "../../actions/Types";
import stopPlaceReducer from "../../reducers/stopPlaceReducer";
import { CoveredEnum } from "../../models/Covered";

interface ParkingState {
  current: { parking: Array<{ id: string; covered?: string }> };
  stopHasBeenModified?: boolean;
}

// The reducer is untyped JS, so its state parameter is inferred from the
// default state. This cast keeps the test state minimal.
type ReducerState = Parameters<typeof stopPlaceReducer>[0];

const stateWithTwoParkings = (): ParkingState => ({
  current: { parking: [{ id: "NSR:Parking:1" }, { id: "NSR:Parking:2" }] },
});

const reduce = (state: ParkingState, action: object): ParkingState =>
  stopPlaceReducer(
    state as unknown as ReducerState,
    action,
  ) as unknown as ParkingState;

describe("stop place reducer - parking covered", () => {
  test("sets covered on the parking at the given index only", () => {
    const state = stateWithTwoParkings();
    const next = reduce(state, {
      type: types.CHANGED_PARKING_COVERED,
      payload: { index: 1, covered: "indoors" },
    });

    expect(next.current.parking[1].covered).toBe("indoors");
    expect(next.current.parking[0].covered).toBeUndefined();
    expect(next.stopHasBeenModified).toBe(true);
  });

  test("does not mutate the previous state", () => {
    const state = stateWithTwoParkings();
    reduce(state, {
      type: types.CHANGED_PARKING_COVERED,
      payload: { index: 0, covered: "mixed" },
    });

    expect(state.current.parking[0].covered).toBeUndefined();
  });
});

describe("Covered enum", () => {
  test("offers only the values the NeTEx Nordic profile allows", () => {
    expect(Object.values(CoveredEnum).sort()).toEqual(
      ["covered", "indoors", "mixed", "outdoors"].sort(),
    );
  });
});
