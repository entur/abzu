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
  hasDuplicateValues,
  isExistingKey,
  parseKeyValues,
  uniqueValues,
} from "../components/modern/EditStopPage/utils/keyValueRules";

const KEY_VALUES = [{ key: "imported-id", values: ["VKT:StopPlace:1"] }];

describe("key-value rules (F-70, F-71)", () => {
  test("an existing key is found case-insensitively", () => {
    expect(isExistingKey(KEY_VALUES, "  Imported-ID ")).toBe(true);
  });

  test("a new key is not an existing key", () => {
    expect(isExistingKey(KEY_VALUES, "claude")).toBe(false);
  });

  test("values are split on commas, trimmed and empty ones dropped", () => {
    expect(parseKeyValues(" a, b ,, c ")).toEqual(["a", "b", "c"]);
  });

  test("duplicate values are detected and removed, keeping order", () => {
    const values = parseKeyValues("x, y, x, z, y");

    expect(hasDuplicateValues(values)).toBe(true);
    expect(uniqueValues(values)).toEqual(["x", "y", "z"]);
  });
});
