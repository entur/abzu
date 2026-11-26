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
import { centroidOfStop } from "../components/modern/Map/markers/utils/stopCentroid";

const STOP_ID = "NSR:StopPlace:22976";

describe("centroidOfStop (F-30)", () => {
  test("an ordinary stop is centred between its quays, at six decimals", () => {
    const stop = {
      id: STOP_ID,
      quays: [
        { id: "a", location: [58.104151, 7.972234] as [number, number] },
        { id: "b", location: [58.104402, 7.972117] as [number, number] },
      ],
    };
    // 58.1042765 is stored as 58.10427649…, so it rounds down, as in legacy.
    expect(centroidOfStop(stop)).toEqual([58.104276, 7.972176]);
  });

  test("a quay without a location is skipped", () => {
    const stop = {
      id: STOP_ID,
      quays: [
        { id: "a", location: [58.1, 7.9] as [number, number] },
        { id: "b" },
      ],
    };
    expect(centroidOfStop(stop)).toEqual([58.1, 7.9]);
  });

  test("nothing to centre on gives no centroid", () => {
    expect(centroidOfStop({ id: STOP_ID })).toBeNull();
    expect(centroidOfStop({ id: STOP_ID, quays: [{ id: "a" }] })).toBeNull();
  });

  test("a multimodal stop is centred on its children, not quays", () => {
    const parent = {
      id: "NSR:StopPlace:58366",
      isParent: true,
      quays: [{ id: "q", location: [0, 0] as [number, number] }],
      children: [
        { id: "c1", location: [59.91, 10.74] as [number, number] },
        { id: "c2", location: [59.92, 10.76] as [number, number] },
      ],
    };
    expect(centroidOfStop(parent)).toEqual([59.915, 10.75]);
  });
});
