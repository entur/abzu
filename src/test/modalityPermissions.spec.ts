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
  getModalityAllowance,
  isModalityAllowed,
} from "../components/modern/Shared/StopNameAndType/modalityPermissions";

describe("modality permissions (F-18)", () => {
  test("no permissions means nothing is restricted", () => {
    expect(
      isModalityAllowed(getModalityAllowance(null), "railStation", null),
    ).toBe(true);
  });

  test("partial permissions don't throw and don't restrict", () => {
    const allowance = getModalityAllowance({});

    expect(isModalityAllowed(allowance, "railStation", null)).toBe(true);
    expect(isModalityAllowed(allowance, "railStation", "regionalRail")).toBe(
      true,
    );
  });

  test("a bus-only user may pick bus types and bus submodes only", () => {
    const allowance = getModalityAllowance({
      allowedStopPlaceTypes: ["onstreetBus"],
      bannedStopPlaceTypes: [],
      allowedSubmodes: [],
      bannedSubmodes: [],
    });

    expect(isModalityAllowed(allowance, "onstreetBus", null)).toBe(true);
    expect(isModalityAllowed(allowance, "onstreetBus", "localBus")).toBe(true);
    expect(isModalityAllowed(allowance, "railStation", null)).toBe(false);
    expect(isModalityAllowed(allowance, "railStation", "regionalRail")).toBe(
      false,
    );
  });

  test("a banned type is not allowed even with a wildcard", () => {
    const allowance = getModalityAllowance({
      allowedStopPlaceTypes: ["*"],
      bannedStopPlaceTypes: ["airport"],
    });

    expect(isModalityAllowed(allowance, "airport", null)).toBe(false);
    expect(isModalityAllowed(allowance, "ferryStop", null)).toBe(true);
  });
});
