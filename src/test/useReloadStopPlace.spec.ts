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

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const STOP_PLACE_ID = "NSR:StopPlace:1";
const MAP_BOUNDS = "bounds";

const calls: string[] = [];
const control = { fail: false };
const state = {
  mapUtils: { activeMap: { getBounds: () => MAP_BOUNDS } as unknown },
  stopPlace: { showExpiredStops: false },
};

vi.mock("../actions/TiamatActions.modern", () => ({
  getStopPlaceVersions: (id: string) => ({ step: `versions ${id}` }),
  getNeighbourStops: (id: string, bounds: string, includeExpired: boolean) => ({
    step: `neighbours ${id} ${bounds} ${includeExpired}`,
  }),
  getStopPlaceWithAll: (id: string) => ({ step: `stop ${id}` }),
}));

vi.mock("../store/hooks", () => ({
  useAppDispatch:
    () =>
    (action: { step: string }): Promise<void> => {
      calls.push(action.step);
      return control.fail
        ? Promise.reject(new Error(`${action.step} failed`))
        : Promise.resolve();
    },
  useAppSelector: (selector: (rootState: typeof state) => unknown) =>
    selector(state),
}));

const { useReloadStopPlace } =
  await import("../components/modern/Shared/hooks/useReloadStopPlace");

/** Lets Node report any rejection that nothing handled. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

/* Vitest runs in Node, but the tsconfig has no Node types: type only the two
   process methods this test needs. */
type RejectionListener = (reason: unknown) => void;
interface RejectionEvents {
  on(event: "unhandledRejection", listener: RejectionListener): void;
  off(event: "unhandledRejection", listener: RejectionListener): void;
}
const nodeProcess = (globalThis as unknown as { process: RejectionEvents })
  .process;

describe("useReloadStopPlace", () => {
  const unhandled: unknown[] = [];
  const recordUnhandled = (reason: unknown) => unhandled.push(reason);

  beforeEach(() => {
    calls.length = 0;
    unhandled.length = 0;
    control.fail = false;
    state.mapUtils.activeMap = { getBounds: () => MAP_BOUNDS };
    nodeProcess.on("unhandledRejection", recordUnhandled);
  });

  afterEach(() => {
    nodeProcess.off("unhandledRejection", recordUnhandled);
  });

  test("reloads the versions, the neighbour stops and the stop itself", async () => {
    const { result } = renderHook(() => useReloadStopPlace());
    result.current(STOP_PLACE_ID);
    await settle();
    expect(calls).toEqual([
      `versions ${STOP_PLACE_ID}`,
      `neighbours ${STOP_PLACE_ID} ${MAP_BOUNDS} false`,
      `stop ${STOP_PLACE_ID}`,
    ]);
  });

  test("skips the neighbour stops when no map is open", async () => {
    state.mapUtils.activeMap = undefined;
    const { result } = renderHook(() => useReloadStopPlace());
    result.current(STOP_PLACE_ID);
    await settle();
    expect(calls).toEqual([
      `versions ${STOP_PLACE_ID}`,
      `stop ${STOP_PLACE_ID}`,
    ]);
  });

  test("a failed reload leaves no unhandled rejection", async () => {
    control.fail = true;
    const { result } = renderHook(() => useReloadStopPlace());
    result.current(STOP_PLACE_ID);
    await settle();
    expect(calls).toHaveLength(3);
    expect(unhandled).toEqual([]);
  });
});
