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
import Parking from "../models/Parking";
import helpers from "../modelUtils/mapToQueryVariables";
import { parkingLayouts } from "../models/parkingLayout";
import { parkingPaymentProcesses } from "../models/parkingPaymentProcess";

const baseParking = (overrides = {}) => ({
  id: "NSR:Parking:1",
  name: { value: "Test parking" },
  parkingVehicleTypes: ["car"],
  parkingProperties: [],
  totalCapacity: 40,
  ...overrides,
});

describe("Parking model - layout enumeration", () => {
  test("offers only the layout values the NeTEx Nordic profile allows", () => {
    expect(parkingLayouts.slice().sort()).toEqual(
      ["multistorey", "openSpace", "roadside", "underground"].sort(),
    );
  });
});

describe("Parking model - toClient carries the facility fields", () => {
  test("carries secure and lighting", () => {
    const client = new Parking(
      baseParking({
        secure: true,
        lighting: "wellLit",
      }),
    ).toClient();

    expect(client.secure).toBe(true);
    expect(client.lighting).toBe("wellLit");
  });

  test("leaves the facility fields undefined when Tiamat holds none", () => {
    const client = new Parking(baseParking()).toClient();

    expect(client.secure).toBeUndefined();
    expect(client.lighting).toBeUndefined();
  });
});

const parkAndRideWithOnlyAllUsersSpaces = {
  id: "NSR:Parking:1",
  name: { value: "Park and ride without disabled spaces" },
  parkingVehicleTypes: ["car"],
  parkingProperties: [
    {
      spaces: [
        {
          parkingUserType: "allUsers",
          numberOfSpaces: 2049,
          numberOfSpacesWithRechargePoint: null,
        },
      ],
    },
  ],
};

const parkAndRideWithAllUserTypes = {
  id: "NSR:Parking:2",
  name: { value: "Park and ride with disabled spaces" },
  parkingVehicleTypes: ["car"],
  parkingProperties: [
    {
      spaces: [
        {
          parkingUserType: "allUsers",
          numberOfSpaces: 100,
          numberOfSpacesWithRechargePoint: 4,
        },
        { parkingUserType: "registeredDisabled", numberOfSpaces: 6 },
      ],
    },
  ],
};

const carParkingWithoutParkingProperties = {
  id: "NSR:Parking:3",
  name: { value: "Park and ride without parking properties" },
  parkingVehicleTypes: ["car"],
  totalCapacity: 40,
};

const carParkingWithoutSpaces = {
  id: "NSR:Parking:4",
  name: { value: "Park and ride without a capacity list" },
  parkingVehicleTypes: ["car"],
  totalCapacity: 12,
  parkingProperties: [{ spaces: null }],
};

const bicycleParking = {
  id: "NSR:Parking:5",
  name: { value: "Bicycle parking" },
  parkingVehicleTypes: ["pedalCycle"],
  parkingProperties: [
    { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 72 }] },
  ],
};

describe("Parking - models", () => {
  test("returns 0 when the requested user type has no spaces", () => {
    const parking = new Parking(parkAndRideWithOnlyAllUsersSpaces);

    expect(parking.numberOfSpacesForRegisteredDisabledUserType).toEqual(0);
  });

  test("keeps a null field value when the user type does match", () => {
    const parking = new Parking(parkAndRideWithOnlyAllUsersSpaces);

    expect(parking.numberOfSpacesWithRechargePoint).toBeNull();
  });

  test("maps a park and ride that has no disabled spaces", () => {
    const clientParking = new Parking(
      parkAndRideWithOnlyAllUsersSpaces,
    ).toClient();

    expect(clientParking.numberOfSpaces).toEqual(2049);
    expect(clientParking.numberOfSpacesWithRechargePoint).toBeNull();
    expect(clientParking.numberOfSpacesForRegisteredDisabledUserType).toEqual(
      0,
    );
  });

  test("keeps the counts of a park and ride that has every user type", () => {
    const clientParking = new Parking(parkAndRideWithAllUserTypes).toClient();

    expect(clientParking.numberOfSpaces).toEqual(100);
    expect(clientParking.numberOfSpacesWithRechargePoint).toEqual(4);
    expect(clientParking.numberOfSpacesForRegisteredDisabledUserType).toEqual(
      6,
    );
  });

  test("falls back to the total capacity when there are no parking properties", () => {
    const clientParking = new Parking(
      carParkingWithoutParkingProperties,
    ).toClient();

    expect(clientParking.numberOfSpaces).toEqual(40);
    expect(clientParking.numberOfSpacesWithRechargePoint).toEqual(0);
    expect(clientParking.numberOfSpacesForRegisteredDisabledUserType).toEqual(
      0,
    );
  });

  test("maps a park and ride whose parking properties carry no capacity list", () => {
    const clientParking = new Parking(carParkingWithoutSpaces).toClient();

    expect(clientParking.numberOfSpaces).toEqual(0);
    expect(clientParking.numberOfSpacesForRegisteredDisabledUserType).toEqual(
      0,
    );
  });

  test("leaves the space counts empty for a parking that is not a park and ride", () => {
    const clientParking = new Parking(bicycleParking).toClient();

    expect(clientParking.parkingType).toEqual("bikeParking");
    expect(clientParking.numberOfSpaces).toBeNull();
    expect(clientParking.numberOfSpacesWithRechargePoint).toBeNull();
    expect(
      clientParking.numberOfSpacesForRegisteredDisabledUserType,
    ).toBeNull();
  });
});

window.config = {
  defaultLanguageCode: "nor",
};

const mockParking = (overrides = {}) => ({
  id: "NSR:Parking:1",
  name: { value: "Test parking" },
  geometry: { coordinates: [10, 60] },
  parkingVehicleTypes: ["car"],
  validBetween: {},
  totalCapacity: 10,
  accessibilityAssessment: null,
  ...overrides,
});

describe("Parking model - paymentMethods", () => {
  test("T1: toClient carries paymentMethods", () => {
    const parking = new Parking(
      mockParking({ paymentMethods: ["cash", "debitCard"] }),
    );
    expect(parking.toClient().paymentMethods).toEqual(["cash", "debitCard"]);
  });

  test("T3: a save that does not touch the field keeps the stored values", () => {
    const parking = new Parking(
      mockParking({
        paymentMethods: ["cash", "debitCard"],
        totalCapacity: 20,
      }),
    );
    const client = parking.toClient();
    expect(client.paymentMethods).toEqual(["cash", "debitCard"]);
    expect(client.totalCapacity).toBe(20);
  });
});

describe("mapParkingToVariables - paymentMethods", () => {
  test("T2: the save path sends paymentMethods", () => {
    const [variables] = helpers.mapParkingToVariables(
      [mockParking({ paymentMethods: ["cash", "debitCard"] })],
      "NSR:StopPlace:1",
    );
    expect(variables.paymentMethods).toEqual(["cash", "debitCard"]);
  });

  test("T4: an emptied list reaches Tiamat as an empty list", () => {
    const [variables] = helpers.mapParkingToVariables(
      [mockParking({ paymentMethods: [] })],
      "NSR:StopPlace:1",
    );
    expect(variables.paymentMethods).toEqual([]);
  });

  test("T5: a value the editor cannot label survives a save", () => {
    const [variables] = helpers.mapParkingToVariables(
      [mockParking({ paymentMethods: ["voucher", "cash"] })],
      "NSR:StopPlace:1",
    );
    expect(variables.paymentMethods).toEqual(["voucher", "cash"]);
  });
});

describe("parkingPaymentProcess model", () => {
  test("T6: offers Tiamat's nine values and falls back on a tenth", () => {
    expect(parkingPaymentProcesses).toHaveLength(9);
    expect(parkingPaymentProcesses).toContain("payAtExitBoothManualCollection");

    const [variables] = helpers.mapParkingToVariables(
      [mockParking({ parkingPaymentProcess: ["payByPlate"] })],
      "NSR:StopPlace:1",
    );
    expect(variables.parkingPaymentProcess).toEqual(["payByPlate"]);
  });
});
