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
import * as types from "../actions/Types";
import { capacityEntriesTotal } from "../models/parkingCapacity";
import stopPlaceReducer from "../reducers/stopPlaceReducer";

const entry = (fields) => ({
  parkingVehicleType: null,
  parkingUserType: null,
  parkingStayType: null,
  numberOfSpaces: null,
  numberOfSpacesWithRechargePoint: null,
  ...fields,
});

const stateWith = (capacityEntries) => ({
  current: { parking: [{ id: "NSR:Parking:1", capacityEntries }] },
  stopHasBeenModified: false,
});

const reduce = (state, type, payload) =>
  stopPlaceReducer(state, { type, payload });

const entriesOf = (state) => state.current.parking[0].capacityEntries;

describe("stopPlaceReducer - capacity entries", () => {
  test("a changed field reaches only its own entry", () => {
    const original = stateWith([
      entry({ parkingUserType: "allUsers", numberOfSpaces: 30 }),
      entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 3 }),
    ]);
    const snapshot = JSON.parse(JSON.stringify(original));
    const state = reduce(original, types.CHANGED_PARKING_CAPACITY_ENTRY, {
      index: 0,
      entryIndex: 1,
      field: "parkingVehicleType",
      value: "car",
    });

    expect(entriesOf(state)).toEqual([
      entry({ parkingUserType: "allUsers", numberOfSpaces: 30 }),
      entry({
        parkingUserType: "registeredDisabled",
        parkingVehicleType: "car",
        numberOfSpaces: 3,
      }),
    ]);
    expect(state.stopHasBeenModified).toBe(true);
    expect(original).toEqual(snapshot);
  });

  test("an added entry is for all users and holds no count", () => {
    const state = reduce(stateWith([]), types.ADDED_PARKING_CAPACITY_ENTRY, {
      index: 0,
    });

    expect(entriesOf(state)).toEqual([entry({ parkingUserType: "allUsers" })]);
    expect(state.stopHasBeenModified).toBe(true);
  });

  test("an entry can be added to a parking that holds no entry list", () => {
    const state = reduce(
      { current: { parking: [{ id: "NSR:Parking:1" }] } },
      types.ADDED_PARKING_CAPACITY_ENTRY,
      { index: 0 },
    );

    expect(entriesOf(state)).toHaveLength(1);
  });

  test("a removed entry leaves the others in order", () => {
    const state = reduce(
      stateWith([
        entry({ parkingVehicleType: "car" }),
        entry({ parkingVehicleType: "motorcycle" }),
        entry({ parkingVehicleType: "pedalCycle" }),
      ]),
      types.REMOVED_PARKING_CAPACITY_ENTRY,
      { index: 0, entryIndex: 1 },
    );

    expect(entriesOf(state).map((e) => e.parkingVehicleType)).toEqual([
      "car",
      "pedalCycle",
    ]);
    expect(state.stopHasBeenModified).toBe(true);
  });

  test("clearing the recharge counts sets a held count to zero and leaves an empty one empty", () => {
    const state = reduce(
      stateWith([
        entry({ numberOfSpaces: 30, numberOfSpacesWithRechargePoint: 4 }),
        entry({ numberOfSpaces: 3 }),
      ]),
      types.CLEARED_PARKING_RECHARGE_POINT_COUNTS,
      { index: 0 },
    );

    expect(
      entriesOf(state).map((e) => e.numberOfSpacesWithRechargePoint),
    ).toEqual([0, null]);
    expect(entriesOf(state).map((e) => e.numberOfSpaces)).toEqual([30, 3]);
  });
});

const parkingWith = (capacityEntries, totalCapacity, storedSpaces = []) => ({
  capacityEntries,
  totalCapacity,
  parkingProperties: [{ spaces: storedSpaces }],
});

describe("capacityEntriesTotal - the total a save produces", () => {
  test("sums the number of spaces of every entry", () => {
    const entries = [
      entry({ numberOfSpaces: 30 }),
      entry({ numberOfSpaces: "2" }),
      entry({ numberOfSpaces: 3 }),
    ];

    expect(capacityEntriesTotal(parkingWith(entries, 76, entries))).toBe(35);
  });

  test("ignores an entry with no count", () => {
    expect(
      capacityEntriesTotal(
        parkingWith(
          [entry({ numberOfSpaces: 30 }), entry({ numberOfSpaces: "" })],
          null,
        ),
      ),
    ).toBe(30);
  });

  test("gives no total when the entries sum to zero, as Tiamat does", () => {
    expect(
      capacityEntriesTotal(parkingWith([entry({ numberOfSpaces: 0 })], 40)),
    ).toBeNull();
    expect(capacityEntriesTotal(parkingWith([entry({})], 40))).toBeNull();
  });

  test("gives no total when the reviewer removed every stored entry", () => {
    expect(
      capacityEntriesTotal(
        parkingWith([], 40, [entry({ numberOfSpaces: 40 })]),
      ),
    ).toBeNull();
  });

  test("keeps the stored total when the parking never held an entry", () => {
    expect(capacityEntriesTotal(parkingWith([], 40))).toBe(40);
    expect(capacityEntriesTotal({ totalCapacity: 40 })).toBe(40);
    expect(capacityEntriesTotal({ capacityEntries: [] })).toBeNull();
  });
});
