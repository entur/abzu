import { describe, expect, it } from "vitest";
import Parking from "../models/Parking";
import { parkingTitleMessageId } from "../models/parkingType";
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

describe("Parking field-set predicate (DPO-5044)", () => {
  // One case per row of the plan's predicate table.
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

describe("Parking vehicle signal (DPO-5044, R16)", () => {
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

describe("Parking title message id (DPO-5044)", () => {
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

describe("Parking space lookup with a partial spaces array (DPO-5044)", () => {
  // The 524 target parkings hold a stored type and an allUsers entry alone.
  // Reading the stored type gives them the full field set, so toClient() now
  // reads the registeredDisabled entry that they do not have.
  it("maps a bicycle parking that holds only an allUsers entry", () => {
    const parking = makeParking({
      parkingType: "parkAndRide",
      parkingVehicleTypes: ["pedalCycle"],
      parkingProperties: bicycleSpaces,
    });

    expect(parking.hasFullFieldSet).toBe(true);

    const client = parking.toClient();

    expect(client.numberOfSpaces).toBe(10);
    expect(client.numberOfSpacesForRegisteredDisabledUserType).toBe(0);
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

describe("Parking vehicle type label (DPO-5044)", () => {
  const formatMessage = ({ id }) =>
    ({
      parking_vehicle_type_car: "Auto",
      parking_vehicle_type_pedalCycle: "Polkupyörä",
    })[id] ?? id;

  it("translates a type this repository names", () => {
    expect(parkingVehicleTypeLabel("car", formatMessage)).toBe("Auto");
    expect(parkingVehicleTypeLabel("pedalCycle", formatMessage)).toBe(
      "Polkupyörä",
    );
  });

  // 23 dev parkings hold `motorcycle`, which this repository does not name.
  // Measured against dev on 2026-09-29.
  it("shows a NeTEx type this repository does not name", () => {
    expect(parkingVehicleTypeLabel("motorcycle", formatMessage)).toBe(
      "motorcycle",
    );
  });
});
