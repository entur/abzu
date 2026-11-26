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

/* F-32/F-73: delete for good = DeleteForever (red), deactivate = EventBusy,
   detach = LinkOff. A plain trash can blurred the three, so the modern UI
   must not import it again. */
const sources = import.meta.glob("../components/modern/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const PLAIN_TRASH = [
  /@mui\/icons-material\/Delete["']/,
  /@mui\/icons-material\/DeleteOutlined["']/,
  /@mui\/icons-material\/RemoveCircleOutline/,
  /\bDelete as \w+/,
];

describe("delete icon rule (F-73)", () => {
  test("no modern component uses the plain trash icon", () => {
    const offenders = Object.entries(sources)
      .filter(([, code]) => PLAIN_TRASH.some((pattern) => pattern.test(code)))
      .map(([path]) => path);
    expect(Object.keys(sources).length).toBeGreaterThan(50);
    expect(offenders).toEqual([]);
  });
});
