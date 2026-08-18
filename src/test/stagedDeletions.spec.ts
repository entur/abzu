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
import { findStagedDeletions } from "../components/modern/EditStopPage/utils/stagedDeletions";

describe("findStagedDeletions", () => {
  test("returns nothing when no element was removed", () => {
    const quays = [{ id: "NSR:Quay:1" }, { id: "NSR:Quay:2" }];

    expect(findStagedDeletions(quays, quays)).toEqual([]);
  });

  test("returns the id of a removed saved element", () => {
    const original = [{ id: "NSR:Quay:1" }, { id: "NSR:Quay:2" }];
    const current = [{ id: "NSR:Quay:1" }];

    expect(findStagedDeletions(original, current)).toEqual(["NSR:Quay:2"]);
  });

  test("returns every removed id when several are staged", () => {
    const original = [
      { id: "NSR:Quay:1" },
      { id: "NSR:Quay:2" },
      { id: "NSR:Quay:3" },
    ];

    expect(findStagedDeletions(original, [{ id: "NSR:Quay:2" }])).toEqual([
      "NSR:Quay:1",
      "NSR:Quay:3",
    ]);
  });

  test("ignores elements that were never saved", () => {
    const original = [{ id: "NSR:Quay:1" }];
    const current = [{ id: "NSR:Quay:1" }, {}];

    expect(findStagedDeletions(original, current)).toEqual([]);
  });

  test("reports every saved element when all are removed", () => {
    const original = [{ id: "NSR:Parking:1" }, { id: "NSR:Parking:2" }];

    expect(findStagedDeletions(original, [])).toEqual([
      "NSR:Parking:1",
      "NSR:Parking:2",
    ]);
  });

  test("works the same for parking ids", () => {
    const original = [{ id: "NSR:Parking:1" }, { id: "NSR:Parking:2" }];
    const current = [{ id: "NSR:Parking:2" }];

    expect(findStagedDeletions(original, current)).toEqual(["NSR:Parking:1"]);
  });

  test("is safe on a stop that never had the element", () => {
    expect(findStagedDeletions(undefined, undefined)).toEqual([]);
    expect(findStagedDeletions(null, [{ id: "NSR:Quay:1" }])).toEqual([]);
    expect(findStagedDeletions([], [])).toEqual([]);
  });
});
