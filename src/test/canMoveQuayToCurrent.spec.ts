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
import { canMoveQuayToCurrent } from "../components/modern/Map/markers/utils/canMoveQuayToCurrent";

const OPEN_STOP = { id: "NSR:StopPlace:1" };
const EDITABLE_SOURCE = { permissions: { canEdit: true } };
const READ_ONLY_SOURCE = { permissions: { canEdit: false } };

describe("moving a neighbour's quay to the open stop (F-46, F-108)", () => {
  test("allowed when both stops are editable", () => {
    expect(canMoveQuayToCurrent(OPEN_STOP, true, EDITABLE_SOURCE)).toBe(true);
  });

  test("not from a stop the user can't edit", () => {
    expect(canMoveQuayToCurrent(OPEN_STOP, true, READ_ONLY_SOURCE)).toBe(false);
  });

  test("not when the source is no longer loaded", () => {
    expect(canMoveQuayToCurrent(OPEN_STOP, true, undefined)).toBe(false);
  });

  test("not into a read-only, new or multimodal stop", () => {
    expect(canMoveQuayToCurrent(OPEN_STOP, false, EDITABLE_SOURCE)).toBe(false);
    expect(
      canMoveQuayToCurrent(
        { ...OPEN_STOP, isNewStop: true },
        true,
        EDITABLE_SOURCE,
      ),
    ).toBe(false);
    expect(
      canMoveQuayToCurrent(
        { ...OPEN_STOP, isParent: true },
        true,
        EDITABLE_SOURCE,
      ),
    ).toBe(false);
    expect(canMoveQuayToCurrent(null, true, EDITABLE_SOURCE)).toBe(false);
  });
});
