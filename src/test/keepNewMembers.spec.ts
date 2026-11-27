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
import { keepNewMembers } from "../components/modern/GroupOfStopPlaces/utils/keepNewMembers";

describe("adding group members (F-90)", () => {
  test("a child's lookup that returns an existing parent adds nothing", () => {
    const data = { StopPlace2: [{ id: "NSR:StopPlace:PARENT" }] };
    expect(keepNewMembers(data, ["NSR:StopPlace:PARENT"])).toBeNull();
  });

  test("keeps new stops and drops duplicates within one lookup", () => {
    const data = {
      StopPlace1: [{ id: "A" }],
      StopPlace2: [{ id: "B" }],
      StopPlace3: [{ id: "B" }],
      StopPlace4: [{ id: "EXISTING" }],
    };
    expect(keepNewMembers(data, ["EXISTING"])).toEqual({
      StopPlace1: [{ id: "A" }],
      StopPlace2: [{ id: "B" }],
    });
  });

  test("an empty or failed lookup adds nothing", () => {
    expect(keepNewMembers(undefined, [])).toBeNull();
    expect(keepNewMembers({ StopPlace1: [] }, [])).toBeNull();
    expect(keepNewMembers({ StopPlace1: null }, [])).toBeNull();
  });
});
