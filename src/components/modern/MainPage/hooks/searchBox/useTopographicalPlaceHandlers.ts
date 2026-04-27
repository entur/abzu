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

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { UserActions } from "../../../../../actions/";
import { findTopographicalPlace } from "../../../../../actions/TiamatActions";
import { TopographicalDataSource } from "../../types";

/**
 * Hook for managing topographical place filtering
 * Handles adding/removing topographical chips and search
 */
export const useTopographicalPlaceHandlers = (
  searchText: string,
  stopTypeFilter: string[],
  topoiChips: any[],
  showFutureAndExpired: boolean,
  debouncedSearch: (
    searchText: string,
    stopPlaceTypes: string[],
    chips: any[],
    showFutureAndExpired: boolean,
  ) => void,
  setTopographicPlaceFilterValue: (value: string) => void,
) => {
  const dispatch = useDispatch() as any;

  const handleTopographicalPlaceInput = useCallback(
    (_event: any, searchText: string, reason?: string) => {
      if (reason && reason === "clear") {
        setTopographicPlaceFilterValue("");
      } else {
        // Always update the local input state
        setTopographicPlaceFilterValue(searchText || "");
      }
      dispatch(findTopographicalPlace(searchText));
    },
    [dispatch, setTopographicPlaceFilterValue],
  );

  const handleAddChip = useCallback(
    (_event: any, value: TopographicalDataSource | null) => {
      if (value == null) return;

      const { text, type, id } = value;
      if (searchText) {
        debouncedSearch(
          searchText,
          stopTypeFilter,
          topoiChips.concat({ text, type, value: id }),
          showFutureAndExpired,
        );
      }
      dispatch(UserActions.addToposChip({ text, type, value: id }));
      setTopographicPlaceFilterValue("");
    },
    [
      dispatch,
      debouncedSearch,
      searchText,
      stopTypeFilter,
      topoiChips,
      showFutureAndExpired,
      setTopographicPlaceFilterValue,
    ],
  );

  const handleDeleteChip = useCallback(
    (chipValue: string) => {
      if (searchText) {
        debouncedSearch(
          searchText,
          stopTypeFilter,
          topoiChips.filter((chip) => chip.value !== chipValue),
          showFutureAndExpired,
        );
      }
      dispatch(UserActions.deleteChip(chipValue));
    },
    [
      dispatch,
      debouncedSearch,
      searchText,
      stopTypeFilter,
      topoiChips,
      showFutureAndExpired,
    ],
  );

  return {
    handleTopographicalPlaceInput,
    handleAddChip,
    handleDeleteChip,
  };
};
