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
import { isOlderVersion } from "../components/modern/Shared/StopStatus/olderVersion";

const VERSIONS = [{ version: "14" }, { version: "13" }, { version: "6" }];

describe("isOlderVersion (F-42)", () => {
  test("the newest version is not older", () => {
    expect(isOlderVersion({ version: "14" }, VERSIONS)).toBe(false);
  });

  test("a version picked from the history is older", () => {
    expect(isOlderVersion({ version: 6 }, VERSIONS)).toBe(true);
  });

  test("a normal load (no versions fetched) is never older", () => {
    expect(isOlderVersion({ version: "6" }, [])).toBe(false);
  });

  test("child stops are versioned through their parent", () => {
    expect(
      isOlderVersion({ version: "6", isChildOfParent: true }, VERSIONS),
    ).toBe(false);
  });
});
