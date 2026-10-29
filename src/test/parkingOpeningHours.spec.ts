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

import { beforeAll, describe, expect, test } from "vitest";
import * as types from "../actions/Types";
import {
  availabilityConditionToInput,
  availabilityConditionToRow,
  hasInvalidAvailabilityConditions,
} from "../models/availabilityCondition";
import queryHelpers from "../modelUtils/mapToQueryVariables";
import Parking from "../models/Parking";
import stopPlaceReducer from "../reducers/stopPlaceReducer";

const BUSINESS_DAY = "FSR:DayType:BusinessDay";
const SATURDAY = "FSR:DayType:Saturday";
const STOP_PLACE_REF = "NSR:StopPlace:1";

const storedParking = (availabilityConditions?: unknown[]) => ({
  id: "NSR:Parking:1",
  name: { value: "Test parking" },
  parkingVehicleTypes: ["car"],
  parkingProperties: [],
  totalCapacity: 40,
  availabilityConditions,
});

const toVariables = (clientParking: Record<string, unknown>) =>
  queryHelpers.mapParkingToVariables([clientParking], STOP_PLACE_REF)[0];

const loadedClientParking = (availabilityConditions: unknown[]) =>
  new Parking(storedParking(availabilityConditions)).toClient();

beforeAll(() => {
  (window as any).config = {
    ...(window as any).config,
    defaultLanguageCode: "nb",
  };
});

describe("Parking model - opening hours are read", () => {
  test("copies the stored conditions and starts unchanged", () => {
    const client = loadedClientParking([
      {
        dayTypeRef: BUSINESS_DAY,
        isAvailable: true,
        startTime: "08:00",
        endTime: "16:00",
        dayOffset: 0,
      },
    ]);

    expect(client.availabilityConditions).toHaveLength(1);
    expect(client.availabilityConditions[0]).toMatchObject({
      dayTypeRef: BUSINESS_DAY,
      isAvailable: true,
      startTime: "08:00",
      endTime: "16:00",
    });
    expect(client.availabilityConditionsChanged).toBe(false);
  });

  test("shows 00:00 with dayOffset 1 as end of day", () => {
    const [row] = loadedClientParking([
      {
        dayTypeRef: SATURDAY,
        isAvailable: true,
        startTime: "00:00",
        endTime: "00:00",
        dayOffset: 1,
      },
    ]).availabilityConditions;

    expect(row.endOfDay).toBe(true);
    expect(row.nextDay).toBe(false);
  });

  test("shows an until earlier than from with dayOffset 1 as next day", () => {
    const [row] = loadedClientParking([
      {
        dayTypeRef: BUSINESS_DAY,
        isAvailable: true,
        startTime: "22:00",
        endTime: "06:00",
        dayOffset: 1,
      },
    ]).availabilityConditions;

    expect(row.endOfDay).toBe(false);
    expect(row.nextDay).toBe(true);
  });

  test("keeps 23:59 with dayOffset 0 as a plain time", () => {
    const [row] = loadedClientParking([
      {
        dayTypeRef: BUSINESS_DAY,
        isAvailable: true,
        startTime: "00:00",
        endTime: "23:59",
        dayOffset: 0,
      },
    ]).availabilityConditions;

    expect(row.endOfDay).toBe(false);
    expect(row.endTime).toBe("23:59");
  });

  test("an absent list stays undefined", () => {
    expect(
      new Parking(storedParking()).toClient().availabilityConditions,
    ).toBeUndefined();
  });
});

describe("mapParkingToVariables - opening hours are saved", () => {
  const changed = (availabilityConditions: unknown[] | undefined) => ({
    ...loadedClientParking([]),
    availabilityConditions,
    availabilityConditionsChanged: true,
  });

  test("sends every row, with 24:00 for end of day and no dayOffset", () => {
    const variables = toVariables(
      changed([
        {
          dayTypeRef: BUSINESS_DAY,
          isAvailable: true,
          startTime: "08:00",
          endTime: "16:00",
        },
        {
          dayTypeRef: SATURDAY,
          isAvailable: true,
          startTime: "00:00",
          endTime: "00:00",
          endOfDay: true,
        },
      ]),
    );

    expect(variables.availabilityConditions).toEqual([
      {
        dayTypeRef: BUSINESS_DAY,
        isAvailable: true,
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        dayTypeRef: SATURDAY,
        isAvailable: true,
        startTime: "00:00",
        endTime: "24:00",
      },
    ]);
  });

  test("sends dayOffset 1 for an until earlier than from", () => {
    const variables = toVariables(
      changed([
        {
          dayTypeRef: BUSINESS_DAY,
          isAvailable: true,
          startTime: "22:00",
          endTime: "06:00",
        },
      ]),
    );

    expect(variables.availabilityConditions[0]).toEqual({
      dayTypeRef: BUSINESS_DAY,
      isAvailable: true,
      startTime: "22:00",
      endTime: "06:00",
      dayOffset: 1,
    });
  });

  test("a closed row sends isAvailable false and no times", () => {
    const variables = toVariables(
      changed([
        {
          dayTypeRef: SATURDAY,
          isAvailable: false,
          startTime: "08:00",
          endTime: "16:00",
        },
      ]),
    );

    expect(variables.availabilityConditions).toEqual([
      { dayTypeRef: SATURDAY, isAvailable: false },
    ]);
  });

  test("deleting every row sends an empty list", () => {
    expect(toVariables(changed([])).availabilityConditions).toEqual([]);
  });

  test("a list that was never loaded omits the field", () => {
    const variables = toVariables(changed(undefined));

    expect("availabilityConditions" in variables).toBe(false);
  });

  test("a loaded list with the flag false omits the field", () => {
    const client = loadedClientParking([
      {
        dayTypeRef: BUSINESS_DAY,
        isAvailable: true,
        startTime: "00:00",
        endTime: "00:00",
        dayOffset: 1,
      },
    ]);

    const variables = toVariables(client);

    expect("availabilityConditions" in variables).toBe(false);
    expect("availabilityConditionsChanged" in variables).toBe(false);
  });

  test("never sends the change flag", () => {
    const variables = toVariables(changed([]));

    expect("availabilityConditionsChanged" in variables).toBe(false);
  });
});

describe("opening hours validity gates the save", () => {
  const valid = {
    dayTypeRef: BUSINESS_DAY,
    isAvailable: true,
    startTime: "08:00",
    endTime: "16:00",
    endOfDay: false,
    nextDay: false,
  };
  const parkingWith = (...rows: unknown[]) => ({
    availabilityConditions: rows as never[],
  });

  test("accepts valid rows, a closed row and an absent list", () => {
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith(valid, { ...valid, isAvailable: false, startTime: "" }),
        {},
      ]),
    ).toBe(false);
  });

  test("rejects an empty day type", () => {
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith({ ...valid, dayTypeRef: "" }),
      ]),
    ).toBe(true);
  });

  test("rejects an until equal to from, and accepts end of day", () => {
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith({ ...valid, endTime: "08:00" }),
      ]),
    ).toBe(true);
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith({ ...valid, endTime: "", endOfDay: true }),
      ]),
    ).toBe(false);
  });

  test("rejects an open row without an until", () => {
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith({ ...valid, endTime: "" }),
      ]),
    ).toBe(true);
  });

  test("accepts an overnight row", () => {
    expect(
      hasInvalidAvailabilityConditions([
        parkingWith({ ...valid, startTime: "22:00", endTime: "06:00" }),
      ]),
    ).toBe(false);
  });
});

describe("availability condition - day offsets", () => {
  test("00:00 with dayOffset 2 is not end of day and keeps the offset", () => {
    const row = availabilityConditionToRow({
      dayTypeRef: SATURDAY,
      startTime: "08:00",
      endTime: "00:00",
      dayOffset: 2,
    });

    expect(row.endOfDay).toBe(false);
    expect(row.keptDayOffset).toBe(2);
    expect(availabilityConditionToInput(row)).toMatchObject({
      endTime: "00:00",
      dayOffset: 2,
    });
  });

  test("00:00 with dayOffset 1 is end of day", () => {
    const row = availabilityConditionToRow({
      dayTypeRef: SATURDAY,
      startTime: "08:00",
      endTime: "00:00",
      dayOffset: 1,
    });

    expect(row.endOfDay).toBe(true);
    expect(row.keptDayOffset).toBeUndefined();
  });
});

describe("stop place reducer - opening hours", () => {
  const state = () => ({
    current: {
      parking: [
        loadedClientParking([
          {
            dayTypeRef: BUSINESS_DAY,
            isAvailable: true,
            startTime: "08:00",
            endTime: "16:00",
            dayOffset: 0,
          },
          {
            dayTypeRef: SATURDAY,
            isAvailable: true,
            startTime: "09:00",
            endTime: "12:00",
            dayOffset: 0,
          },
        ]),
        loadedClientParking([]),
      ],
    },
  });

  test("add appends one row to the target parking and sets the flag", () => {
    const before = state();
    const after = stopPlaceReducer(before as never, {
      type: types.ADDED_PARKING_AVAILABILITY_CONDITION,
      payload: { index: 1 },
    });

    expect(after.current.parking[1].availabilityConditions).toHaveLength(1);
    expect(after.current.parking[1].availabilityConditionsChanged).toBe(true);
    expect(after.current.parking[0]).toEqual(before.current.parking[0]);
    expect(after.stopHasBeenModified).toBe(true);
  });

  test("change edits only the target row", () => {
    const after = stopPlaceReducer(state() as never, {
      type: types.CHANGED_PARKING_AVAILABILITY_CONDITION,
      payload: { index: 0, conditionIndex: 1, changes: { startTime: "10:00" } },
    });
    const rows = after.current.parking[0].availabilityConditions;

    expect(rows[0].startTime).toBe("08:00");
    expect(rows[1].startTime).toBe("10:00");
    expect(rows[1].endTime).toBe("12:00");
    expect(after.current.parking[0].availabilityConditionsChanged).toBe(true);
    expect(after.current.parking[1].availabilityConditionsChanged).toBe(false);
  });

  test("remove deletes only the target row", () => {
    const after = stopPlaceReducer(state() as never, {
      type: types.REMOVED_PARKING_AVAILABILITY_CONDITION,
      payload: { index: 0, conditionIndex: 0 },
    });
    const rows = after.current.parking[0].availabilityConditions;

    expect(rows).toHaveLength(1);
    expect(rows[0].dayTypeRef).toBe(SATURDAY);
    expect(after.current.parking[0].availabilityConditionsChanged).toBe(true);
  });
});
