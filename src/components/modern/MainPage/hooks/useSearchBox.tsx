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

import { UseSearchBoxProps, UseSearchBoxReturn } from "../types";
import { useFavoriteHandlers } from "./searchBox/useFavoriteHandlers";
import { useFilterHandlers } from "./searchBox/useFilterHandlers";
import { useSearchHandlers } from "./searchBox/useSearchHandlers";
import { useSearchMenuItems } from "./searchBox/useSearchMenuItems";
import { useSearchState } from "./searchBox/useSearchState";
import { useTopographicalPlaceHandlers } from "./searchBox/useTopographicalPlaceHandlers";

/**
 * Main orchestrator hook for search box
 * Combines all sub-hooks and provides unified interface
 * Refactored from 511 lines into 6 focused hooks
 */
export const useSearchBox = ({
  dataSource,
  stopTypeFilter,
  topoiChips,
  topographicalPlaces,
  showFutureAndExpired,
  searchText,
  formatMessage,
}: UseSearchBoxProps): UseSearchBoxReturn => {
  // 1. State management
  const {
    showMoreFilterOptions,
    loading,
    setLoading,
    loadingSelection,
    setLoadingSelection,
    loadingStopPlaceName,
    setLoadingStopPlaceName,
    stopPlaceSearchValue,
    setStopPlaceSearchValue,
    topographicPlaceFilterValue,
    setTopographicPlaceFilterValue,
    handleToggleFilter,
  } = useSearchState();

  // 2. Search handlers (includes debounced search)
  const { debouncedSearch, handleSearchUpdate, handleNewRequest } =
    useSearchHandlers(
      stopTypeFilter,
      topoiChips,
      showFutureAndExpired,
      setLoading,
      setLoadingSelection,
      setLoadingStopPlaceName,
      setStopPlaceSearchValue,
    );

  // 3. Filter handlers
  const {
    handleApplyModalityFilters,
    toggleShowFutureAndExpired,
    removeFiltersAndSearch,
  } = useFilterHandlers(
    searchText,
    stopTypeFilter,
    topoiChips,
    debouncedSearch,
    handleSearchUpdate,
  );

  // 4. Topographical place handlers
  const { handleTopographicalPlaceInput, handleAddChip, handleDeleteChip } =
    useTopographicalPlaceHandlers(
      searchText,
      stopTypeFilter,
      topoiChips,
      showFutureAndExpired,
      debouncedSearch,
      setTopographicPlaceFilterValue,
    );

  // 5. Favorite handlers
  const { handleSaveAsFavorite, handleRetrieveFilter } =
    useFavoriteHandlers(handleSearchUpdate);

  // 6. Computed values (menu items and topographical data sources)
  const { menuItems, topographicalPlacesDataSource } = useSearchMenuItems(
    dataSource,
    searchText,
    formatMessage,
    stopTypeFilter,
    topoiChips,
    topographicalPlaces,
    removeFiltersAndSearch,
  );

  return {
    // Local state
    showMoreFilterOptions,
    loading,
    loadingSelection,
    loadingStopPlaceName,
    stopPlaceSearchValue,
    topographicPlaceFilterValue,

    // Handlers
    handleSearchUpdate,
    handleNewRequest,
    handleApplyModalityFilters,
    handleToggleFilter,
    handleAddChip,
    handleDeleteChip,
    handleSaveAsFavorite,
    handleRetrieveFilter,
    handleTopographicalPlaceInput,
    removeFiltersAndSearch,
    toggleShowFutureAndExpired,

    // Computed values
    menuItems,
    topographicalPlacesDataSource,
  };
};
