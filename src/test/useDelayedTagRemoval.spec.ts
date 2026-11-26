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

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  UNDO_WINDOW_MS,
  useDelayedTagRemoval,
} from "../components/modern/Dialogs/TagsDialog/hooks/useDelayedTagRemoval";

describe("useDelayedTagRemoval (F-59)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test("the tag is removed only when the undo window ends", () => {
    const removeNow = vi.fn();
    const { result } = renderHook(() => useDelayedTagRemoval(removeNow));

    act(() => result.current.scheduleRemoval("adm_koordinat"));
    expect(result.current.pendingName).toBe("adm_koordinat");
    act(() => vi.advanceTimersByTime(UNDO_WINDOW_MS - 1));
    expect(removeNow).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(removeNow).toHaveBeenCalledWith("adm_koordinat");
    expect(result.current.pendingName).toBeNull();
  });

  test("undo keeps the tag", () => {
    const removeNow = vi.fn();
    const { result } = renderHook(() => useDelayedTagRemoval(removeNow));

    act(() => result.current.scheduleRemoval("adm_koordinat"));
    act(() => result.current.undoRemoval());
    act(() => vi.advanceTimersByTime(UNDO_WINDOW_MS));

    expect(removeNow).not.toHaveBeenCalled();
    expect(result.current.pendingName).toBeNull();
  });

  test("removing a second tag completes the first one", () => {
    const removeNow = vi.fn();
    const { result } = renderHook(() => useDelayedTagRemoval(removeNow));

    act(() => result.current.scheduleRemoval("adm_koordinat"));
    act(() => result.current.scheduleRemoval("adm_huskelapp"));

    expect(removeNow).toHaveBeenCalledTimes(1);
    expect(removeNow).toHaveBeenCalledWith("adm_koordinat");
    expect(result.current.pendingName).toBe("adm_huskelapp");
  });

  test("closing or unmounting completes a waiting removal", () => {
    const removeNow = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDelayedTagRemoval(removeNow),
    );

    act(() => result.current.scheduleRemoval("adm_koordinat"));
    act(() => result.current.flushRemoval());
    expect(removeNow).toHaveBeenCalledWith("adm_koordinat");

    act(() => result.current.scheduleRemoval("adm_huskelapp"));
    unmount();
    expect(removeNow).toHaveBeenLastCalledWith("adm_huskelapp");
    expect(removeNow).toHaveBeenCalledTimes(2);
  });
});
