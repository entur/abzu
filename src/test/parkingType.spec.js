import { describe, expect, it } from "vitest";
import Parking from "../models/Parking";
import PARKING_TYPE, { parkingTitleMessageId } from "../models/parkingType";
import mapToClient from "../modelUtils/mapToClient";
import { parkingVehicleTypeLabel } from "../models/parkingVehicleType";

const makeParking = ({
  parkingType,
  parkingVehicleTypes = [],
  parkingProperties,
}) =>
  new Parking({
    id: "NSR:Parking:1",
    name: { value: "Test" },
    parkingType,
    parkingVehicleTypes,
    parkingProperties,
    parkingPaymentProcess: [],
    validBetween: null,
  });

// The shape Abzu itself writes for a bicycle parking: an allUsers entry and
// nothing else. See mapToQueryVariables.js.
const bicycleSpaces = [
  { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 10 }] },
];

describe("Parking field-set predicate", () => {
  // One case per combination of stored type and vehicle types.
  const rows = [
    ["parkAndRide", ["car"], true],
    ["parkAndRide", ["pedalCycle"], true],
    ["urbanParking", ["car"], true],
    ["roadside", ["pedalCycle"], true],
    [undefined, ["car"], true],
    [undefined, ["pedalCycle"], false],
    [undefined, [], false],
  ];

  it.each(rows)(
    "stored %s with vehicles %j gives hasFullFieldSet %s",
    (storedType, vehicles, expected) => {
      const parking = makeParking({
        parkingType: storedType,
        parkingVehicleTypes: vehicles,
      });

      expect(parking.hasFullFieldSet).toBe(expected);
      expect(parking.toClient().hasFullFieldSet).toBe(expected);
    },
  );

  it("reads the stored type instead of guessing it", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["pedalCycle"],
    });

    expect(parking.storedParkingType).toBe("parkAndRide");
    expect(parking.guessedParkingType).toBe("bikeParking");
    expect(parking.parkingType).toBe("parkAndRide");
  });

  it("falls back to the guess when Tiamat stores no type", () => {
    const parking = makeParking({ parkingVehicleTypes: ["pedalCycle"] });

    expect(parking.storedParkingType).toBeUndefined();
    expect(parking.parkingType).toBe("bikeParking");
  });
});

describe("Parking vehicle signal", () => {
  it("reports a bicycle parking that Tiamat stores as parkAndRide", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["pedalCycle"],
    });

    expect(parking.isForPedalCycle).toBe(true);
    expect(parking.toClient().isForPedalCycle).toBe(true);
  });

  it("does not report a car parking as a bicycle parking", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["car"],
    });

    expect(parking.isForPedalCycle).toBe(false);
  });

  it("reports both vehicles when a parking carries both", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["car", "pedalCycle"],
    });

    expect(parking.isForPedalCycle).toBe(true);
    expect(parking.hasFullFieldSet).toBe(true);
  });
});

describe("Parking title message id", () => {
  it("keeps the two titled types", () => {
    expect(parkingTitleMessageId("parkAndRide")).toBe(
      "parking_item_title_parkAndRide",
    );
    expect(parkingTitleMessageId("bikeParking")).toBe(
      "parking_item_title_bikeParking",
    );
  });

  it("falls back for a NeTEx type that has no title", () => {
    expect(parkingTitleMessageId("roadside")).toBe(
      "parking_item_title_unknown",
    );
    expect(parkingTitleMessageId("unknown")).toBe("parking_item_title_unknown");
    expect(parkingTitleMessageId(undefined)).toBe("parking_item_title_unknown");
  });
});

describe("Parking space lookup with a partial spaces array", () => {
  // A parking with a stored type and only an allUsers entry gets the full
  // field set, so toClient() reads a registeredDisabled entry that is not there.
  it("maps a bicycle parking that holds only an allUsers entry", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["pedalCycle"],
      parkingProperties: bicycleSpaces,
    });

    expect(parking.hasFullFieldSet).toBe(true);

    const client = parking.toClient();

    expect(client.numberOfSpaces).toBe(10);
    expect(client.numberOfSpacesForRegisteredDisabledUserType).toBeUndefined();
    expect(client.numberOfSpacesWithRechargePoint).toBeUndefined();
  });

  it("reads both entries when the parking holds both", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["car"],
      parkingProperties: [
        {
          spaces: [
            { parkingUserType: "allUsers", numberOfSpaces: 20 },
            { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
          ],
        },
      ],
    });

    const client = parking.toClient();

    expect(client.numberOfSpaces).toBe(20);
    expect(client.numberOfSpacesForRegisteredDisabledUserType).toBe(3);
  });

  it("gives a stored bikeParking type the full field set", () => {
    const parking = makeParking({
      parkingType: "bikeParking",
      parkingVehicleTypes: ["pedalCycle"],
      parkingProperties: bicycleSpaces,
    });

    expect(parking.hasFullFieldSet).toBe(true);
    expect(parking.isForPedalCycle).toBe(true);
    expect(parking.toClient().numberOfSpaces).toBe(10);
  });
});

describe("Parking vehicle type label", () => {
  const formatMessage = ({ id }) =>
    ({
      parking_vehicle_type_car: "Auto",
      parking_vehicle_type_motorcycle: "Moottoripyörä",
      parking_vehicle_type_pedalCycle: "Polkupyörä",
    })[id] ?? id;

  it("translates a type this repository names", () => {
    expect(parkingVehicleTypeLabel("car", formatMessage)).toBe("Auto");
    expect(parkingVehicleTypeLabel("pedalCycle", formatMessage)).toBe(
      "Polkupyörä",
    );
  });

  it("translates motorcycle", () => {
    expect(parkingVehicleTypeLabel("motorcycle", formatMessage)).toBe(
      "Moottoripyörä",
    );
  });

  // `camperCar` is a NeTEx ParkingVehicleEnumeration value that this
  // repository does not name.
  it("shows a NeTEx type this repository does not name", () => {
    expect(parkingVehicleTypeLabel("camperCar", formatMessage)).toBe(
      "camperCar",
    );
  });
});

describe("New parking element", () => {
  const addParking = (type) =>
    mapToClient.updateCurrentWithNewElement(
      { parking: [] },
      { type, position: [60.1, 24.9] },
    ).parking[0];

  it("gives a new park-and-ride parking the full field set", () => {
    const parking = addParking(PARKING_TYPE.PARK_AND_RIDE);

    expect(parking.hasFullFieldSet).toBe(true);
    expect(parking.isForPedalCycle).toBe(false);
  });

  it("gives a new bicycle parking the reduced field set", () => {
    const parking = addParking(PARKING_TYPE.BIKE_PARKING);

    expect(parking.hasFullFieldSet).toBe(false);
    expect(parking.isForPedalCycle).toBe(true);
  });
});
