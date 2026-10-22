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
  checkTypedPosition,
  distanceInMeters,
  isValidPosition,
  suggestSwappedPosition,
} from "../components/modern/Shared/coordinates/coordinateChecks";

const LINDESNES_STOP: [number, number] = [57.99328, 7.04074];
const OSLO: [number, number] = [59.91, 10.75];

describe("typed coordinate checks (F-103)", () => {
  test("rejects impossible positions", () => {
    expect(isValidPosition([91, 10])).toBe(false);
    expect(isValidPosition([59, 181])).toBe(false);
    expect(isValidPosition([Number.POSITIVE_INFINITY, 10])).toBe(false);
    expect(isValidPosition(OSLO)).toBe(true);
  });

  test("measures distance in metres", () => {
    const distance = distanceInMeters(LINDESNES_STOP, OSLO);
    expect(distance).toBeGreaterThan(250_000);
    expect(distance).toBeLessThan(350_000);
    expect(distanceInMeters(OSLO, OSLO)).toBe(0);
  });

  test("a quay next to its stop is fine", () => {
    expect(checkTypedPosition([57.9935, 7.0409], LINDESNES_STOP)).toEqual({
      status: "ok",
    });
  });

  test("a quay 300 km away asks first, without a swap hint", () => {
    const check = checkTypedPosition(OSLO, LINDESNES_STOP);
    expect(check.status).toBe("far");
    if (check.status === "far") expect(check.swapped).toBeNull();
  });

  test("swapped lat and lng are spotted", () => {
    expect(suggestSwappedPosition([10.75, 59.91], OSLO)).toEqual(OSLO);
    const check = checkTypedPosition([10.75, 59.91], OSLO);
    expect(check.status).toBe("far");
    if (check.status === "far") expect(check.swapped).toEqual(OSLO);
  });

  test("without a reference only the range is checked", () => {
    expect(checkTypedPosition(OSLO)).toEqual({ status: "ok" });
    expect(checkTypedPosition([95, 10])).toEqual({ status: "invalid" });
  });
});
