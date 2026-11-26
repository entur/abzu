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

import { getOperationAST, print } from "graphql";
import { describe, expect, test } from "vitest";
import { groupOfStopPlacesQuery } from "../graphql/Tiamat/groupOfStopPlaces";

describe("groupOfStopPlacesQuery", () => {
  test("keeps the operation name the group reducer listens for", () => {
    expect(getOperationAST(groupOfStopPlacesQuery)?.name?.value).toBe(
      "getGroupOfStopPlaces",
    );
  });

  test("asks for the validity of stop place and multimodal members", () => {
    const text = print(groupOfStopPlacesQuery).replace(/\s+/g, " ");
    expect(text).toContain(
      "... on StopPlace { validBetween { fromDate toDate } }",
    );
    expect(text).toContain(
      "... on ParentStopPlace { validBetween { fromDate toDate } }",
    );
  });
});
