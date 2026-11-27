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
  findStopWithMemberValidity,
  GROUP_MEMBERS_ANCHOR,
} from "../graphql/Tiamat/findStopModern";
import { findStop } from "../graphql/Tiamat/queries";

describe("findStopWithMemberValidity (S-8)", () => {
  test("the classic query still has the anchor the modern one builds on", () => {
    expect(findStop.loc!.source.body).toMatch(GROUP_MEMBERS_ANCHOR);
  });

  test("group members carry validity; the operation keeps its name", () => {
    const body = findStopWithMemberValidity.loc!.source.body;
    expect(body).toContain("query findStop(");
    expect(body.match(/validBetween/g)?.length).toBe(
      (findStop.loc!.source.body.match(/validBetween/g)?.length ?? 0) + 2,
    );
  });
});
