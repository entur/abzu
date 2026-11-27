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

import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Tag } from "./useTagsDialog";

export const TAG_SEARCH_DEBOUNCE_MS = 200;
export const TAG_SEARCH_MIN_LENGTH = 2;
const MAX_SUGGESTIONS = 5;

export interface TagSearchResult {
  data?: { tags?: Tag[] };
}

export interface TagSuggestions {
  suggestions: Tag[];
  isSearching: boolean;
  /** Schedules a search for this text; shorter texts clear the list. */
  searchTags: (text: string) => void;
  clearSuggestions: () => void;
}

/**
 * Tag-name suggestions for the add-tag field (F-60). Searches once typing
 * pauses, not on every keystroke, and keeps only the answer to the newest
 * search, so a slow answer for "ko" can't replace the one for "koordi".
 */
export const useTagSuggestions = (
  findTagByName: (name: string) => Promise<TagSearchResult>,
): TagSuggestions => {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const latestRequestRef = useRef(0);
  const findTagByNameRef = useRef(findTagByName);
  findTagByNameRef.current = findTagByName;

  const runSearch = useMemo(
    () =>
      debounce((text: string) => {
        const request = ++latestRequestRef.current;
        findTagByNameRef
          .current(text)
          .then((result) => {
            if (request !== latestRequestRef.current) return;
            setSuggestions(
              (result?.data?.tags ?? []).slice(0, MAX_SUGGESTIONS),
            );
          })
          .catch(() => {
            if (request === latestRequestRef.current) setSuggestions([]);
          })
          .finally(() => {
            if (request === latestRequestRef.current) setIsSearching(false);
          });
      }, TAG_SEARCH_DEBOUNCE_MS),
    [],
  );

  useEffect(() => () => runSearch.cancel(), [runSearch]);

  const clearSuggestions = useCallback(() => {
    runSearch.cancel();
    latestRequestRef.current += 1;
    setSuggestions([]);
    setIsSearching(false);
  }, [runSearch]);

  const searchTags = useCallback(
    (text: string) => {
      if (text.trim().length < TAG_SEARCH_MIN_LENGTH) {
        clearSuggestions();
        return;
      }
      setIsSearching(true);
      runSearch(text);
    },
    [runSearch, clearSuggestions],
  );

  return { suggestions, isSearching, searchTags, clearSuggestions };
};
