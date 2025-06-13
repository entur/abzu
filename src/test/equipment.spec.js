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

import helpers from "../modelUtils/equipmentHelpers";
import equiptedStopPlace from "./mock/equippedStopPlace";
import unequiptedStopPlace from "./mock/unequippedStopPlace";

import { simplifyPlaceEquipment } from "../models/stopPlaceUtils";

/* Simplify placeEquipment to client model */
equiptedStopPlace.placeEquipments = simplifyPlaceEquipment(
  equiptedStopPlace.placeEquipments,
);

describe("equipment helper", () => {
  test("should give binary representation of ticket machine based on data", () => {
    const first = helpers.isTicketMachinePresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.isTicketMachinePresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should give binary representation of shelterEquipment based on data", () => {
    const first = helpers.isShelterEquipmentPresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.isShelterEquipmentPresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should give binary representation of sanitaryEquipment based on data", () => {
    const first = helpers.isSanitaryEquipmentPresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.isSanitaryEquipmentPresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should give binary representation of waitingRoom based on data", () => {
    const first = helpers.isWaitingRoomPresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.isWaitingRoomPresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should give binary representation of cycleStorageEquipment based on data", () => {
    const first = helpers.isCycleStorageEquipmentPresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.isCycleStorageEquipmentPresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should give binary representation of sign512Equipment based on data", () => {
    const first = helpers.is512SignEquipmentPresent(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.is512SignEquipmentPresent(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  test("should enable sign512Equipment prop for signEquipment on StopPlace based on data", () => {
    const payloadTrue = {
      state: true,
      type: "stopPlace",
      id: null,
    };

    let stopPlace = helpers.update512SignEquipment(
      unequiptedStopPlace,
      payloadTrue,
    );

    const equipted = helpers.is512SignEquipmentPresent(stopPlace);
    expect(equipted).toEqual(true);
  });

  test("should disable sign512Equipment prop for signEquipment on StopPlace based on data", () => {
    const payloadFalse = {
      state: false,
      type: "stopPlace",
      id: null,
    };
    let stopPlace = helpers.update512SignEquipment(
      equiptedStopPlace,
      payloadFalse,
    );
    const unequipted = helpers.is512SignEquipmentPresent(stopPlace);
    expect(unequipted).toEqual(false);
  });

  test("should enable sign512Equipment prop for signEquipment on Quayx based on data and index", () => {
    let unEquiptedWith512Sign = {
      quays: [],
    };

    for (let i = 0; i < 3; i++) {
      unEquiptedWith512Sign.quays.push(unequiptedStopPlace);
    }

    let equiptedWith512 = helpers.is512SignEquipmentPresent(
      unEquiptedWith512Sign.quays[0],
    );
    expect(equiptedWith512).toEqual(false);

    const payloadTrue = {
      state: true,
      type: "quay",
      id: 1,
    };

    let stopPlace = helpers.update512SignEquipment(
      unEquiptedWith512Sign,
      payloadTrue,
    );

    const equiptedQuay = helpers.is512SignEquipmentPresent(stopPlace.quays[1]);
    const unEquiptedQuay = helpers.is512SignEquipmentPresent(
      stopPlace.quays[0],
    );
    expect(equiptedQuay).toEqual(true);
    expect(unEquiptedQuay).toEqual(false);
  });
});
