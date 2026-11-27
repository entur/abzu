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
  columnOptionsQuays,
  columnOptionsStopPlace,
} from "../config/columnOptions";
import {
  ColumnTransformerQuaysJsx,
  ColumnTransformerStopPlaceJsx,
  ColumnTransformersQuays,
  ColumnTransformersStopPlace,
} from "../models/columnTransformers";

const formatMessage = ({ id }) => id;

const stopWithoutAssessment = {
  id: "NSR:StopPlace:1",
  name: "Test stop",
  stopPlaceType: "onstreetBus",
  importedId: [],
  location: [59.9, 10.7],
  quays: [],
  parking: [],
  tags: [],
  validBetween: {},
};

const stopWithAssessment = {
  ...stopWithoutAssessment,
  accessibilityAssessment: {
    limitations: { wheelchairAccess: "TRUE", stepFreeAccess: "FALSE" },
  },
};

const quayWithoutAssessment = {
  id: "NSR:Quay:1",
  importedId: [],
  location: [59.9, 10.7],
  stopPlaceId: "NSR:StopPlace:1",
  stopPlaceName: "Test stop",
};

const emptyDuplicateInfo = {
  stopPlacesWithConflict: [],
  quaysWithDuplicateImportedIds: {},
  fullConflictMap: {},
};

// Every column the report lets the user tick must have a transformer that
// renders without throwing (a missing import once crashed the whole page).
describe("report column transformers", () => {
  test.each(columnOptionsStopPlace.map(({ id }) => id))(
    "stop place column %s renders and exports",
    (columnId) => {
      for (const stop of [stopWithoutAssessment, stopWithAssessment]) {
        expect(() =>
          ColumnTransformerStopPlaceJsx[columnId](stop, formatMessage),
        ).not.toThrow();
        expect(() => ColumnTransformersStopPlace[columnId](stop)).not.toThrow();
      }
    },
  );

  test.each(columnOptionsQuays.map(({ id }) => id))(
    "quay column %s renders and exports",
    (columnId) => {
      expect(() =>
        ColumnTransformerQuaysJsx[columnId](
          quayWithoutAssessment,
          emptyDuplicateInfo,
          formatMessage,
        ),
      ).not.toThrow();
      expect(() =>
        ColumnTransformersQuays[columnId](quayWithoutAssessment),
      ).not.toThrow();
    },
  );

  test("missing accessibility data exports as UNKNOWN", () => {
    expect(
      ColumnTransformersStopPlace.stepFreeAccess(stopWithoutAssessment),
    ).toBe("UNKNOWN");
  });
});
