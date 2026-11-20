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
import { buildMultimodalEdges } from "../components/modern/Map/layers/utils/buildMultimodalEdges";

const CHILDREN = [
  { id: "NSR:StopPlace:2", location: [59.91, 10.75] as [number, number] },
  { id: "NSR:StopPlace:3", location: [59.92, 10.76] as [number, number] },
];

const activeParent = {
  id: "NSR:StopPlace:1",
  isParent: true,
  location: [59.9, 10.7] as [number, number],
  children: CHILDREN,
};

const expiredParent = {
  ...activeParent,
  id: "NSR:StopPlace:9",
  hasExpired: true,
};
const terminatedParent = {
  ...activeParent,
  id: "NSR:StopPlace:8",
  permanentlyTerminated: true,
};

describe("buildMultimodalEdges (deactivated multimodal stops)", () => {
  test("an active neighbouring parent gets a line to each child", () => {
    expect(
      buildMultimodalEdges(null, [activeParent], false).features,
    ).toHaveLength(CHILDREN.length);
  });

  test("an expired or terminated neighbouring parent gets no lines", () => {
    expect(
      buildMultimodalEdges(null, [expiredParent, terminatedParent], false)
        .features,
    ).toHaveLength(0);
  });

  test("expired parents keep their lines when expired stops are shown", () => {
    expect(
      buildMultimodalEdges(null, [expiredParent], true).features,
    ).toHaveLength(CHILDREN.length);
  });

  test("a parent without children (detached before deactivating) has no lines", () => {
    expect(
      buildMultimodalEdges({ ...activeParent, children: [] }, [], false)
        .features,
    ).toHaveLength(0);
  });
});
