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
  parseModalityPickerValue,
  toModalityPickerValue,
} from "../components/modern/EditStopPage/utils/modalityPickerValue";

describe("parseModalityPickerValue (F-19)", () => {
  test("a bare stop type gives a null submode, never an empty string", () => {
    expect(parseModalityPickerValue("onstreetBus|")).toEqual({
      stopPlaceType: "onstreetBus",
      submode: null,
    });
  });

  test("a type without any submodes (bus terminal) gives a null submode", () => {
    expect(parseModalityPickerValue("busStation|").submode).toBeNull();
  });

  test("keeps a chosen submode", () => {
    expect(parseModalityPickerValue("railStation|regionalRail")).toEqual({
      stopPlaceType: "railStation",
      submode: "regionalRail",
    });
  });

  test("round-trips through toModalityPickerValue", () => {
    const value = toModalityPickerValue("onstreetBus", null);

    expect(value).toBe("onstreetBus|");
    expect(parseModalityPickerValue(value).submode).toBeNull();
  });
});
