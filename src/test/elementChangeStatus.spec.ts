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
  buildElementListEntries,
  buildElementStatusByIndex,
  isDeepEqual,
} from "../components/modern/Shared/ElementStatus/elementChangeStatus";
import {
  ACCESSIBILITY_TAB_KEYS,
  ASSISTANCE_TAB_KEYS,
  getChangedKeys,
  hasChangedKey,
  hasGeneralTabChange,
  KEY_VALUES_TAB_KEYS,
} from "../components/modern/Shared/ElementStatus/stopPlaceFieldStatus";

describe("isDeepEqual", () => {
  test("ignores key order", () => {
    expect(isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  test("treats a missing key and an explicit undefined as equal", () => {
    expect(isDeepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true);
  });

  test("detects a changed nested value", () => {
    expect(isDeepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 3] } })).toBe(false);
  });

  test("distinguishes null from undefined and from a value", () => {
    expect(isDeepEqual({ a: null }, { a: undefined })).toBe(false);
    expect(isDeepEqual({ a: null }, { a: 0 })).toBe(false);
  });

  test("compares array length and order", () => {
    expect(isDeepEqual([1, 2], [1, 2])).toBe(true);
    expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
    expect(isDeepEqual([1], [1, 2])).toBe(false);
  });
});

describe("buildElementListEntries", () => {
  test("flags an edited element as modified", () => {
    const original = [{ id: "NSR:Quay:1", publicCode: "A" }];
    const current = [{ id: "NSR:Quay:1", publicCode: "B" }];

    expect(buildElementListEntries(current, original)).toEqual([
      { element: current[0], index: 0, status: "modified" },
    ]);
  });

  test("leaves an untouched element unchanged", () => {
    const original = [{ id: "NSR:Quay:1", publicCode: "A" }];
    const current = [{ id: "NSR:Quay:1", publicCode: "A" }];

    expect(buildElementListEntries(current, original)[0].status).toBe(
      "unchanged",
    );
  });

  test("detects a change nested inside the element", () => {
    const original = [
      { id: "NSR:Quay:1", boardingPositions: [{ id: "b1", publicCode: "1" }] },
    ];
    const current = [
      { id: "NSR:Quay:1", boardingPositions: [{ id: "b1", publicCode: "2" }] },
    ];

    expect(buildElementListEntries(current, original)[0].status).toBe(
      "modified",
    );
  });

  test("keeps a ghost row in its original position", () => {
    const original = [
      { id: "NSR:Quay:1" },
      { id: "NSR:Quay:2" },
      { id: "NSR:Quay:3" },
    ];
    const current = [{ id: "NSR:Quay:1" }, { id: "NSR:Quay:3" }];

    const entries = buildElementListEntries(current, original);

    expect(entries.map((entry) => entry.status)).toEqual([
      "unchanged",
      "deleted",
      "unchanged",
    ]);
    expect(entries[1].element.id).toBe("NSR:Quay:2");
    expect(entries[1].index).toBeNull();
  });

  test("keeps survivor indices pointing at the live array", () => {
    const original = [{ id: "NSR:Quay:1" }, { id: "NSR:Quay:2" }];
    const current = [{ id: "NSR:Quay:2" }];

    const survivor = buildElementListEntries(current, original).find(
      (entry) => entry.status !== "deleted",
    );

    expect(survivor).toEqual({
      element: current[0],
      index: 0,
      status: "unchanged",
    });
  });

  test("handles new, modified and deleted together", () => {
    const original = [
      { id: "NSR:Parking:1", name: "P1" },
      { id: "NSR:Parking:2", name: "P2" },
    ];
    const current = [{ id: "NSR:Parking:1", name: "renamed" }, {}];

    expect(
      buildElementListEntries(current, original).map((e) => e.status),
    ).toEqual(["modified", "deleted", "new"]);
  });

  test("is safe with no original snapshot", () => {
    expect(buildElementListEntries(undefined, undefined)).toEqual([]);
    expect(buildElementListEntries([{}], null)).toEqual([
      { element: {}, index: 0, status: "new" },
    ]);
  });
});

describe("buildElementStatusByIndex", () => {
  test("aligns with the live array and never reports deletions", () => {
    const original = [
      { id: "NSR:Quay:1", publicCode: "A" },
      { id: "NSR:Quay:2", publicCode: "B" },
    ];
    const current = [{ id: "NSR:Quay:2", publicCode: "changed" }, {}];

    expect(buildElementStatusByIndex(current, original)).toEqual([
      "modified",
      "new",
    ]);
  });

  test("reports unchanged for an untouched element", () => {
    const quays = [{ id: "NSR:Quay:1", publicCode: "A" }];

    expect(buildElementStatusByIndex(quays, quays)).toEqual(["unchanged"]);
  });

  test("is safe with no snapshot", () => {
    expect(buildElementStatusByIndex(undefined, undefined)).toEqual([]);
  });
});

describe("getChangedKeys", () => {
  const base = {
    name: "Oslo S",
    stopPlaceType: "railStation",
    weighting: "preferredInterchange",
    accessibilityAssessment: { limitations: { wheelchairAccess: "true" } },
    keyValues: [{ key: "a", values: ["1"] }],
    quays: [{ id: "NSR:Quay:1" }],
  };

  test("reports the edited field only", () => {
    expect([
      ...getChangedKeys({ ...base, weighting: "noInterchange" }, base),
    ]).toEqual(["weighting"]);
  });

  test("ignores child collections, which have their own row dots", () => {
    const changed = { ...base, quays: [{ id: "NSR:Quay:1", publicCode: "A" }] };

    expect(getChangedKeys(changed, base).size).toBe(0);
  });

  test("ignores reducer bookkeeping", () => {
    const changed = { ...base, version: 9, isNewStop: true, __typename: "X" };

    expect(getChangedKeys(changed, base).size).toBe(0);
  });

  test("detects a nested accessibility change", () => {
    const changed = {
      ...base,
      accessibilityAssessment: { limitations: { wheelchairAccess: "false" } },
    };

    expect([...getChangedKeys(changed, base)]).toEqual([
      "accessibilityAssessment",
    ]);
  });

  test("returns nothing without a snapshot", () => {
    expect(getChangedKeys(base, null).size).toBe(0);
    expect(getChangedKeys(null, base).size).toBe(0);
  });
});

describe("tab ownership", () => {
  test("claimed keys route to their own tab, not General", () => {
    expect(hasChangedKey(new Set(["keyValues"]), KEY_VALUES_TAB_KEYS)).toBe(
      true,
    );
    expect(hasGeneralTabChange(new Set(["keyValues"]))).toBe(false);
  });

  test("General catches any key no tab claims", () => {
    expect(hasGeneralTabChange(new Set(["weighting"]))).toBe(true);
    expect(hasGeneralTabChange(new Set(["someFutureField"]))).toBe(true);
  });

  test("a mixed edit lights up both tabs", () => {
    const changed = new Set(["weighting", "localServices"]);

    expect(hasGeneralTabChange(changed)).toBe(true);
    expect(hasChangedKey(changed, ASSISTANCE_TAB_KEYS)).toBe(true);
    expect(hasChangedKey(changed, ACCESSIBILITY_TAB_KEYS)).toBe(false);
  });
});
