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

const sources = import.meta.glob(
  ["../components/modern/**/*.tsx", "../containers/modern/**/*.tsx"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

/** A color="…" attribute inside a <Typography …> opening tag. */
const TYPOGRAPHY_COLOR_PROP = /<Typography\b[^>]*?\scolor="/;

describe("Typography colours (S-18)", () => {
  test('no <Typography color="…">: MUI v9 ignores it; use sx={{ color }}', () => {
    const offenders = Object.entries(sources)
      .filter(([, source]) => TYPOGRAPHY_COLOR_PROP.test(source))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});
