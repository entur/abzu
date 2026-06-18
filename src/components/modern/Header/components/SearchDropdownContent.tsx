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

import { Box } from "@mui/material";
import React from "react";
import { FilterSection, SearchInput } from "../../MainPage";
import { FavoriteStopPlaces } from "../../MainPage/components/FavoriteStopPlaces";
import { headerSearchContentContainer } from "../../styles";

interface SearchDropdownContentProps {
  isTablet: boolean;
  // SearchInput
  menuItems: any[];
  loading: boolean;
  stopPlaceSearchValue: string;
  showMoreFilterOptions: boolean;
  showFavorites: boolean;
  activeFilterCount: number;
  onSearchUpdate: (event: unknown, value: string, reason?: string) => void;
  onNewRequest: (event: any, result: any, reason?: string) => void;
  onToggleFilters: () => void;
  onToggleFavorites: () => void;
  // Panel close / favorites loading
  onClose: () => void;
  onLoadingChange: (loading: boolean, name: string) => void;
  onPendingNavigation: (id: string | null) => void;
  // FilterSection
  stopTypeFilter: string[];
  topographicalPlacesDataSource: any[];
  topographicPlaceFilterValue: string;
  topoiChips: any[];
  showFutureAndExpired: boolean;
  onToggleFilter: (flag: boolean) => void;
  onApplyModalityFilters: (filters: string[]) => void;
  onTopographicalPlaceInput: (
    event: unknown,
    value: string,
    reason?: string,
  ) => void;
  onAddChip: (event: unknown, chip: any) => void;
  onDeleteChip: (chipId: string) => void;
  onToggleShowFutureAndExpired: (value: boolean) => void;
}

/**
 * Shared dropdown content rendered inside both the desktop Paper panel and the
 * mobile slide-over panel. Avoids duplicating the SearchInput / FilterSection /
 * FavoriteStopPlaces tree in two places.
 */
export const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  isTablet,
  menuItems,
  loading,
  stopPlaceSearchValue,
  showMoreFilterOptions,
  showFavorites,
  activeFilterCount,
  onSearchUpdate,
  onNewRequest,
  onToggleFilters,
  onToggleFavorites,
  onClose,
  onLoadingChange,
  onPendingNavigation,
  stopTypeFilter,
  topographicalPlacesDataSource,
  topographicPlaceFilterValue,
  topoiChips,
  showFutureAndExpired,
  onToggleFilter,
  onApplyModalityFilters,
  onTopographicalPlaceInput,
  onAddChip,
  onDeleteChip,
  onToggleShowFutureAndExpired,
}) => (
  <Box sx={headerSearchContentContainer}>
    {/* Only show SearchInput in dropdown for mobile (desktop has it above the dropdown) */}
    {isTablet && (
      <SearchInput
        menuItems={menuItems}
        loading={loading}
        stopPlaceSearchValue={stopPlaceSearchValue}
        showFilters={showMoreFilterOptions}
        activeFilterCount={activeFilterCount}
        showFavorites={showFavorites}
        onSearchUpdate={onSearchUpdate}
        onNewRequest={onNewRequest}
        onToggleFilters={onToggleFilters}
        onToggleFavorites={onToggleFavorites}
      />
    )}

    {showFavorites && (
      <FavoriteStopPlaces
        onClose={onClose}
        onLoadingChange={onLoadingChange}
        onPendingNavigation={onPendingNavigation}
      />
    )}

    {showMoreFilterOptions && (
      <FilterSection
        showMoreFilterOptions={showMoreFilterOptions}
        stopTypeFilter={stopTypeFilter}
        topographicalPlacesDataSource={topographicalPlacesDataSource}
        topographicPlaceFilterValue={topographicPlaceFilterValue}
        topoiChips={topoiChips}
        showFutureAndExpired={showFutureAndExpired}
        onToggleFilter={onToggleFilter}
        onApplyModalityFilters={onApplyModalityFilters}
        onTopographicalPlaceInput={onTopographicalPlaceInput}
        onAddChip={onAddChip}
        onDeleteChip={onDeleteChip}
        onToggleShowFutureAndExpired={onToggleShowFutureAndExpired}
      />
    )}
  </Box>
);
