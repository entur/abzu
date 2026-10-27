import * as types from "../../actions/Types";
import stopPlaceReducer from "../../reducers/stopPlaceReducer";
import { CoveredEnum } from "../../models/Covered";

const stateWithTwoParkings = () => ({
  current: { parking: [{ id: "NSR:Parking:1" }, { id: "NSR:Parking:2" }] },
});

describe("stop place reducer - parking covered", () => {
  test("sets covered on the parking at the given index only", () => {
    const state = stateWithTwoParkings();
    const next = stopPlaceReducer(state, {
      type: types.CHANGED_PARKING_COVERED,
      payload: { index: 1, covered: "indoors" },
    });

    expect(next.current.parking[1].covered).toBe("indoors");
    expect(next.current.parking[0].covered).toBeUndefined();
    expect(next.stopHasBeenModified).toBe(true);
  });

  test("does not mutate the previous state", () => {
    const state = stateWithTwoParkings();
    stopPlaceReducer(state, {
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
