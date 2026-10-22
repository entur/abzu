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
  canOfferTerminate,
  hasSomethingToSave,
} from "../components/modern/EditStopPage/utils/stopPlaceActionRules";

const SAVED_STOP = { id: "NSR:StopPlace:1" };

describe("Deactivate is offered like in legacy", () => {
  test("edit rights are enough for an active stop", () => {
    expect(canOfferTerminate(SAVED_STOP, true, false)).toBe(true);
  });

  test("not without edit rights", () => {
    expect(canOfferTerminate(SAVED_STOP, false, true)).toBe(false);
  });

  test("not for a new, permanently terminated or child stop (F-43)", () => {
    expect(canOfferTerminate({ isNewStop: true }, true, true)).toBe(false);
    expect(
      canOfferTerminate(
        { ...SAVED_STOP, permanentlyTerminated: true },
        true,
        true,
      ),
    ).toBe(false);
    expect(
      canOfferTerminate({ ...SAVED_STOP, isChildOfParent: true }, true, true),
    ).toBe(false);
  });

  test("an expired stop can only be deleted, which needs delete rights", () => {
    const expired = { ...SAVED_STOP, hasExpired: true };
    expect(canOfferTerminate(expired, true, false)).toBe(false);
    expect(canOfferTerminate(expired, true, true)).toBe(true);
  });
});

describe("an expired stop can be saved unchanged, to reactivate it", () => {
  test("an edit or an expired stop is something to save", () => {
    expect(hasSomethingToSave(true, false)).toBe(true);
    expect(hasSomethingToSave(false, true)).toBe(true);
    expect(hasSomethingToSave(false, false)).toBe(false);
  });
});
