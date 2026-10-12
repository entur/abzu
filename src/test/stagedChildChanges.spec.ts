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
  countRemainingSavedChildren,
  findStagedChildChanges,
} from "../components/modern/EditParentStopPlace/utils/stagedChildChanges";

const BUS_STOP = { id: "NSR:StopPlace:1" };
const FERRY_STOP = { id: "NSR:StopPlace:2" };
const TRAIN_STATION = { id: "NSR:StopPlace:3" };

describe("findStagedChildChanges (F-37)", () => {
  test("nothing staged when the children are unchanged", () => {
    expect(
      findStagedChildChanges([BUS_STOP, FERRY_STOP], [BUS_STOP, FERRY_STOP]),
    ).toEqual({ childrenToAdd: [], childrenToRemove: [] });
  });

  test("an attach and a detach in the same edit are both kept", () => {
    expect(
      findStagedChildChanges([BUS_STOP, FERRY_STOP], [BUS_STOP, TRAIN_STATION]),
    ).toEqual({
      childrenToAdd: [TRAIN_STATION.id],
      childrenToRemove: [FERRY_STOP.id],
    });
  });

  test("attaching and then detaching the same stop is a no-op", () => {
    expect(findStagedChildChanges([BUS_STOP], [BUS_STOP])).toEqual({
      childrenToAdd: [],
      childrenToRemove: [],
    });
  });
});

describe("countRemainingSavedChildren", () => {
  test("ignores staged attaches", () => {
    expect(
      countRemainingSavedChildren([BUS_STOP], [BUS_STOP, TRAIN_STATION]),
    ).toBe(1);
  });

  test("excludes staged detaches", () => {
    expect(
      countRemainingSavedChildren([BUS_STOP, FERRY_STOP], [BUS_STOP]),
    ).toBe(1);
  });
});
