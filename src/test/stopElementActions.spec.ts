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
  actionsFor,
  placementLabelKey,
} from "../components/modern/Map/controls/utils/stopElementActions";

describe("stop element actions", () => {
  test("boarding position is offered only with a focused quay", () => {
    expect(actionsFor(false).map((a) => a.elementType)).toEqual([
      "quay",
      "parkAndRide",
      "bikeParking",
    ]);
    expect(actionsFor(true).map((a) => a.elementType)).toContain(
      "boardingPosition",
    );
  });

  test("placement labels name what is being placed", () => {
    expect(placementLabelKey("stopPlace")).toBe("map_add_stop_place");
    expect(placementLabelKey("quay")).toBe("map_add_quay");
    expect(placementLabelKey("unknown")).toBe("map_add_element");
  });
});
