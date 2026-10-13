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
import formatHelpers from "../modelUtils/mapToClient";
import QueryVariablesMapper from "../modelUtils/mapToQueryVariables";
import clientStop from "./reducers/json/clientStop.json";

window.config = {
  defaultLanguageCode: "nor",
};

const PLACEMENT = {
  type: "quay",
  position: [59.9, 10.7],
  focusedElement: null,
};

describe("mapStopToVariables (F-19)", () => {
  test("sends a null submode instead of an empty string", () => {
    const variables = QueryVariablesMapper.mapStopToVariables({
      ...clientStop,
      stopPlaceType: "onstreetBus",
      submode: "",
    });

    expect(variables.submode).toBeNull();
  });

  test("keeps a real submode", () => {
    const variables = QueryVariablesMapper.mapStopToVariables({
      ...clientStop,
      stopPlaceType: "railStation",
      submode: "regionalRail",
    });

    expect(variables.submode).toBe("regionalRail");
  });
});

describe("updateCurrentWithNewElement (F-35)", () => {
  test("leaves a multimodal parent untouched instead of crashing", () => {
    const parent = { id: "NSR:StopPlace:9", isParent: true, children: [] };

    expect(() =>
      formatHelpers.updateCurrentWithNewElement(parent, PLACEMENT),
    ).not.toThrow();
    expect(formatHelpers.updateCurrentWithNewElement(parent, PLACEMENT)).toBe(
      parent,
    );
  });

  test("adds a quay to a stop that has no quay list yet", () => {
    const stop = { id: null, name: "New stop" };

    const updated = formatHelpers.updateCurrentWithNewElement(stop, PLACEMENT);

    expect(updated.quays).toHaveLength(1);
    expect(updated.quays[0].location).toEqual(PLACEMENT.position);
  });
});
