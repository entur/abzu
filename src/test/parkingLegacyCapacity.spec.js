import { beforeAll, describe, expect, test } from "vitest";
import * as types from "../actions/Types";
import helpers from "../modelUtils/mapToQueryVariables";
import Parking from "../models/Parking";
import { legacyCapacityFields } from "../models/parkingCapacity";
import stopPlaceReducer from "../reducers/stopPlaceReducer";

beforeAll(() => {
  window.config = { ...window.config, defaultLanguageCode: "nb" };
});

const entry = (fields) => ({
  parkingVehicleType: null,
  parkingUserType: null,
  parkingStayType: null,
  numberOfSpaces: null,
  numberOfSpacesWithRechargePoint: null,
  ...fields,
});

const loadParking = ({ parkingVehicleTypes = ["car"], spaces, ...rest }) =>
  new Parking({
    id: "NSR:Parking:1",
    name: { value: "Test" },
    parkingType: "parkAndRide",
    parkingVehicleTypes,
    parkingProperties: spaces ? [{ spaces }] : undefined,
    parkingPaymentProcess: [],
    validBetween: null,
    ...rest,
  }).toClient();

const stateWith = (parking) => ({
  current: { parking: [parking] },
  stopHasBeenModified: false,
});

const reduce = (state, type, payload) =>
  stopPlaceReducer(state, { type, payload });

const parkingOf = (state) => state.current.parking[0];

describe("legacy capacity fields derived from the capacity entries", () => {
  test("a loaded park-and-ride parking shows the first entry of each user type", () => {
    const parking = loadParking({
      spaces: [
        {
          parkingUserType: "allUsers",
          numberOfSpaces: 30,
          numberOfSpacesWithRechargePoint: 4,
        },
        { parkingUserType: "registeredDisabled", numberOfSpaces: 2 },
      ],
    });

    expect(parking).toMatchObject({
      numberOfSpaces: 30,
      numberOfSpacesWithRechargePoint: 4,
      numberOfSpacesForRegisteredDisabledUserType: 2,
      numberOfSpacesIsAmbiguous: false,
      numberOfSpacesForRegisteredDisabledUserTypeIsAmbiguous: false,
    });
  });

  test("a missing user type shows no count", () => {
    const parking = loadParking({
      spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
    });

    expect(parking.numberOfSpacesForRegisteredDisabledUserType).toBeUndefined();
  });

  test("a parking without parking properties shows its total capacity", () => {
    const parking = loadParking({ totalCapacity: 12 });

    expect(parking.numberOfSpaces).toBe(12);
  });

  test("two allUsers entries make the all-users count ambiguous", () => {
    const parking = loadParking({
      parkingVehicleTypes: ["car", "motorcycle"],
      spaces: [
        {
          parkingVehicleType: "car",
          parkingUserType: "allUsers",
          numberOfSpaces: 50,
        },
        {
          parkingVehicleType: "motorcycle",
          parkingUserType: "allUsers",
          numberOfSpaces: 5,
        },
      ],
    });

    expect(parking.numberOfSpacesIsAmbiguous).toBe(true);
  });

  test("a parking without the full field set holds no legacy counts", () => {
    expect(
      legacyCapacityFields({
        hasFullFieldSet: false,
        parkingProperties: [
          {
            spaces: [
              { parkingUserType: "allUsers", numberOfSpaces: 10 },
              { parkingUserType: "allUsers", numberOfSpaces: 5 },
            ],
          },
        ],
      }),
    ).toEqual({
      numberOfSpaces: null,
      numberOfSpacesWithRechargePoint: null,
      numberOfSpacesForRegisteredDisabledUserType: null,
      numberOfSpacesIsAmbiguous: true,
      numberOfSpacesForRegisteredDisabledUserTypeIsAmbiguous: false,
    });
  });
});

describe("legacy capacity actions edit the capacity entries", () => {
  test("the all-users count edits the first allUsers entry", () => {
    const state = reduce(
      stateWith(
        loadParking({
          spaces: [
            { parkingUserType: "allUsers", numberOfSpaces: 30 },
            { parkingUserType: "registeredDisabled", numberOfSpaces: 2 },
          ],
        }),
      ),
      types.CHANGED_PARKING_NUMBER_OF_SPACES,
      { index: 0, numberOfSpaces: 40 },
    );

    expect(parkingOf(state).capacityEntries).toEqual([
      entry({ parkingUserType: "allUsers", numberOfSpaces: 40 }),
      entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 2 }),
    ]);
    expect(parkingOf(state).numberOfSpaces).toBe(40);
    expect(state.stopHasBeenModified).toBe(true);
  });

  test("the recharge count edits the first allUsers entry", () => {
    const state = reduce(
      stateWith(
        loadParking({
          spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
        }),
      ),
      types.CHANGED_PARKING_NUMBER_OF_SPACES_WITH_RECHARGE_POINT,
      { index: 0, numberOfSpacesWithRechargePoint: 6 },
    );

    expect(parkingOf(state).capacityEntries).toEqual([
      entry({
        parkingUserType: "allUsers",
        numberOfSpaces: 30,
        numberOfSpacesWithRechargePoint: 6,
      }),
    ]);
    expect(parkingOf(state).numberOfSpacesWithRechargePoint).toBe(6);
  });

  test("the disabled count adds a registeredDisabled entry when none exists", () => {
    const state = reduce(
      stateWith(
        loadParking({
          spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
        }),
      ),
      types.CHANGED_PARKING_NUMBER_OF_SPACES_FOR_REGISTERED_DISABLED_USER_TYPE,
      { index: 0, numberOfSpacesForRegisteredDisabledUserType: 3 },
    );

    expect(parkingOf(state).capacityEntries).toEqual([
      entry({ parkingUserType: "allUsers", numberOfSpaces: 30 }),
      entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 3 }),
    ]);
    expect(parkingOf(state).numberOfSpacesForRegisteredDisabledUserType).toBe(
      3,
    );
  });

  test("an empty count adds no entry", () => {
    const state = reduce(
      stateWith(loadParking({ spaces: [] })),
      types.CHANGED_PARKING_NUMBER_OF_SPACES_FOR_REGISTERED_DISABLED_USER_TYPE,
      { index: 0, numberOfSpacesForRegisteredDisabledUserType: "" },
    );

    expect(parkingOf(state).capacityEntries).toEqual([]);
  });

  test("a legacy edit does not change the original state", () => {
    const original = stateWith(
      loadParking({
        spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
      }),
    );
    const snapshot = JSON.parse(JSON.stringify(original));

    reduce(original, types.CHANGED_PARKING_NUMBER_OF_SPACES, {
      index: 0,
      numberOfSpaces: 40,
    });

    expect(original).toEqual(snapshot);
  });
});

describe("a legacy edit keeps the stored total of a parking without entries", () => {
  const saveAfter = (type, payload) => {
    const state = reduce(
      stateWith(loadParking({ totalCapacity: 50 })),
      type,
      payload,
    );
    const [saved] = helpers.mapParkingToVariables(
      state.current.parking,
      "NSR:StopPlace:1",
    );
    return { parking: parkingOf(state), saved };
  };
  const savedSpaces = (saved) =>
    saved.parkingProperties[0].spaces.map((space) => [
      space.parkingUserType,
      space.numberOfSpaces,
      space.numberOfSpacesWithRechargePoint,
    ]);

  test("the recharging choice keeps the total as the all-users count", () => {
    const { parking, saved } = saveAfter(
      types.CHANGED_PARKING_NUMBER_OF_SPACES_WITH_RECHARGE_POINT,
      { index: 0, numberOfSpacesWithRechargePoint: 0 },
    );

    expect(parking.numberOfSpaces).toBe(50);
    expect(savedSpaces(saved)).toEqual([["allUsers", 50, 0]]);
  });

  test("a disabled count is added to the total", () => {
    const { parking, saved } = saveAfter(
      types.CHANGED_PARKING_NUMBER_OF_SPACES_FOR_REGISTERED_DISABLED_USER_TYPE,
      { index: 0, numberOfSpacesForRegisteredDisabledUserType: 5 },
    );

    expect(parking.numberOfSpaces).toBe(50);
    expect(savedSpaces(saved)).toEqual([
      ["allUsers", 50, null],
      ["registeredDisabled", 5, null],
    ]);
  });

  test("an all-users count replaces the total", () => {
    const { saved } = saveAfter(types.CHANGED_PARKING_NUMBER_OF_SPACES, {
      index: 0,
      numberOfSpaces: 40,
    });

    expect(savedSpaces(saved)).toEqual([["allUsers", 40, null]]);
  });
});

describe("modern capacity actions keep the legacy fields current", () => {
  test("a changed entry count shows in the legacy all-users count", () => {
    const state = reduce(
      stateWith(
        loadParking({
          spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
        }),
      ),
      types.CHANGED_PARKING_CAPACITY_ENTRY,
      { index: 0, entryIndex: 0, field: "numberOfSpaces", value: 45 },
    );

    expect(parkingOf(state).numberOfSpaces).toBe(45);
  });

  test("an added allUsers entry makes the legacy count ambiguous", () => {
    const state = reduce(
      stateWith(
        loadParking({
          spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 30 }],
        }),
      ),
      types.ADDED_PARKING_CAPACITY_ENTRY,
      { index: 0 },
    );

    expect(parkingOf(state).numberOfSpacesIsAmbiguous).toBe(true);
  });
});

describe("a legacy save keeps every capacity entry", () => {
  test("a car and motorcycle parking keeps both entries after a disabled-count edit", () => {
    const state = reduce(
      stateWith(
        loadParking({
          parkingVehicleTypes: ["car", "motorcycle"],
          spaces: [
            {
              parkingVehicleType: "car",
              parkingUserType: "allUsers",
              numberOfSpaces: 50,
            },
            {
              parkingVehicleType: "motorcycle",
              parkingUserType: "allUsers",
              numberOfSpaces: 5,
            },
          ],
        }),
      ),
      types.CHANGED_PARKING_NUMBER_OF_SPACES_FOR_REGISTERED_DISABLED_USER_TYPE,
      { index: 0, numberOfSpacesForRegisteredDisabledUserType: 2 },
    );

    const [saved] = helpers.mapParkingToVariables(
      state.current.parking,
      "NSR:StopPlace:1",
    );

    expect(
      saved.parkingProperties[0].spaces.map((space) => [
        space.parkingVehicleType,
        space.parkingUserType,
        space.numberOfSpaces,
      ]),
    ).toEqual([
      ["car", "allUsers", 50],
      ["motorcycle", "allUsers", 5],
      [null, "registeredDisabled", 2],
    ]);
  });
});
