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
  getMutationErrorMessageId,
  INSUFFICIENT_PRIVILEGES_MESSAGE_ID,
} from "../components/modern/Dialogs/utils/mutationErrorMessage";

const FALLBACK = "move_quay_failed";

describe("mutation error messages (F-105, F-108)", () => {
  test("a 403 is reported as missing rights", () => {
    expect(getMutationErrorMessageId({ statusCode: 403 }, FALLBACK)).toBe(
      INSUFFICIENT_PRIVILEGES_MESSAGE_ID,
    );
    expect(
      getMutationErrorMessageId(
        new Error("Response not successful: Received status code 403"),
        FALLBACK,
      ),
    ).toBe(INSUFFICIENT_PRIVILEGES_MESSAGE_ID);
  });

  test("Tiamat's privilege error in a GraphQL error counts too", () => {
    const error = {
      errors: [{ message: "Insufficient privileges for operation" }],
    };
    expect(getMutationErrorMessageId(error, FALLBACK)).toBe(
      INSUFFICIENT_PRIVILEGES_MESSAGE_ID,
    );
  });

  test("anything else uses the dialog's own message", () => {
    expect(
      getMutationErrorMessageId(
        new Error("Response not successful: Received status code 400"),
        FALLBACK,
      ),
    ).toBe(FALLBACK);
    expect(getMutationErrorMessageId(undefined, FALLBACK)).toBe(FALLBACK);
  });
});
