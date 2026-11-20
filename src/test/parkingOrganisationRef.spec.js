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
import StopPlaceActions from "../actions/StopPlaceActions";
import helpers from "../modelUtils/mapToQueryVariables";
import Parking from "../models/Parking";
import {
  hasInvalidOrganisationRef,
  isValidOrganisationRef,
} from "../models/parkingOrganisationRef";
import stopPlaceReducer from "../reducers/stopPlaceReducer";

window.config = {
  defaultLanguageCode: "nor",
};

const REFERENCE = "FSR:Operator:0101263-6";

const serverParking = (overrides = {}) => ({
  id: "NSR:Parking:1",
  name: { value: "Test parking" },
  geometry: { coordinates: [10, 60] },
  parkingVehicleTypes: ["car"],
  parkingProperties: [],
  validBetween: {},
  totalCapacity: 10,
  accessibilityAssessment: null,
  ...overrides,
});

const saveVariables = (clientParking) =>
  helpers.mapParkingToVariables([clientParking], "NSR:StopPlace:1")[0];

describe("Parking model - organisationRef", () => {
  test("toClient carries the stored reference", () => {
    const client = new Parking(
      serverParking({ organisationRef: REFERENCE }),
    ).toClient();

    expect(client.organisationRef).toBe(REFERENCE);
  });

  test("toClient leaves the reference undefined when Tiamat holds none", () => {
    const client = new Parking(serverParking()).toClient();

    expect(client.organisationRef).toBeUndefined();
  });
});

describe("mapParkingToVariables - organisationRef", () => {
  const clientWith = (organisationRef) => ({
    ...new Parking(serverParking()).toClient(),
    organisationRef,
  });

  test("sends the reference when set", () => {
    expect(saveVariables(clientWith(REFERENCE)).organisationRef).toBe(
      REFERENCE,
    );
  });

  test("A6: sends null when absent", () => {
    const variables = saveVariables(clientWith(undefined));

    expect(variables).toHaveProperty("organisationRef", null);
  });

  test("A6: sends null when empty or only spaces", () => {
    expect(saveVariables(clientWith(""))).toHaveProperty(
      "organisationRef",
      null,
    );
    expect(saveVariables(clientWith("   "))).toHaveProperty(
      "organisationRef",
      null,
    );
  });

  test("trims leading and trailing spaces", () => {
    expect(saveVariables(clientWith(`  ${REFERENCE} `)).organisationRef).toBe(
      REFERENCE,
    );
  });

  test("a stored reference survives a save that does not touch it", () => {
    const client = new Parking(
      serverParking({ organisationRef: REFERENCE }),
    ).toClient();

    expect(saveVariables(client).organisationRef).toBe(REFERENCE);
  });
});

describe("stopPlaceReducer - changeParkingOrganisationRef", () => {
  test("sets the reference on the parking at the given index", () => {
    const state = {
      current: {
        parking: [
          { name: "first", organisationRef: "FSR:Operator:1" },
          { name: "second" },
        ],
      },
    };
    const dispatched = [];
    StopPlaceActions.changeParkingOrganisationRef(
      1,
      REFERENCE,
    )((action) => dispatched.push(action));

    const next = stopPlaceReducer(state, dispatched[0]);

    expect(next.current.parking[1].organisationRef).toBe(REFERENCE);
    expect(next.current.parking[0].organisationRef).toBe("FSR:Operator:1");
    expect(next.stopHasBeenModified).toBe(true);
  });

  test("marks only the edited parking as changed", () => {
    const state = {
      current: {
        parking: [
          { name: "first", organisationRefChanged: false },
          { name: "second", organisationRefChanged: false },
        ],
      },
    };
    const dispatched = [];
    StopPlaceActions.changeParkingOrganisationRef(
      1,
      REFERENCE,
    )((action) => dispatched.push(action));

    const next = stopPlaceReducer(state, dispatched[0]);

    expect(next.current.parking[1].organisationRefChanged).toBe(true);
    expect(next.current.parking[0].organisationRefChanged).toBe(false);
  });
});

describe("Parking model - organisationRefChanged", () => {
  test("toClient starts with the reference unchanged", () => {
    const client = new Parking(
      serverParking({ organisationRef: "not a reference" }),
    ).toClient();

    expect(client.organisationRefChanged).toBe(false);
  });
});

describe("isValidOrganisationRef", () => {
  test.each([
    ["a business ID with a hyphen", "FSR:Operator:0201256-6"],
    ["an ID with letters and digits", "NSR:Operator:abc_12-X"],
  ])("accepts %s", (_, value) => {
    expect(isValidOrganisationRef(value)).toBe(true);
  });

  test.each([
    ["a bare id", "0201256-6"],
    ["a lower-case codespace", "fsr:Operator:1"],
    ["a wrong type", "FSR:Authority:1"],
    ["an empty id", "FSR:Operator:"],
    ["a space inside", "FSR:Operator:1 2"],
    ["a two-letter codespace", "FS:Operator:1"],
  ])("rejects %s", (_, value) => {
    expect(isValidOrganisationRef(value)).toBe(false);
  });

  test("ignores spaces around the value, as the save does", () => {
    expect(isValidOrganisationRef(`  ${REFERENCE} `)).toBe(true);
  });

  test("treats a blank value as valid", () => {
    expect(isValidOrganisationRef("")).toBe(true);
    expect(isValidOrganisationRef("   ")).toBe(true);
    expect(isValidOrganisationRef(undefined)).toBe(true);
    expect(isValidOrganisationRef(null)).toBe(true);
  });
});

describe("hasInvalidOrganisationRef", () => {
  test("blocks a save when the editor changed the value to an invalid one", () => {
    expect(
      hasInvalidOrganisationRef([
        { organisationRef: "nonsense", organisationRefChanged: true },
      ]),
    ).toBe(true);
  });

  test("does not block a save for an invalid stored value the editor did not change", () => {
    expect(
      hasInvalidOrganisationRef([
        { organisationRef: "nonsense", organisationRefChanged: false },
      ]),
    ).toBe(false);
  });

  test("does not block a save when the editor changed the value to a valid one", () => {
    expect(
      hasInvalidOrganisationRef([
        { organisationRef: REFERENCE, organisationRefChanged: true },
      ]),
    ).toBe(false);
  });

  test("does not block a save when the editor cleared the value", () => {
    expect(
      hasInvalidOrganisationRef([
        { organisationRef: "", organisationRefChanged: true },
      ]),
    ).toBe(false);
  });

  test("looks at every parking and at no parking", () => {
    expect(
      hasInvalidOrganisationRef([
        { organisationRef: REFERENCE, organisationRefChanged: true },
        { organisationRef: "nonsense", organisationRefChanged: true },
      ]),
    ).toBe(true);
    expect(hasInvalidOrganisationRef(undefined)).toBe(false);
  });
});
