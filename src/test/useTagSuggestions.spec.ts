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
  TAG_SEARCH_DEBOUNCE_MS,
  type TagSearchResult,
  useTagSuggestions,
} from "../components/modern/Dialogs/TagsDialog/hooks/useTagSuggestions";

type Resolve = (value: TagSearchResult) => void;

const deferredSearch = () => {
  const pending: Record<string, Resolve> = {};
  const findTagByName = vi.fn(
    (name: string) =>
      new Promise<TagSearchResult>((resolve) => {
        pending[name] = resolve;
      }),
  );
  return { findTagByName, pending };
};

const tags = (...names: string[]): TagSearchResult => ({
  data: { tags: names.map((name) => ({ name })) },
});

describe("useTagSuggestions (F-60)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test("typing quickly sends one search, for the final text", () => {
    const { findTagByName } = deferredSearch();
    const { result } = renderHook(() => useTagSuggestions(findTagByName));

    act(() => {
      ["ko", "koo", "koor", "koord", "koordi"].forEach((text) =>
        result.current.searchTags(text),
      );
      vi.advanceTimersByTime(TAG_SEARCH_DEBOUNCE_MS);
    });

    expect(findTagByName).toHaveBeenCalledTimes(1);
    expect(findTagByName).toHaveBeenCalledWith("koordi");
  });

  test("a late answer to an older search is ignored", async () => {
    const { findTagByName, pending } = deferredSearch();
    const { result } = renderHook(() => useTagSuggestions(findTagByName));

    act(() => {
      result.current.searchTags("ko");
      vi.advanceTimersByTime(TAG_SEARCH_DEBOUNCE_MS);
      result.current.searchTags("koordi");
      vi.advanceTimersByTime(TAG_SEARCH_DEBOUNCE_MS);
    });

    await act(async () => pending.koordi(tags("adm_koordinat")));
    await act(async () => pending.ko(tags("kommune", "kontor")));

    expect(result.current.suggestions.map((tag) => tag.name)).toEqual([
      "adm_koordinat",
    ]);
    expect(result.current.isSearching).toBe(false);
  });

  test("text shorter than two letters clears the list without searching", async () => {
    const { findTagByName, pending } = deferredSearch();
    const { result } = renderHook(() => useTagSuggestions(findTagByName));

    act(() => {
      result.current.searchTags("ko");
      vi.advanceTimersByTime(TAG_SEARCH_DEBOUNCE_MS);
    });
    await act(async () => pending.ko(tags("kommune")));
    act(() => {
      result.current.searchTags("k");
      vi.advanceTimersByTime(TAG_SEARCH_DEBOUNCE_MS);
    });

    expect(findTagByName).toHaveBeenCalledTimes(1);
    expect(result.current.suggestions).toEqual([]);
  });
});
