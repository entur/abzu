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
import {
  readAnswer,
  readEquipment,
  withAnswer,
} from "../components/modern/EditStopPage/facilities/equipmentDetails";

describe("described equipment answers (F-25)", () => {
  test("an empty or stored-as-null shelter has every answer not set", () => {
    expect(readAnswer({}, "seats")).toBeNull();
    expect(
      readAnswer({ seats: null, stepFree: null, enclosed: null }, "stepFree"),
    ).toBeNull();
  });

  test("seats read as yes above 0, no at 0; booleans as they are", () => {
    expect(readAnswer({ seats: 4 }, "seats")).toBe(true);
    expect(readAnswer({ seats: 0 }, "seats")).toBe(false);
    expect(readAnswer({ enclosed: false }, "enclosed")).toBe(false);
    expect(readAnswer({ heated: true }, "heated")).toBe(true);
  });

  test("answering sets only that detail, the rest stay not set", () => {
    expect(withAnswer({}, "enclosed", false)).toEqual({ enclosed: false });
    expect(withAnswer({ enclosed: false }, "stepFree", true)).toEqual({
      enclosed: false,
      stepFree: true,
    });
  });

  test("seats yes keeps a count, sets 1 when there was none; no is 0", () => {
    expect(withAnswer({ seats: 6 }, "seats", true)).toEqual({ seats: 6 });
    expect(withAnswer({}, "seats", true)).toEqual({ seats: 1 });
    expect(withAnswer({ seats: 6 }, "seats", false)).toEqual({ seats: 0 });
  });

  test("clearing an answer stores null", () => {
    expect(withAnswer({ seats: 6, heated: true }, "seats", null)).toEqual({
      seats: null,
      heated: true,
    });
  });

  test("readEquipment finds the equipment or null", () => {
    const quay = { placeEquipments: { shelterEquipment: {} } };
    expect(readEquipment(quay, "shelterEquipment")).toEqual({});
    expect(readEquipment(quay, "waitingRoomEquipment")).toBeNull();
    expect(readEquipment({}, "shelterEquipment")).toBeNull();
  });
});
