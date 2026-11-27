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
import { cleanBBoxResult } from "../components/modern/Map/markers/utils/cleanBBoxResult";

const NOW = Date.parse("2026-11-13T12:00:00Z");
const PAST = "2026-10-01T00:00:00Z";
const FUTURE = "2027-01-01T00:00:00Z";

const ids = (stops: { id: string; version?: unknown }[]) =>
  stops.map(({ id, version }) => `${id}@${version}`);

describe("cleaning the map query result (F-85, F-92)", () => {
  test("keeps only the newest version of each stop", () => {
    const stops = [
      { id: "A", version: "3", validBetween: { toDate: PAST } },
      { id: "A", version: "10", validBetween: { toDate: null } },
      { id: "B", version: "1", validBetween: {} },
    ];
    expect(ids(cleanBBoxResult(stops, false, NOW))).toEqual(["A@10", "B@1"]);
  });

  test("an old parent version does not bring back its old children", () => {
    const stops = [
      {
        id: "MM",
        version: "4",
        validBetween: { toDate: PAST },
        children: [{ id: "GONE" }],
      },
      { id: "MM", version: "5", validBetween: {}, children: [{ id: "C" }] },
      { id: "GONE", version: "2", validBetween: {} },
    ];
    const cleaned = cleanBBoxResult(stops, false, NOW);
    expect(ids(cleaned)).toEqual(["MM@5", "GONE@2"]);
    expect(cleaned[0].children).toEqual([{ id: "C" }]);
  });

  test("drops expired stops unless expired stops are shown", () => {
    const stops = [
      { id: "OLD", version: "1", validBetween: { toDate: PAST } },
      { id: "ENDING", version: "1", validBetween: { toDate: FUTURE } },
    ];
    expect(ids(cleanBBoxResult(stops, false, NOW))).toEqual(["ENDING@1"]);
    expect(ids(cleanBBoxResult(stops, true, NOW))).toEqual([
      "OLD@1",
      "ENDING@1",
    ]);
  });

  test("drops a child's stale standalone copy, even with expired shown", () => {
    const stops = [
      { id: "MM", version: "5", validBetween: {}, children: [{ id: "C" }] },
      { id: "C", version: "7", validBetween: { toDate: PAST } },
    ];
    expect(ids(cleanBBoxResult(stops, true, NOW))).toEqual(["MM@5"]);
  });
});
