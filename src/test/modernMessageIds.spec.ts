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
import en from "../static/lang/en.json";
import fi from "../static/lang/fi.json";
import fr from "../static/lang/fr.json";
import nb from "../static/lang/nb.json";
import sv from "../static/lang/sv.json";

const sources = import.meta.glob(
  ["../components/modern/**/*.{ts,tsx}", "../containers/modern/**/*.{ts,tsx}"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

/** Literal ids only; ids built at runtime (`stopTypes_${key}_name`) are skipped. */
const LITERAL_ID = /formatMessage\(\s*\{\s*id:\s*"([^"]+)"/g;

const usedIds = [
  ...new Set(
    Object.values(sources).flatMap((source) =>
      [...source.matchAll(LITERAL_ID)].map(([, id]) => id),
    ),
  ),
].sort();

describe("message ids used by the modern UI", () => {
  test("the scan finds the ids", () => {
    expect(usedIds.length).toBeGreaterThan(100);
  });

  test.each(Object.entries({ en, nb, sv, fi, fr }))(
    "every literal id exists in %s",
    (_locale, messages) => {
      expect(usedIds.filter((id) => !(id in messages))).toEqual([]);
    },
  );
});
