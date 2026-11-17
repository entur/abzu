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
import { validateCoordinatesText } from "../components/modern/Shared/coordinates/validateCoordinatesText";

const OSLO: [number, number] = [59.91, 10.75];

describe("typed coordinate text (F-114)", () => {
  test("a half-typed pair is invalid, not 59.9, 0", () => {
    expect(validateCoordinatesText("59.9,")).toEqual({
      status: "error",
      errorId: "change_coordinates_invalid",
    });
    expect(validateCoordinatesText("")).toMatchObject({ status: "error" });
    expect(validateCoordinatesText("abc, def")).toMatchObject({
      status: "error",
    });
  });

  test("an impossible position is out of range", () => {
    expect(validateCoordinatesText("91, 10")).toEqual({
      status: "error",
      errorId: "coordinates_out_of_range",
    });
  });

  test("comma and space separated pairs parse", () => {
    expect(validateCoordinatesText("59.91, 10.75")).toEqual({
      status: "ok",
      position: OSLO,
    });
    expect(validateCoordinatesText("59.91 10.75")).toEqual({
      status: "ok",
      position: OSLO,
    });
  });

  test("swapped lat and lng are far, with the swap offered", () => {
    const result = validateCoordinatesText("10.75, 59.91", OSLO);
    expect(result).toMatchObject({
      status: "far",
      position: [10.75, 59.91],
      swapped: OSLO,
    });
  });

  test("near the reference is ok", () => {
    expect(validateCoordinatesText("59.9101, 10.7501", OSLO)).toMatchObject({
      status: "ok",
    });
  });
});
