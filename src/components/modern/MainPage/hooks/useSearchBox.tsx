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

import { MenuItem as MenuItemComponent } from "@mui/material";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../../actions/";
import {
  findEntitiesWithFilters,
  findTopographicalPlace,
  getStopPlaceById,
} from "../../../../actions/TiamatActions";
import { Entities } from "../../../../models/Entities";
import formatHelpers from "../../../../modelUtils/mapToClient";
import Routes from "../../../../routes/";
import { extractCoordinates } from "../../../../utils/";
import { createSearchMenuItem } from "../components";
import {
  FavoriteFilter,
  MenuItem,
  TopographicalDataSource,
  TopographicalPlace,
  UseSearchBoxProps,
  UseSearchBoxReturn,
} from "../types";

export const useSearchBox = ({
  chosenResult,
  dataSource,
  stopTypeFilter,
  topoiChips,
  topographicalPlaces,
  showFutureAndExpired,
  searchText,
  formatMessage,
}: UseSearchBoxProps): UseSearchBoxReturn => {
  const dispatch = useDispatch() as any; // Type as any to handle thunks

  // Local state
  const [showMoreFilterOptions, setShowMoreFilterOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stopPlaceSearchValue, setStopPlaceSearchValue] = useState("");
  const [topographicPlaceFilterValue, setTopographicPlaceFilterValue] =
    useState("");
  const [coordinatesDialogOpen, setCoordinatesDialogOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(
        (
          searchText: string,
          stopPlaceTypes: string[],
          chips: any[],
          showFutureAndExpired: boolean,
        ) => {
          setLoading(true);
          dispatch(
            findEntitiesWithFilters(
              searchText,
              stopPlaceTypes,
              chips,
              showFutureAndExpired,
            ),
          ).then(() => {
            setLoading(false);
          });
        },
        500,
      ),
    [dispatch],
  );

  // Search handlers
  const handleSearchUpdate = useCallback(
    (event: any, searchText: string, reason?: string) => {
      // Prevents ghost clicks
      if (event && event.source === "click") {
        return;
      }

      if (reason && reason === "clear") {
        setStopPlaceSearchValue("");
        dispatch(UserActions.clearSearchResults());
        dispatch(UserActions.setSearchText(""));
        return;
      }

      // Always update the local input state
      setStopPlaceSearchValue(searchText || "");

      if (!searchText || !searchText.length) {
        dispatch(UserActions.clearSearchResults());
        dispatch(UserActions.setSearchText(""));
      } else if (searchText.indexOf("(") > -1 && searchText.indexOf(")") > -1) {
        // Skip search for formatted results
      } else {
        dispatch(UserActions.setSearchText(searchText));
        debouncedSearch(
          searchText,
          stopTypeFilter,
          topoiChips,
          showFutureAndExpired,
        );
      }
    },
    [
      dispatch,
      debouncedSearch,
      stopTypeFilter,
      topoiChips,
      showFutureAndExpired,
    ],
  );

  const handleNewRequest = useCallback(
    (_event: any, result: MenuItem) => {
      if (
        result &&
        typeof result.element !== "undefined" &&
        result.element !== null
      ) {
        // Check if this is a coordinate result
        if (
          result.id === "coordinates" &&
          (result.element as any).coordinates
        ) {
          const coords = (result.element as any).coordinates;
          // Center map on coordinates without creating a marker (zoom 14 = neighborhood view)
          dispatch(UserActions.setCenterAndZoom(coords, 14));
          setStopPlaceSearchValue("");
          dispatch(UserActions.setSearchText(""));
          dispatch(UserActions.clearSearchResults());
          return;
        }

        const stopPlaceId = result.element.id;
        if (
          stopPlaceId &&
          result.element.entityType !== "GROUP_OF_STOP_PLACE"
        ) {
          dispatch(getStopPlaceById(stopPlaceId)).then(({ data }: any) => {
            if (data.stopPlace && data.stopPlace.length) {
              const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
                data.stopPlace,
              );
              if (stopPlaces.length) {
                dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
              }
            }
          });
        } else {
          dispatch(StopPlaceActions.setMarkerOnMap(result.element));
        }
        setStopPlaceSearchValue("");
        dispatch(UserActions.setSearchText(""));
        dispatch(UserActions.clearSearchResults());
      }
    },
    [dispatch],
  );

  // Filter handlers
  const handleApplyModalityFilters = useCallback(
    (filters: string[]) => {
      if (searchText) {
        handleSearchUpdate(null, searchText);
      }
      dispatch(UserActions.applyStopTypeSearchFilter(filters));
    },
    [dispatch, handleSearchUpdate, searchText],
  );

  const handleToggleFilter = useCallback((value: boolean) => {
    setShowMoreFilterOptions(value);
  }, []);

  const toggleShowFutureAndExpired = useCallback(
    (value: boolean) => {
      if (searchText) {
        debouncedSearch(searchText, stopTypeFilter, topoiChips, value);
      }
      dispatch(UserActions.toggleShowFutureAndExpired(value));
    },
    [dispatch, debouncedSearch, searchText, stopTypeFilter, topoiChips],
  );

  // Topographical place handlers
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
    [dispatch],
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

  // Action handlers
  const handleEdit = useCallback(
    (id: string, entityType: keyof typeof Entities) => {
      // Clear search input
      setStopPlaceSearchValue("");
      dispatch(UserActions.setSearchText(""));
      dispatch(UserActions.clearSearchResults());

      const route =
        entityType === Entities.STOP_PLACE
          ? Routes.STOP_PLACE
          : Routes.GROUP_OF_STOP_PLACE;
      dispatch(UserActions.navigateTo(`/${route}/`, id));
    },
    [dispatch],
  );

  const handleSaveAsFavorite = useCallback(() => {
    dispatch(UserActions.openFavoriteNameDialog());
  }, [dispatch]);

  const handleRetrieveFilter = useCallback(
    (filter: FavoriteFilter) => {
      dispatch(UserActions.loadFavoriteSearch(filter));
      handleSearchUpdate(null, filter.searchText);
    },
    [dispatch, handleSearchUpdate],
  );

  const removeFiltersAndSearch = useCallback(() => {
    dispatch(UserActions.removeAllFilters());
    handleSearchUpdate(null, searchText);
  }, [dispatch, handleSearchUpdate, searchText]);

  // Coordinates handlers
  const handleOpenCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(true);
  }, []);

  const handleCloseLookupCoordinatesDialog = useCallback(() => {
    dispatch(UserActions.closeLookupCoordinatesDialog());
  }, [dispatch]);

  const handleCloseCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(false);
  }, []);

  const handleLookupCoordinates = useCallback(
    (position: [number, number]) => {
      dispatch(UserActions.lookupCoordinates(position, false));
      handleCloseLookupCoordinatesDialog();
    },
    [dispatch, handleCloseLookupCoordinatesDialog],
  );

  const handleSubmitCoordinates = useCallback(
    (position: [number, number]) => {
      dispatch(StopPlaceActions.changeMapCenter(position, 11));
      if (chosenResult) {
        dispatch(UserActions.setMissingCoordinates(position, chosenResult.id));
      }
      setCoordinatesDialogOpen(false);
    },
    [dispatch, chosenResult],
  );

  // Helper function for topographical names
  const getTopographicalNames = useCallback(
    (topographicalPlace: TopographicalPlace): string => {
      let name = topographicalPlace.name.value;
      if (
        topographicalPlace.topographicPlaceType === "municipality" &&
        topographicalPlace.parentTopographicPlace
      ) {
        name += `, ${topographicalPlace.parentTopographicPlace.name.value}`;
      }
      return name;
    },
    [],
  );

  // Computed values
  const menuItems = useMemo((): MenuItem[] => {
    let items: MenuItem[] = [];

    // Check if searchText contains valid coordinates
    const coordinates = searchText ? extractCoordinates(searchText) : null;

    if (coordinates) {
      // If valid coordinates detected, show "Go to coordinates" option
      items = [
        {
          element: { coordinates } as any,
          text: `Go to ${coordinates[0]}, ${coordinates[1]}`,
          id: "coordinates",
          menuDiv: (
            <MenuItemComponent className="search-menu-item">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    marginLeft: 10,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 360,
                  }}
                >
                  <div style={{ fontSize: "0.9em", fontWeight: 500 }}>
                    {formatMessage({ id: "go_to_coordinates" })}
                  </div>
                  <div style={{ fontSize: "0.7em", color: "grey" }}>
                    {coordinates[0]}, {coordinates[1]}
                  </div>
                </div>
              </div>
            </MenuItemComponent>
          ),
        },
      ];
    } else if (dataSource && dataSource.length) {
      const searchItems = dataSource.map((element) =>
        createSearchMenuItem(element, formatMessage),
      );
      items = searchItems.filter(Boolean) as MenuItem[];
    } else if (searchText) {
      items = [
        {
          element: null,
          text: searchText,
          id: null,
          menuDiv: (
            <MenuItemComponent
              disabled={true}
              className="search-menu-item no-results"
            >
              {formatMessage({ id: "no_results_found" })}
            </MenuItemComponent>
          ),
        },
      ];
    }

    // Add filter notification if filters are applied (but not for coordinates)
    if ((stopTypeFilter.length || topoiChips.length) && !coordinates) {
      const filterNotification: MenuItem = {
        element: null,
        text: searchText,
        id: "filter-notification",
        menuDiv: (
          <MenuItemComponent
            onClick={removeFiltersAndSearch}
            className="search-menu-item filter-notification"
          >
            <div className="filter-notification-content">
              <div className="filter-notification-title">
                {formatMessage({ id: "filters_are_applied" })}
              </div>
              <div className="filter-notification-action">
                {formatMessage({ id: "remove" })}
              </div>
            </div>
          </MenuItemComponent>
        ),
      };

      if (items.length > 6) {
        items[6] = filterNotification;
      } else {
        items.push(filterNotification);
      }
    }

    return items;
  }, [
    dataSource,
    searchText,
    formatMessage,
    stopTypeFilter,
    topoiChips,
    removeFiltersAndSearch,
  ]);

  const topographicalPlacesDataSource =
    useMemo((): TopographicalDataSource[] => {
      return topographicalPlaces
        .filter(
          (place) =>
            place.topographicPlaceType === "county" ||
            place.topographicPlaceType === "municipality" ||
            place.topographicPlaceType === "country",
        )
        .filter(
          (place) =>
            topoiChips.map((chip) => chip.value).indexOf(place.id) === -1,
        )
        .map((place) => {
          const name = getTopographicalNames(place);
          return {
            text: name,
            id: place.id,
            value: (
              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "grey",
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  >
                    {formatMessage({ id: place.topographicPlaceType })}
                  </div>
                </div>
              </div>
            ),
            type: place.topographicPlaceType,
          };
        });
    }, [topographicalPlaces, topoiChips, getTopographicalNames, formatMessage]);

  return {
    // Local state
    showMoreFilterOptions,
    loading,
    stopPlaceSearchValue,
    topographicPlaceFilterValue,
    coordinatesDialogOpen,

    // Handlers
    handleSearchUpdate,
    handleNewRequest,
    handleApplyModalityFilters,
    handleToggleFilter,
    handleAddChip,
    handleDeleteChip,
    handleSaveAsFavorite,
    handleRetrieveFilter,
    handleEdit,
    handleLookupCoordinates,
    handleSubmitCoordinates,
    handleOpenCoordinatesDialog,
    handleCloseLookupCoordinatesDialog,
    handleCloseCoordinatesDialog,
    handleTopographicalPlaceInput,
    removeFiltersAndSearch,
    toggleShowFutureAndExpired,

    // Computed values
    menuItems,
    topographicalPlacesDataSource,
  };
};
