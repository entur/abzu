/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useCallback, useState } from "react";
import { FilterState, TopographicChip } from "../types";

const defaultFilters: FilterState = {
  searchQuery: "",
  stopTypeFilter: [],
  topoiChips: [],
  topographicPlaceFilterValue: "",
  withoutLocationOnly: false,
  withDuplicateImportedIds: false,
  withNearbySimilarDuplicates: false,
  hasParking: false,
  showFutureAndExpired: false,
  withTags: false,
  tags: [],
};

export interface UseReportFiltersResult {
  filters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: unknown) => void;
  handleTagCheck: (name: string, checked: boolean) => void;
  handleAddTopographicChip: (
    _event: unknown,
    chip: TopographicChip | string | null,
  ) => void;
  handleDeleteTopographicChip: (chipId: string) => void;
  setTopoiChips: (chips: TopographicChip[]) => void;
}

export const useReportFilters = (
  initialState: Partial<FilterState>,
): UseReportFiltersResult => {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialState,
  });

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleTagCheck = useCallback((name: string, checked: boolean) => {
    setFilters((prev) => {
      let nextTags = prev.tags.slice();
      if (checked) {
        nextTags.push(name);
      } else {
        nextTags = nextTags.filter((t) => t !== name);
      }
      return { ...prev, tags: nextTags };
    });
  }, []);

  const handleAddTopographicChip = useCallback(
    (_event: unknown, chip: TopographicChip | string | null) => {
      if (chip && typeof chip !== "string") {
        setFilters((prev) => {
          const addedIds = prev.topoiChips.map((tc) => tc.id);
          if (addedIds.indexOf(chip.id) === -1) {
            return {
              ...prev,
              topoiChips: [...prev.topoiChips, chip],
              topographicPlaceFilterValue: "",
            };
          }
          return prev;
        });
      }
    },
    [],
  );

  const handleDeleteTopographicChip = useCallback((chipId: string) => {
    setFilters((prev) => ({
      ...prev,
      topoiChips: prev.topoiChips.filter((tc) => tc.id !== chipId),
    }));
  }, []);

  const setTopoiChips = useCallback((chips: TopographicChip[]) => {
    setFilters((prev) => ({ ...prev, topoiChips: chips }));
  }, []);

  return {
    filters,
    handleFilterChange,
    handleTagCheck,
    handleAddTopographicChip,
    handleDeleteTopographicChip,
    setTopoiChips,
  };
};
