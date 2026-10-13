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
  getAllowedStopTypes,
  isStopPlaceTypeValid,
} from "../components/modern/Shared/StopNameAndType/stopPlaceTypeRules";

describe("isStopPlaceTypeValid (F-15)", () => {
  test("rejects a missing type", () => {
    expect(isStopPlaceTypeValid(undefined)).toBe(false);
    expect(isStopPlaceTypeValid(null)).toBe(false);
    expect(isStopPlaceTypeValid("")).toBe(false);
  });

  test("rejects 'other' even when no types are hidden", () => {
    expect(isStopPlaceTypeValid("other", [])).toBe(false);
  });

  test("rejects a type the deployment hides", () => {
    expect(isStopPlaceTypeValid("ferryStop", ["ferryStop"])).toBe(false);
  });

  test("rejects an unknown type", () => {
    expect(isStopPlaceTypeValid("spaceport")).toBe(false);
  });

  test("accepts a real, visible type", () => {
    expect(isStopPlaceTypeValid("onstreetBus", ["other"])).toBe(true);
  });
});

describe("getAllowedStopTypes", () => {
  test("never offers 'other' or hidden types", () => {
    const allowed = getAllowedStopTypes(["ferryStop"]);

    expect(allowed).not.toContain("other");
    expect(allowed).not.toContain("ferryStop");
    expect(allowed).toContain("onstreetBus");
  });
});
