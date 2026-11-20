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

import * as types from "../actions/Types";
import helpers from "../modelUtils/mapToQueryVariables";
import Parking from "../models/Parking";
import { cycleStorageTypes } from "../models/cycleStorageType";
import stopPlaceReducer from "../reducers/stopPlaceReducer";
import en from "../static/lang/en.json";
import fi from "../static/lang/fi.json";
import fr from "../static/lang/fr.json";
import nb from "../static/lang/nb.json";
import sv from "../static/lang/sv.json";

beforeAll(() => {
  window.config = { ...window.config, defaultLanguageCode: "nb" };
});

const tiamatEquipments = () => ({
  __typename: "PlaceEquipments",
  id: "NSR:PlaceEquipment:1",
  generalSign: null,
  waitingRoomEquipment: null,
  sanitaryEquipment: null,
  ticketingEquipment: null,
  shelterEquipment: [
    {
      __typename: "ShelterEquipment",
      id: "NSR:ShelterEquipment:7",
      seats: 4,
      stepFree: true,
      enclosed: null,
    },
  ],
  cycleStorageEquipment: [
    {
      __typename: "CycleStorageEquipment",
      id: "NSR:CycleStorageEquipment:5",
      numberOfSpaces: null,
      cycleStorageType: "bars",
    },
    {
      __typename: "CycleStorageEquipment",
      id: "NSR:CycleStorageEquipment:6",
      numberOfSpaces: 10,
      cycleStorageType: "racks",
    },
  ],
});

const tiamatParking = (placeEquipments) => ({
  id: "NSR:Parking:1",
  name: { value: "Parking" },
  parkingType: "parkAndRide",
  parkingVehicleTypes: ["pedalCycle"],
  totalCapacity: 0,
  placeEquipments,
});

const clientParking = (placeEquipments = tiamatEquipments()) =>
  new Parking(tiamatParking(placeEquipments)).toClient();

const save = (parking) =>
  helpers.mapParkingToVariables([parking], "NSR:StopPlace:1")[0];

const stateWith = (parking) => ({ current: { parking: [parking] } });

const reduce = (state, type, payload) =>
  stopPlaceReducer(state, { type, payload });

describe("Parking.toClient - place equipments", () => {
  test("carries every entry of every kind", () => {
    const { placeEquipments } = clientParking();

    expect(placeEquipments.cycleStorageEquipment.map((e) => e.id)).toEqual([
      "NSR:CycleStorageEquipment:5",
      "NSR:CycleStorageEquipment:6",
    ]);
    expect(placeEquipments.shelterEquipment).toHaveLength(1);
    expect(placeEquipments.id).toBe("NSR:PlaceEquipment:1");
  });

  test("starts with no change", () => {
    expect(clientParking().placeEquipmentsChanged).toBe(false);
  });

  test("a parking with no equipment has none", () => {
    expect(clientParking(null).placeEquipments).toBeNull();
  });
});

describe("mapParkingToVariables - place equipments", () => {
  test("an unchanged parking sends no placeEquipments", () => {
    expect(save(clientParking())).not.toHaveProperty("placeEquipments");
  });

  test("a changed parking sends every entry of every kind with its id", () => {
    const parking = { ...clientParking(), placeEquipmentsChanged: true };

    expect(save(parking).placeEquipments).toEqual({
      id: "NSR:PlaceEquipment:1",
      shelterEquipment: [
        {
          id: "NSR:ShelterEquipment:7",
          seats: 4,
          stepFree: true,
          enclosed: null,
        },
      ],
      cycleStorageEquipment: [
        { id: "NSR:CycleStorageEquipment:5", cycleStorageType: "bars" },
        {
          id: "NSR:CycleStorageEquipment:6",
          cycleStorageType: "racks",
          numberOfSpaces: 10,
        },
      ],
    });
  });

  test("an empty count and an empty type send no key", () => {
    const parking = {
      ...clientParking(null),
      placeEquipmentsChanged: true,
      placeEquipments: {
        cycleStorageEquipment: [
          { cycleStorageType: null, numberOfSpaces: "" },
          { cycleStorageType: "racks", numberOfSpaces: "12" },
        ],
      },
    };

    expect(save(parking).placeEquipments).toEqual({
      cycleStorageEquipment: [
        {},
        { cycleStorageType: "racks", numberOfSpaces: 12 },
      ],
    });
  });

  test("a removed last entry sends an empty cycle storage list", () => {
    const equipments = tiamatEquipments();
    equipments.cycleStorageEquipment = [];
    const parking = {
      ...clientParking(equipments),
      placeEquipmentsChanged: true,
    };

    expect(save(parking).placeEquipments.cycleStorageEquipment).toEqual([]);
    expect(save(parking).placeEquipments.shelterEquipment).toHaveLength(1);
  });

  test("a stored value outside the profile survives a save", () => {
    const equipments = tiamatEquipments();
    equipments.cycleStorageEquipment = [
      { id: "NSR:CycleStorageEquipment:9", cycleStorageType: "cycleScheme" },
    ];
    const parking = {
      ...clientParking(equipments),
      placeEquipmentsChanged: true,
    };

    expect(save(parking).placeEquipments.cycleStorageEquipment).toEqual([
      { id: "NSR:CycleStorageEquipment:9", cycleStorageType: "cycleScheme" },
    ]);
  });
});

describe("stop place reducer - cycle storage", () => {
  test("add appends an empty racks entry and sets the flag", () => {
    const state = reduce(
      stateWith(clientParking(null)),
      types.ADDED_PARKING_CYCLE_STORAGE,
      { index: 0 },
    );
    const parking = state.current.parking[0];

    expect(parking.placeEquipments.cycleStorageEquipment).toEqual([
      { cycleStorageType: "racks", numberOfSpaces: null },
    ]);
    expect(parking.placeEquipmentsChanged).toBe(true);
    expect(state.stopHasBeenModified).toBe(true);
  });

  test("change updates one field of one entry and keeps the rest", () => {
    const state = reduce(
      stateWith(clientParking()),
      types.CHANGED_PARKING_CYCLE_STORAGE,
      { index: 0, entryIndex: 1, field: "numberOfSpaces", value: "11" },
    );
    const parking = state.current.parking[0];
    const [first, second] = parking.placeEquipments.cycleStorageEquipment;

    expect(second).toMatchObject({
      id: "NSR:CycleStorageEquipment:6",
      numberOfSpaces: "11",
      cycleStorageType: "racks",
    });
    expect(first.cycleStorageType).toBe("bars");
    expect(parking.placeEquipments.shelterEquipment).toHaveLength(1);
    expect(parking.placeEquipmentsChanged).toBe(true);
  });

  test("remove drops the entry and sets the flag", () => {
    const state = reduce(
      stateWith(clientParking()),
      types.REMOVED_PARKING_CYCLE_STORAGE,
      { index: 0, entryIndex: 0 },
    );
    const parking = state.current.parking[0];

    expect(
      parking.placeEquipments.cycleStorageEquipment.map((e) => e.id),
    ).toEqual(["NSR:CycleStorageEquipment:6"]);
    expect(parking.placeEquipmentsChanged).toBe(true);
  });

  test("an edit of another field leaves the flag unset", () => {
    const state = reduce(
      stateWith(clientParking()),
      types.CHANGED_PARKING_NAME,
      { index: 0, name: "Other" },
    );

    expect(state.current.parking[0].placeEquipmentsChanged).toBe(false);
  });
});

describe("cycle storage types", () => {
  test("the menu holds exactly the profile values", () => {
    expect(cycleStorageTypes).toEqual(["racks", "bars", "railings"]);
  });
});

describe("cycle storage locale keys", () => {
  const keys = [
    "parking_cycle_storage",
    "parking_cycle_storage_add",
    "parking_cycle_storage_remove",
    "parking_cycle_storage_type",
    "parking_cycle_storage_spaces",
    "parking_cycle_storage_type_racks",
    "parking_cycle_storage_type_bars",
    "parking_cycle_storage_type_railings",
    "parking_cycle_storage_type_cycleScheme",
    "parking_cycle_storage_type_other",
  ];

  test.each([
    ["en", en],
    ["fi", fi],
    ["nb", nb],
    ["sv", sv],
    ["fr", fr],
  ])("%s holds every key", (_name, messages) => {
    expect(keys.filter((key) => !(key in messages))).toEqual([]);
  });
});
