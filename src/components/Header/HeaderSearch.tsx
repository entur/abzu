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
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  ActionButtons,
  CoordinatesDialogs,
  FavoriteSection,
  FilterSection,
  RootState,
  SearchInput,
  SearchResultDetails,
} from "../MainPage/modern";
import { useSearchBox } from "../MainPage/modern/hooks/useSearchBox";

export const HeaderSearch: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const {
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
    createNewStopOpen,
    anchorEl,
    handleSearchUpdate,
    handleNewRequest,
    handleApplyModalityFilters,
    handleToggleFilter,
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
  };

  const handleToggleFilters = () => {
    handleToggleFilter(!showMoreFilterOptions);
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
    }
  };

  if (!isTablet) {
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

        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 480,
            mx: 2,
          }}
        >
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

          {(showMoreFilterOptions || chosenResult) && (
            <ClickAwayListener onClickAway={handleCloseSearch}>
              <Paper
                elevation={8}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: theme.zIndex.modal + 2,
                  mt: 1,
                  maxHeight: "70vh",
                  overflow: "auto",
                }}
              >
                <Box sx={{ p: 2 }}>
                  {showMoreFilterOptions && (
                    <>
                      <FavoriteSection
                        favorited={favorited}
                        stopTypeFilter={stopTypeFilter}
                        onRetrieveFilter={handleRetrieveFilter}
                        onSaveAsFavorite={handleSaveAsFavorite}
                      />

                      <FilterSection
                        showMoreFilterOptions={showMoreFilterOptions}
                        stopTypeFilter={stopTypeFilter}
                        topographicalPlacesDataSource={
                          topographicalPlacesDataSource
                        }
                        topographicPlaceFilterValue={
                          topographicPlaceFilterValue
                        }
                        topoiChips={topoiChips}
                        showFutureAndExpired={showFutureAndExpired}
                        onToggleFilter={handleToggleFilter}
                        onApplyModalityFilters={handleApplyModalityFilters}
                        onTopographicalPlaceInput={
                          handleTopographicalPlaceInput
                        }
                        onAddChip={handleAddChip}
                        onDeleteChip={handleDeleteChip}
                        onToggleShowFutureAndExpired={
                          toggleShowFutureAndExpired
                        }
                      />
                    </>
                  )}

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
                      onClose={handleCloseResultDetails}
                    />
                  )}

                  {!isGuest && (
                    <ActionButtons
                      isCreatingNewStop={isCreatingNewStop}
                      newStopIsMultiModal={newStopIsMultiModal}
                      createNewStopOpen={createNewStopOpen}
                      anchorEl={anchorEl}
                      onOpenLookupCoordinates={
                        handleOpenLookupCoordinatesDialog
                      }
                      onNewStop={handleNewStop}
                    />
                  )}
                </Box>
              </Paper>
            </ClickAwayListener>
          )}
        </Box>
      </>
    );
  }

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

      {isSearchExpanded && (
        <ClickAwayListener onClickAway={handleCloseSearch}>
          <Paper
            elevation={8}
            sx={{
              position: "fixed",
              top: 64, // Below app bar
              left: 8,
              right: 8,
              zIndex: theme.zIndex.modal + 2,
              maxHeight: "calc(100vh - 80px)",
              overflow: "auto",
            }}
          >
            <Box sx={{ p: 2 }}>
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

              <FavoriteSection
                favorited={favorited}
                stopTypeFilter={stopTypeFilter}
                onRetrieveFilter={handleRetrieveFilter}
                onSaveAsFavorite={handleSaveAsFavorite}
              />

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
                  onClose={handleCloseResultDetails}
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
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};
