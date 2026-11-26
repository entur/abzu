import { beforeAll, describe, expect, it } from "vitest";
import {
  ClientParking,
  toModernParkingVariables,
  vehicleTypesAfterSave,
} from "../models/modernParkingSave";

const PARENT_REF = "NSR:StopPlace:1";

beforeAll(() => {
  (window as any).config = {
    ...(window as any).config,
    defaultLanguageCode: "nb",
  };
});

const row = (parkingVehicleType: string | null, numberOfSpaces = 5) => ({
  parkingVehicleType,
  parkingUserType: "allUsers",
  numberOfSpaces,
});

const stored = (...types: (string | null)[]) => ({
  spaces: types.map((type) => ({
    parkingVehicleType: type,
    parkingUserType: "allUsers",
    numberOfSpaces: 5,
  })),
});

const makeParking = (overrides: Partial<ClientParking>): ClientParking => ({
  id: "NSR:Parking:1",
  name: "P",
  hasFullFieldSet: true,
  parkingType: "parkAndRide",
  parkingVehicleTypes: ["car"],
  capacityEntries: [row("car")],
  parkingProperties: [stored("car")],
  totalCapacity: 5,
  ...overrides,
});

describe("vehicleTypesAfterSave", () => {
  it("F1 adds a type for a new row with a count", () => {
    const parking = makeParking({
      capacityEntries: [row("car"), { ...row("motorcycle"), isNew: true }],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car", "motorcycle"]);
  });

  it("F2 removes a type when its last row is removed", () => {
    const parking = makeParking({
      parkingVehicleTypes: ["car", "motorcycle"],
      parkingProperties: [stored("car", "motorcycle")],
      capacityEntries: [row("car")],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car"]);
  });

  it("F3 replaces a type when the editor retypes its last row", () => {
    const parking = makeParking({ capacityEntries: [row("motorcycle")] });

    expect(vehicleTypesAfterSave(parking)).toEqual(["motorcycle"]);
  });

  it("F4 never empties the list", () => {
    const parking = makeParking({ capacityEntries: [] });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car"]);
  });

  it("F5 keeps a type that has no row", () => {
    const parking = makeParking({ capacityEntries: [], parkingProperties: [] });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car"]);
  });

  it("F6 adds no type for a new row with no count", () => {
    const parking = makeParking({
      capacityEntries: [
        row("car"),
        { parkingVehicleType: "motorcycle", isNew: true },
      ],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car"]);
  });

  it("F7 keeps a type while another row has it", () => {
    const parking = makeParking({
      parkingProperties: [stored("car", "car")],
      capacityEntries: [row("car")],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car"]);
  });

  it("F8 keeps a value the editor does not name", () => {
    const parking = makeParking({
      parkingVehicleTypes: ["car", "minibus"],
      capacityEntries: [row("car"), { ...row("pedalCycle"), isNew: true }],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual([
      "car",
      "minibus",
      "pedalCycle",
    ]);
  });

  it("F9 adds a type when a row with no type gets one", () => {
    const parking = makeParking({
      parkingProperties: [stored(null)],
      capacityEntries: [row("motorcycle")],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car", "motorcycle"]);
  });

  it("F10 keeps the creation type of a new parking and adds the row type", () => {
    const parking = makeParking({
      id: undefined,
      parkingProperties: undefined,
      capacityEntries: [{ ...row("motorcycle"), isNew: true }],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car", "motorcycle"]);
  });

  it("F13 keeps a type that a second stored group holds", () => {
    const parking = makeParking({
      parkingVehicleTypes: ["car", "motorcycle"],
      parkingProperties: [stored("car", "motorcycle"), stored("motorcycle")],
      capacityEntries: [row("car")],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["car", "motorcycle"]);
  });

  it("F11 keeps the list of a parking with the reduced field set", () => {
    const parking = makeParking({
      hasFullFieldSet: false,
      parkingType: "bikeParking",
      parkingVehicleTypes: ["pedalCycle"],
      capacityEntries: [],
      parkingProperties: [stored("car")],
    });

    expect(vehicleTypesAfterSave(parking)).toEqual(["pedalCycle"]);
  });
});

describe("toModernParkingVariables", () => {
  const variablesOf = (parkings: ClientParking[]) =>
    toModernParkingVariables(parkings, PARENT_REF);

  it("sends the new list through the shared mapper", () => {
    const [saved] = variablesOf([
      makeParking({ capacityEntries: [row("motorcycle")] }),
    ]);

    expect(saved.parkingVehicleTypes).toEqual(["motorcycle"]);
  });

  it("P1 sends parkAndRide for a guessed park-and-ride", () => {
    const [saved] = variablesOf([makeParking({ parkingType: "parkAndRide" })]);

    expect(saved.parkingType).toBe("parkAndRide");
  });

  it("P2 sends parkAndRide for a stored park-and-ride", () => {
    const [saved] = variablesOf([
      makeParking({ parkingType: "parkAndRide", capacityEntries: [] }),
    ]);

    expect(saved.parkingType).toBe("parkAndRide");
  });

  it("P3 sends no type for another stored type", () => {
    const [saved] = variablesOf([makeParking({ parkingType: "urbanParking" })]);

    expect(saved).not.toHaveProperty("parkingType");
  });

  it("P4 sends no type for a parking with the reduced field set", () => {
    const [saved] = variablesOf([
      makeParking({ hasFullFieldSet: false, parkingType: "bikeParking" }),
    ]);

    expect(saved).not.toHaveProperty("parkingType");
  });

  it("P5 sends parkAndRide for a new park-and-ride", () => {
    const [saved] = variablesOf([
      makeParking({
        id: undefined,
        parkingProperties: undefined,
        capacityEntries: [],
      }),
    ]);

    expect(saved.parkingType).toBe("parkAndRide");
    expect(saved).not.toHaveProperty("id");
  });

  it("R7 applies the rule to each parking on its own", () => {
    const [first, second] = variablesOf([
      makeParking({ capacityEntries: [row("motorcycle")] }),
      makeParking({
        id: "NSR:Parking:2",
        parkingType: "urbanParking",
        capacityEntries: [row("car"), { ...row("pedalCycle"), isNew: true }],
      }),
    ]);

    expect(first.parkingVehicleTypes).toEqual(["motorcycle"]);
    expect(first.parkingType).toBe("parkAndRide");
    expect(second.parkingVehicleTypes).toEqual(["car", "pedalCycle"]);
    expect(second).not.toHaveProperty("parkingType");
  });

  it("F11 sends the stored list of a reduced parking", () => {
    const [saved] = variablesOf([
      makeParking({
        hasFullFieldSet: false,
        parkingType: "bikeParking",
        parkingVehicleTypes: ["pedalCycle"],
        capacityEntries: [],
        parkingProperties: undefined,
      }),
    ]);

    expect(saved.parkingVehicleTypes).toEqual(["pedalCycle"]);
  });
});
