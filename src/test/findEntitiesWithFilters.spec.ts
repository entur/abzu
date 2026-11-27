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

type Resolve = (value: unknown) => void;
const pending: Resolve[] = [];
const query = vi.fn(
  () => new Promise((resolve) => pending.push(resolve as Resolve)),
);

vi.mock("../graphql/clients", () => ({ getTiamatClient: () => ({ query }) }));
vi.mock("../actions/TiamatActions", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getContext: async () => ({}),
}));

const { findEntitiesWithFilters } =
  await import("../actions/TiamatActions.modern");

const getState = () => ({ user: { auth: {} } }) as never;
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("findEntitiesWithFilters (F-05)", () => {
  test("a slower answer to an older search doesn't overwrite a newer one", async () => {
    const dispatch = vi.fn();
    const older = findEntitiesWithFilters(
      "Sjø",
      [],
      [],
      false,
    )(dispatch, getState);
    await flush();
    const newer = findEntitiesWithFilters(
      "Sjøstrand",
      [],
      [],
      false,
    )(dispatch, getState);
    await flush();

    pending[1]({ data: { stopPlace: ["newer"] } });
    expect(await newer).toEqual({ isLatest: true });
    pending[0]({ data: { stopPlace: ["older"] } });
    expect(await older).toEqual({ isLatest: false });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].result.data.stopPlace).toEqual(["newer"]);
    expect(dispatch.mock.calls[0][0].variables.query).toBe("Sjøstrand");
  });
});
