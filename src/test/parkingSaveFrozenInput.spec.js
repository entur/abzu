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

import helpers from "../modelUtils/mapToQueryVariables";

beforeAll(() => {
  window.config = { ...window.config, defaultLanguageCode: "nb" };
});

const deepFreeze = (value) => {
  Object.values(value).forEach((child) => {
    if (child && typeof child === "object") deepFreeze(child);
  });
  return Object.freeze(value);
};

describe("mapParkingToVariables - the input comes from a read-only query result", () => {
  test("a save strips __typename without changing a frozen validBetween that has a from date", () => {
    const validBetween = deepFreeze({
      __typename: "ValidBetween",
      fromDate: "2020-01-01T00:00:00+02:00",
      toDate: "2022-06-01T12:32:22.286+03:00",
    });

    const [saved] = helpers.mapParkingToVariables(
      [{ totalCapacity: 5, validBetween }],
      "NSR:StopPlace:1",
    );

    expect(saved.validBetween).toEqual({
      fromDate: "2020-01-01T00:00:00+02:00",
      toDate: "2022-06-01T12:32:22.286+03:00",
    });
    expect(validBetween.__typename).toBe("ValidBetween");
  });

  test("a save omits a validBetween that has no from date", () => {
    const [saved] = helpers.mapParkingToVariables(
      [
        {
          totalCapacity: 5,
          validBetween: deepFreeze({
            __typename: "ValidBetween",
            fromDate: null,
            toDate: "2022-06-01T12:32:22.286+03:00",
          }),
        },
      ],
      "NSR:StopPlace:1",
    );

    expect(saved).not.toHaveProperty("validBetween");
  });

  test("a save sends a validBetween that has a from date", () => {
    const [saved] = helpers.mapParkingToVariables(
      [
        {
          totalCapacity: 5,
          validBetween: deepFreeze({
            __typename: "ValidBetween",
            fromDate: "2020-01-01T00:00:00+02:00",
            toDate: "2022-06-01T12:32:22.286+03:00",
          }),
        },
      ],
      "NSR:StopPlace:1",
    );

    expect(saved.validBetween).toEqual({
      fromDate: "2020-01-01T00:00:00+02:00",
      toDate: "2022-06-01T12:32:22.286+03:00",
    });
  });
});
