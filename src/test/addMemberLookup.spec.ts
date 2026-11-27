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
import { addMemberLookupQuery } from "../graphql/Tiamat/addMemberLookup";

describe("addMemberLookupQuery (S-7)", () => {
  const body = addMemberLookupQuery([
    "NSR:StopPlace:22330",
    "NSR:StopPlace:61608",
  ]).loc!.source.body;

  test("keeps the classic operation name and one aliased lookup per stop", () => {
    expect(body).toContain("query getAddStopPlaceInfo");
    expect(body).toContain(
      'StopPlace22330: stopPlace(id: "NSR:StopPlace:22330")',
    );
    expect(body).toContain(
      'StopPlace61608: stopPlace(id: "NSR:StopPlace:61608")',
    );
  });

  test("asks for validity on ordinary and multimodal stops", () => {
    // Two stops × (StopPlace + ParentStopPlace) branches.
    expect(body.match(/validBetween/g)).toHaveLength(4);
  });
});
