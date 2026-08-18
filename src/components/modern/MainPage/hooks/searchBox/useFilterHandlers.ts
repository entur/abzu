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

/**
 * Hook for managing filter operations
 * Handles modality filters and future/expired toggle
 */
export const useFilterHandlers = (
  searchText: string,
  stopTypeFilter: string[],
  topoiChips: any[],
  debouncedSearch: (
    searchText: string,
    stopPlaceTypes: string[],
    chips: any[],
    showFutureAndExpired: boolean,
  ) => void,
  handleSearchUpdate: (event: any, searchText: string, reason?: string) => void,
) => {
  const dispatch = useDispatch() as any;

  const handleApplyModalityFilters = useCallback(
    (filters: string[]) => {
      if (searchText) {
        handleSearchUpdate(null, searchText);
      }
      dispatch(UserActions.applyStopTypeSearchFilter(filters));
    },
    [dispatch, handleSearchUpdate, searchText],
  );

  const toggleShowFutureAndExpired = useCallback(
    (value: boolean) => {
      if (searchText) {
        debouncedSearch(searchText, stopTypeFilter, topoiChips, value);
      }
      dispatch(UserActions.toggleShowFutureAndExpired(value));
    },
    [dispatch, debouncedSearch, searchText, stopTypeFilter, topoiChips],
  );

  const removeFiltersAndSearch = useCallback(() => {
    dispatch(UserActions.removeAllFilters());
    handleSearchUpdate(null, searchText);
  }, [dispatch, handleSearchUpdate, searchText]);

  return {
    handleApplyModalityFilters,
    toggleShowFutureAndExpired,
    removeFiltersAndSearch,
  };
};
