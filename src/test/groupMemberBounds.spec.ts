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
import { groupMemberBounds } from "../components/modern/GroupOfStopPlaces/utils/groupMemberBounds";

describe("groupMemberBounds", () => {
  test("spans every member, as [lng, lat] west-south to east-north", () => {
    const members = [
      { location: [59.91, 10.75] as [number, number] },
      { location: [60.39, 5.32] as [number, number] },
      { location: [63.43, 10.39] as [number, number] },
    ];
    expect(groupMemberBounds(members)).toEqual([
      [5.32, 59.91],
      [10.75, 63.43],
    ]);
  });

  test("skips members without a location", () => {
    const members = [
      { location: null },
      {},
      { location: [59.91, 10.75] as [number, number] },
    ];
    expect(groupMemberBounds(members)).toEqual([
      [10.75, 59.91],
      [10.75, 59.91],
    ]);
  });

  test("gives no bounds when no member has a location", () => {
    expect(groupMemberBounds([])).toBeNull();
    expect(groupMemberBounds([{ location: null }, {}])).toBeNull();
  });
});
