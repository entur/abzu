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

import { Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { flushSync } from "react-dom";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  CoordinatesDialogs,
  FilterSection,
  RootState,
  SearchInput,
  SearchResultDetails,
} from "../../MainPage";
import { FavoriteStopPlaces } from "../../MainPage/components/FavoriteStopPlaces";
import { useSearchBox } from "../../MainPage/hooks/useSearchBox";

export const HeaderSearch: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const {
    chosenResult,
    missingCoordinatesMap,
    stopTypeFilter,
    topoiChips,
    topographicalPlaces,
    canEdit,
    lookupCoordinatesOpen,
    dataSource,
    showFutureAndExpired,
    searchText,
  } = useSelector((state: RootState) => ({
    chosenResult: state.stopPlace.activeSearchResult,
    dataSource: state.stopPlace.searchResults || [],
    isCreatingNewStop: state.user.isCreatingNewStop,
    stopTypeFilter: state.user.searchFilters.stopType,
    topoiChips: state.user.searchFilters.topoiChips,
    favorited: state.user.favorited,
    missingCoordinatesMap: state.user.missingCoordsMap,
    searchText: state.user.searchFilters.text,
    topographicalPlaces: state.stopPlace.topographicalPlaces || [],
    canEdit: state.stopPlace.activeSearchResult
      ? (state.stopPlace.permissions?.canEdit ?? false)
      : (state.stopPlace.current?.permissions?.canEdit ?? false),
    lookupCoordinatesOpen: state.user.lookupCoordinatesOpen,
    newStopIsMultiModal: state.user.newStopIsMultiModal,
    showFutureAndExpired: state.user.searchFilters.showFutureAndExpired,
    isGuest: state.user.isGuest,
  }));

  const {
    showMoreFilterOptions,
    loading,
    stopPlaceSearchValue,
    topographicPlaceFilterValue,
    coordinatesDialogOpen,
    handleSearchUpdate,
    handleNewRequest,
    handleApplyModalityFilters,
    handleToggleFilter,
    handleAddChip,
    handleDeleteChip,
    handleEdit,
    handleLookupCoordinates,
    handleSubmitCoordinates,
    handleOpenCoordinatesDialog,
    handleCloseLookupCoordinatesDialog,
    handleCloseCoordinatesDialog,
    handleTopographicalPlaceInput,
    toggleShowFutureAndExpired,
    menuItems,
    topographicalPlacesDataSource,
  } = useSearchBox({
    chosenResult,
    dataSource,
    stopTypeFilter,
    topoiChips,
    topographicalPlaces,
    showFutureAndExpired,
    searchText,
    formatMessage,
  });

  const activeFilterCount =
    stopTypeFilter.length + topoiChips.length + (showFutureAndExpired ? 1 : 0);

  const handleToggleSearch = () => {
    if (isTablet) {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setShowFavorites(false);
    handleToggleFilter(false);
    // Clear search input
    handleSearchUpdate(null, "", "clear");
    // Also clear any active search result
    dispatch({
      type: "SET_ACTIVE_MARKER",
      payload: null,
    });
  };

  const handleToggleFilters = () => {
    // If filters are currently closed, we want to open them
    if (!showMoreFilterOptions) {
      // Close favorites first, then open filters
      flushSync(() => {
        setShowFavorites(false);
      });
      handleToggleFilter(true);
    } else {
      // Close filters
      handleToggleFilter(false);
    }
  };

  const handleToggleFavorites = () => {
    // If favorites are currently closed, we want to open them
    if (!showFavorites) {
      // Close filters first, then open favorites
      flushSync(() => {
        handleToggleFilter(false);
      });
      setShowFavorites(true);
    } else {
      // Close favorites
      setShowFavorites(false);
    }
  };

  const handleCloseResultDetails = () => {
    dispatch({
      type: "SET_ACTIVE_MARKER",
      payload: null,
    });

    if (isTablet) {
      setIsSearchExpanded(false);
    } else {
      handleToggleFilter(false);
      setShowFavorites(false);
    }
  };

  // Unified content structure - SearchInput only for mobile
  const renderSearchContent = () => {
    return (
      <Box sx={{ p: 2 }}>
        {/* Only show SearchInput in dropdown for mobile */}
        {isTablet && (
          <SearchInput
            menuItems={menuItems}
            loading={loading}
            stopPlaceSearchValue={stopPlaceSearchValue}
            showFilters={showMoreFilterOptions}
            activeFilterCount={activeFilterCount}
            showFavorites={showFavorites}
            onSearchUpdate={handleSearchUpdate}
            onNewRequest={handleNewRequest}
            onToggleFilters={handleToggleFilters}
            onToggleFavorites={handleToggleFavorites}
          />
        )}

        {showFavorites && <FavoriteStopPlaces onClose={handleCloseSearch} />}

        {showMoreFilterOptions && (
          <FilterSection
            showMoreFilterOptions={showMoreFilterOptions}
            stopTypeFilter={stopTypeFilter}
            topographicalPlacesDataSource={topographicalPlacesDataSource}
            topographicPlaceFilterValue={topographicPlaceFilterValue}
            topoiChips={topoiChips}
            showFutureAndExpired={showFutureAndExpired}
            onToggleFilter={handleToggleFilter}
            onApplyModalityFilters={handleApplyModalityFilters}
            onTopographicalPlaceInput={handleTopographicalPlaceInput}
            onAddChip={handleAddChip}
            onDeleteChip={handleDeleteChip}
            onToggleShowFutureAndExpired={toggleShowFutureAndExpired}
          />
        )}

        {chosenResult && !showFavorites && !showMoreFilterOptions && (
          <SearchResultDetails
            result={chosenResult}
            canEdit={canEdit}
            userSuppliedCoordinates={
              missingCoordinatesMap && missingCoordinatesMap[chosenResult.id]
            }
            onEdit={handleEdit}
            onChangeCoordinates={handleOpenCoordinatesDialog}
            onClose={handleCloseResultDetails}
          />
        )}
      </Box>
    );
  };

  // Condition for when to show the search panel
  const shouldShowSearchPanel = isTablet
    ? isSearchExpanded ||
      !!chosenResult ||
      showFavorites ||
      showMoreFilterOptions
    : showMoreFilterOptions || showFavorites || !!chosenResult;

  return (
    <>
      <CoordinatesDialogs
        lookupCoordinatesOpen={lookupCoordinatesOpen}
        coordinatesDialogOpen={coordinatesDialogOpen}
        onCloseLookupCoordinates={handleCloseLookupCoordinatesDialog}
        onSubmitLookupCoordinates={handleLookupCoordinates}
        onCloseCoordinates={handleCloseCoordinatesDialog}
        onSubmitCoordinates={handleSubmitCoordinates}
      />

      {/* Desktop: Always show search input in header */}
      {!isTablet && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 480,
            mx: 2,
          }}
        >
          {shouldShowSearchPanel ? (
            <ClickAwayListener onClickAway={handleCloseSearch}>
              <Box>
                <SearchInput
                  menuItems={menuItems}
                  loading={loading}
                  stopPlaceSearchValue={stopPlaceSearchValue}
                  showFilters={showMoreFilterOptions}
                  activeFilterCount={activeFilterCount}
                  showFavorites={showFavorites}
                  onSearchUpdate={handleSearchUpdate}
                  onNewRequest={handleNewRequest}
                  onToggleFilters={handleToggleFilters}
                  onToggleFavorites={handleToggleFavorites}
                />

                {/* Desktop dropdown - positioned relative to search input container */}
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex:
                      showFavorites || showMoreFilterOptions
                        ? theme.zIndex.modal + 5
                        : theme.zIndex.modal + 2,
                    mt: 1,
                    maxHeight: "70vh",
                    overflow: "auto",
                  }}
                >
                  {renderSearchContent()}
                </Paper>
              </Box>
            </ClickAwayListener>
          ) : (
            <SearchInput
              menuItems={menuItems}
              loading={loading}
              stopPlaceSearchValue={stopPlaceSearchValue}
              showFilters={showMoreFilterOptions}
              activeFilterCount={activeFilterCount}
              showFavorites={showFavorites}
              onSearchUpdate={handleSearchUpdate}
              onNewRequest={handleNewRequest}
              onToggleFilters={handleToggleFilters}
              onToggleFavorites={handleToggleFavorites}
            />
          )}
        </Box>
      )}

      {/* Mobile: Show search icon */}
      {isTablet && (
        <IconButton
          color="inherit"
          onClick={handleToggleSearch}
          sx={{
            color:
              activeFilterCount > 0 ? theme.palette.primary.light : "inherit",
          }}
          aria-label={formatMessage({ id: "open_search" })}
        >
          <SearchIcon />
        </IconButton>
      )}

      {/* Mobile search panel */}
      {isTablet && shouldShowSearchPanel && (
        <ClickAwayListener onClickAway={handleCloseSearch}>
          <Paper
            elevation={8}
            sx={{
              position: "fixed",
              top: 64,
              left: 8,
              right: 8,
              zIndex:
                showFavorites || showMoreFilterOptions
                  ? theme.zIndex.modal + 5
                  : theme.zIndex.modal + 2,
              maxHeight: "calc(100vh - 80px)",
              overflow: "auto",
            }}
          >
            {renderSearchContent()}
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};
