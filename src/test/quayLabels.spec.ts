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
  getQuayMarkerLabel,
  getQuayTitle,
} from "../components/modern/Shared/quayLabels";

const MESSAGES: Record<string, string> = { quay: "Quay", new_quay: "New quay" };
const formatMessage = ({ id }: { id: string }) => MESSAGES[id];
const SAVED = { id: "NSR:Quay:1", publicCode: null };
const UNSAVED = { id: null, publicCode: null };

describe("quay labels (F-20)", () => {
  test("a public code is used everywhere", () => {
    const quay = { id: "NSR:Quay:1", publicCode: "A" };

    expect(getQuayTitle(quay, 0, formatMessage)).toBe("Quay A");
    expect(getQuayMarkerLabel(quay, "A", 0)).toBe("A");
  });

  test("a saved quay without a code gets no made-up number", () => {
    expect(getQuayTitle(SAVED, 0, formatMessage)).toBe("Quay");
    expect(getQuayMarkerLabel(SAVED, null, 0)).toBe("");
  });

  test("an unsaved quay keeps a running number, shown as new", () => {
    expect(getQuayTitle(UNSAVED, 1, formatMessage)).toBe("New quay 2");
    expect(getQuayMarkerLabel(UNSAVED, null, 1)).toBe("2");
  });
});
