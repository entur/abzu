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
import { visibleGroupMembers } from "../components/modern/Map/layers/utils/visibleGroupMembers";

const LOCATION: [number, number] = [59.91, 10.75];
const active = { id: "active", location: LOCATION };
const expired = { id: "expired", location: LOCATION, hasExpired: true };
const terminated = {
  id: "terminated",
  location: LOCATION,
  permanentlyTerminated: true,
};
const members = [active, expired, terminated];

describe("visibleGroupMembers", () => {
  test("leaves expired and terminated members off the map", () => {
    expect(visibleGroupMembers(members, false)).toEqual([active]);
  });

  test("keeps them when the user shows expired stops", () => {
    expect(visibleGroupMembers(members, true)).toEqual(members);
  });
});
