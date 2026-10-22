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
import { fitQuayLabel } from "../components/modern/Map/markers/utils/quayLabelFit";

describe("quay codes fit their marker (F-100)", () => {
  test("short codes keep the full size", () => {
    expect(fitQuayLabel("12")).toEqual({
      text: "12",
      fontScale: 1,
      isTruncated: false,
    });
  });

  test("longer codes shrink, but are shown in full up to five characters", () => {
    const four = fitQuayLabel("Odin");
    const five = fitQuayLabel("Venus");
    expect(four.text).toBe("Odin");
    expect(five.text).toBe("Venus");
    expect(five.fontScale).toBeLessThan(four.fontScale);
    expect(four.fontScale).toBeLessThan(1);
  });

  test("codes beyond five characters are cut with an ellipsis", () => {
    expect(fitQuayLabel("Jupiter")).toMatchObject({
      text: "Jupi…",
      isTruncated: true,
    });
  });
});
