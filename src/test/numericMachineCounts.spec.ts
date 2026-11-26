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
  toMachineCount,
  withNumericMachineCounts,
} from "../components/modern/EditStopPage/utils/numericMachineCounts";

describe("toMachineCount (F-68)", () => {
  test.each([
    ["2", 2],
    ["17", 17],
    [3, 3],
    ["2.7", 2],
    ["-1", 0],
    ["", null],
    ["abc", null],
    [null, null],
    [undefined, undefined],
  ] as const)("%j → %j", (input, expected) => {
    expect(toMachineCount(input)).toBe(expected);
  });
});

describe("withNumericMachineCounts (F-68)", () => {
  test("turns the stop's and every quay's count into numbers", () => {
    const stopPlace = {
      name: "Test",
      placeEquipments: {
        ticketingEquipment: { ticketMachines: true, numberOfMachines: "3" },
      },
      quays: [
        {
          id: "q1",
          placeEquipments: {
            ticketingEquipment: { ticketMachines: true, numberOfMachines: "2" },
          },
        },
        { id: "q2", placeEquipments: null },
      ],
    };

    const saved = withNumericMachineCounts(stopPlace);

    expect(saved.placeEquipments.ticketingEquipment.numberOfMachines).toBe(3);
    expect(
      saved.quays[0].placeEquipments?.ticketingEquipment.numberOfMachines,
    ).toBe(2);
    expect(saved.quays[1]).toBe(stopPlace.quays[1]);
    expect(saved.name).toBe("Test");
  });

  test("leaves the original (Redux) object unchanged", () => {
    const stopPlace = {
      quays: [
        {
          placeEquipments: { ticketingEquipment: { numberOfMachines: "2" } },
        },
      ],
    };

    withNumericMachineCounts(stopPlace);

    expect(
      stopPlace.quays[0].placeEquipments.ticketingEquipment.numberOfMachines,
    ).toBe("2");
  });
});
