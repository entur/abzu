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

const fitBounds = vi.fn();
const OSLO: [number, number] = [59.91, 10.75];
const BERGEN: [number, number] = [60.39, 5.32];
const DESKTOP_DRAWER = 450;

const state = {
  stopPlacesGroup: {
    current: { members: [{ location: OSLO }, { location: BERGEN }] } as {
      members: Array<{ location: [number, number]; hasExpired?: boolean }>;
    },
    centerPosition: [60, 8] as unknown,
  },
  stopPlace: { showExpiredStops: false },
  mapUtils: { activeMap: { fitBounds } as unknown },
};

vi.mock("../store/hooks", () => ({
  useAppSelector: (selector: (rootState: typeof state) => unknown) =>
    selector(state),
}));

const { useFitMapToGroupMembers } =
  await import("../components/modern/GroupOfStopPlaces/hooks/useFitMapToGroupMembers");

describe("useFitMapToGroupMembers", () => {
  beforeEach(() => {
    fitBounds.mockClear();
    state.stopPlacesGroup.current = {
      members: [{ location: OSLO }, { location: BERGEN }],
    };
    state.stopPlacesGroup.centerPosition = [60, 8];
    state.stopPlace.showExpiredStops = false;
    state.mapUtils.activeMap = { fitBounds };
  });

  test("leaves an expired member out unless expired stops are shown (F-87)", () => {
    state.stopPlacesGroup.current = {
      members: [{ location: OSLO }, { location: BERGEN, hasExpired: true }],
    };
    const { rerender } = renderHook(() => useFitMapToGroupMembers(0));
    expect(fitBounds.mock.calls[0][0]).toEqual([
      [10.75, 59.91],
      [10.75, 59.91],
    ]);

    state.stopPlace.showExpiredStops = true;
    state.stopPlacesGroup.centerPosition = [60, 8];
    rerender();
    expect(fitBounds.mock.calls[1][0]).toEqual([
      [5.32, 59.91],
      [10.75, 60.39],
    ]);
  });

  test("fits every member clear of the open drawer, at most zoom 17", () => {
    renderHook(() => useFitMapToGroupMembers(DESKTOP_DRAWER));
    expect(fitBounds).toHaveBeenCalledTimes(1);
    const [bounds, options] = fitBounds.mock.calls[0];
    expect(bounds).toEqual([
      [5.32, 59.91],
      [10.75, 60.39],
    ]);
    expect(options.maxZoom).toBe(17);
    expect(options.padding.left - options.padding.right).toBe(DESKTOP_DRAWER);
  });

  test("keeps the view for a group without members (F-83)", () => {
    state.stopPlacesGroup.current = { members: [] };
    renderHook(() => useFitMapToGroupMembers(0));
    expect(fitBounds).not.toHaveBeenCalled();
  });

  test("fits once the map is ready", () => {
    state.mapUtils.activeMap = undefined;
    const { rerender } = renderHook(() => useFitMapToGroupMembers(0));
    expect(fitBounds).not.toHaveBeenCalled();
    state.mapUtils.activeMap = { fitBounds };
    rerender();
    expect(fitBounds).toHaveBeenCalledTimes(1);
  });

  test("fits again when the group is loaded or saved again", () => {
    const { rerender } = renderHook(() => useFitMapToGroupMembers(0));
    state.stopPlacesGroup.centerPosition = [60, 8];
    rerender();
    expect(fitBounds).toHaveBeenCalledTimes(2);
  });

  test("opening or closing the drawer does not move the map", () => {
    const { rerender } = renderHook(
      ({ inset }) => useFitMapToGroupMembers(inset),
      { initialProps: { inset: DESKTOP_DRAWER } },
    );
    rerender({ inset: 0 });
    expect(fitBounds).toHaveBeenCalledTimes(1);
  });
});
