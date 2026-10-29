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
});
