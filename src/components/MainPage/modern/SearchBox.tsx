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

import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  Collapse,
  Fab,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import {
  ActionButtons,
  CoordinatesDialogs,
  FavoriteSection,
  FilterSection,
  SearchInput,
  SearchResultDetails,
} from "./components";
import { useSearchBox } from "./hooks/useSearchBox";
import "./SearchBox.css";
import { RootState, SearchBoxProps } from "./types";

export const SearchBox: React.FC<SearchBoxProps> = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Local state for mobile collapse/expand
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  // Handle responsive behavior
  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  // Toggle handlers
  const handleToggleSearchBox = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  const {
    // State selectors
    chosenResult,
    isCreatingNewStop,
    favorited,
    missingCoordinatesMap,
    stopTypeFilter,
    topoiChips,
    topographicalPlaces,
    canEdit,
    lookupCoordinatesOpen,
    newStopIsMultiModal,
    dataSource,
    showFutureAndExpired,
    isGuest,
    searchText,
  } = useSelector((state: RootState) => ({
    chosenResult: state.stopPlace.activeSearchResult,
    dataSource: state.stopPlace.searchResults || [],
    isCreatingNewStop: state.user.isCreatingNewStop,
    stopTypeFilter: state.user.searchFilters.stopType,
    topoiChips: state.user.searchFilters.topoiChips,
    favorited: state.user.favorited, // This will need to be computed
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
    // Local state
    showMoreFilterOptions,
    loading,
    stopPlaceSearchValue,
    topographicPlaceFilterValue,
    coordinatesDialogOpen,
    createNewStopOpen,
    anchorEl,

    // Handlers
    handleSearchUpdate,
    handleNewRequest,
    handleApplyModalityFilters,
    handleToggleFilter: handleToggleFilterSection,
    handleAddChip,
    handleDeleteChip,
    handleSaveAsFavorite,
    handleRetrieveFilter,
    handleEdit,
    handleNewStop,
    handleLookupCoordinates,
    handleSubmitCoordinates,
    handleOpenCoordinatesDialog,
    handleOpenLookupCoordinatesDialog,
    handleCloseLookupCoordinatesDialog,
    handleCloseCoordinatesDialog,
    handleTopographicalPlaceInput,
    toggleShowFutureAndExpired,

    // Computed values
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

  // Calculate active filter count (after variables are declared)
  const activeFilterCount =
    stopTypeFilter.length + topoiChips.length + (showFutureAndExpired ? 1 : 0);

  // Wrapper for filter toggle without parameters
  const handleToggleFilters = () => {
    handleToggleFilterSection(!showMoreFilterOptions);
  };

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

      {/* Floating Search Button for Mobile (when collapsed) */}
      {isMobile && !isExpanded && (
        <Fab
          color="primary"
          size="medium"
          onClick={handleToggleSearchBox}
          className="search-fab"
          sx={{
            position: "absolute",
            top: 80,
            left: 16,
            zIndex: 1000,
            boxShadow: theme.shadows[6],
          }}
          aria-label={formatMessage({ id: "open_search" })}
        >
          <SearchIcon />
        </Fab>
      )}

      {/* Collapsible Search Box */}
      <Collapse in={isExpanded} timeout={300}>
        <Paper
          elevation={3}
          className={`search-box-wrapper ${isMobile ? "mobile" : "desktop"}`}
          sx={{
            position: "absolute",
            top: { xs: 70, sm: 70 },
            left: { xs: 8, sm: 8 },
            right: { xs: 8, sm: "auto" },
            width: { xs: "auto", sm: 480 },
            maxWidth: { xs: "calc(100vw - 16px)", sm: 480 },
            zIndex: 999,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <div className="search-box-content">
            {/* Mobile Close Button */}
            {isMobile && (
              <div className="search-box-header">
                <IconButton
                  onClick={handleToggleSearchBox}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1,
                  }}
                  aria-label={formatMessage({ id: "close_search" })}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            )}

            <FavoriteSection
              favorited={favorited}
              stopTypeFilter={stopTypeFilter}
              onRetrieveFilter={handleRetrieveFilter}
              onSaveAsFavorite={handleSaveAsFavorite}
            />

            <Collapse in={showMoreFilterOptions} timeout={300}>
              <FilterSection
                showMoreFilterOptions={showMoreFilterOptions}
                stopTypeFilter={stopTypeFilter}
                topographicalPlacesDataSource={topographicalPlacesDataSource}
                topographicPlaceFilterValue={topographicPlaceFilterValue}
                topoiChips={topoiChips}
                showFutureAndExpired={showFutureAndExpired}
                onToggleFilter={handleToggleFilterSection}
                onApplyModalityFilters={handleApplyModalityFilters}
                onTopographicalPlaceInput={handleTopographicalPlaceInput}
                onAddChip={handleAddChip}
                onDeleteChip={handleDeleteChip}
                onToggleShowFutureAndExpired={toggleShowFutureAndExpired}
              />
            </Collapse>

            <SearchInput
              menuItems={menuItems}
              loading={loading}
              stopPlaceSearchValue={stopPlaceSearchValue}
              showFilters={showMoreFilterOptions}
              activeFilterCount={activeFilterCount}
              onSearchUpdate={handleSearchUpdate}
              onNewRequest={handleNewRequest}
              onToggleFilters={handleToggleFilters}
            />

            {chosenResult && (
              <SearchResultDetails
                result={chosenResult}
                canEdit={canEdit}
                userSuppliedCoordinates={
                  missingCoordinatesMap &&
                  missingCoordinatesMap[chosenResult.id]
                }
                onEdit={handleEdit}
                onChangeCoordinates={handleOpenCoordinatesDialog}
              />
            )}

            {!isGuest && (
              <ActionButtons
                isCreatingNewStop={isCreatingNewStop}
                newStopIsMultiModal={newStopIsMultiModal}
                createNewStopOpen={createNewStopOpen}
                anchorEl={anchorEl}
                onOpenLookupCoordinates={handleOpenLookupCoordinatesDialog}
                onNewStop={handleNewStop}
              />
            )}
          </div>
        </Paper>
      </Collapse>
    </>
  );
};
