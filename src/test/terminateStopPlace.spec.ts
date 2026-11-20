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
import { beforeEach, describe, expect, test, vi } from "vitest";

const calls: string[] = [];
const results = { detach: {} as unknown, terminate: {} as unknown };
const reloadStopPlace = vi.fn();

vi.mock("../actions/TiamatActions.modern", () => ({
  deleteStopPlace: () => ({ step: "delete" }),
  removeStopPlaceFromMultiModalStop: (
    parentId: string,
    childIds: string[],
  ) => ({
    step: `detach ${parentId} ${childIds.join(",")}`,
    result: () => results.detach,
  }),
  terminateStop: (id: string) => ({
    step: `terminate ${id}`,
    result: () => results.terminate,
  }),
}));

vi.mock("../actions", () => ({
  UserActions: {
    hideDeleteStopDialog: () => ({ step: "close dialog" }),
    navigateToMainAfterDelete: () => ({ step: "navigate" }),
  },
}));

vi.mock("../store/hooks", () => ({
  useAppDispatch:
    () =>
    (action: { step: string; result?: () => unknown }): unknown => {
      calls.push(action.step);
      return action.result ? Promise.resolve(action.result()) : action;
    },
}));

vi.mock("../components/modern/Shared/hooks/useReloadStopPlace", () => ({
  useReloadStopPlace: () => reloadStopPlace,
}));

const { useTerminateStopPlace } =
  await import("../components/modern/Shared/useTerminateStopPlace");

const PARENT_ID = "NSR:StopPlace:1";
const CHILD_IDS = ["NSR:StopPlace:2", "NSR:StopPlace:3"];
const DEACTIVATE = [false, false, "comment", "2026-11-11T12:00:00Z"] as const;

describe("useTerminateStopPlace", () => {
  beforeEach(() => {
    calls.length = 0;
    results.detach = {};
    results.terminate = {};
    reloadStopPlace.mockClear();
  });

  test("detaches a parent's children before deactivating it, then reloads", async () => {
    const { result } = renderHook(() =>
      useTerminateStopPlace(PARENT_ID, CHILD_IDS),
    );
    await result.current(...DEACTIVATE);
    expect(calls).toEqual([
      `detach ${PARENT_ID} ${CHILD_IDS.join(",")}`,
      `terminate ${PARENT_ID}`,
      "close dialog",
    ]);
    expect(reloadStopPlace).toHaveBeenCalledWith(PARENT_ID);
  });

  test("a stop without children is only deactivated", async () => {
    const { result } = renderHook(() => useTerminateStopPlace(PARENT_ID));
    await result.current(...DEACTIVATE);
    expect(calls).toEqual([`terminate ${PARENT_ID}`, "close dialog"]);
  });

  test("a refused detach stops before deactivating and keeps the dialog open", async () => {
    results.detach = undefined;
    const { result } = renderHook(() =>
      useTerminateStopPlace(PARENT_ID, CHILD_IDS),
    );
    await expect(result.current(...DEACTIVATE)).rejects.toThrow();
    expect(calls).toEqual([`detach ${PARENT_ID} ${CHILD_IDS.join(",")}`]);
    expect(reloadStopPlace).not.toHaveBeenCalled();
  });

  test("a refused deactivation (GraphQL errors, HTTP 200) rejects", async () => {
    results.terminate = undefined;
    const { result } = renderHook(() => useTerminateStopPlace(PARENT_ID));
    await expect(result.current(...DEACTIVATE)).rejects.toThrow();
    expect(calls).not.toContain("close dialog");
  });
});
