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
  markGroupPrefetched,
  PREFETCH_FRESH_MS,
  wasGroupJustPrefetched,
} from "../components/modern/Shared/Membership/groupPrefetch";

describe("group prefetch (S-3)", () => {
  test("a group fetched just now counts as fresh, for that group only", () => {
    markGroupPrefetched("NSR:GroupOfStopPlaces:9", 1000);
    expect(wasGroupJustPrefetched("NSR:GroupOfStopPlaces:9", 1500)).toBe(true);
    expect(wasGroupJustPrefetched("NSR:GroupOfStopPlaces:10", 1500)).toBe(
      false,
    );
  });

  test("reading it twice still says fresh (no refetch on a second render)", () => {
    markGroupPrefetched("NSR:GroupOfStopPlaces:9", 1000);
    wasGroupJustPrefetched("NSR:GroupOfStopPlaces:9", 1100);
    expect(wasGroupJustPrefetched("NSR:GroupOfStopPlaces:9", 1200)).toBe(true);
  });

  test("a later visit fetches again", () => {
    markGroupPrefetched("NSR:GroupOfStopPlaces:9", 1000);
    expect(
      wasGroupJustPrefetched(
        "NSR:GroupOfStopPlaces:9",
        1000 + PREFETCH_FRESH_MS,
      ),
    ).toBe(false);
  });
});
