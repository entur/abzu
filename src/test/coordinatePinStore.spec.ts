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

import { describe, expect, test, vi } from "vitest";
import {
  clearCoordinatePin,
  getCoordinatePin,
  setCoordinatePin,
  subscribeToCoordinatePin,
} from "../components/modern/Map/coordinatePin/coordinatePinStore";

describe("coordinate pin (F-94)", () => {
  test("is set by go-to-coordinates and cleared once, telling the map each time", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToCoordinatePin(listener);
    setCoordinatePin([58.100494, 7.976486]);
    expect(getCoordinatePin()).toEqual([58.100494, 7.976486]);
    clearCoordinatePin();
    clearCoordinatePin();
    expect(getCoordinatePin()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
