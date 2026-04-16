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
import { useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../../../actions/";
import {
  findEntitiesWithFilters,
  getGroupOfStopPlacesById,
  getStopPlaceById,
} from "../../../../../actions/TiamatActions";
import formatHelpers from "../../../../../modelUtils/mapToClient";
import Routes from "../../../../../routes/";
import { MenuItem } from "../../types";

/**
 * Hook for managing search and selection handlers
 * Handles search updates, debouncing, and result selection
 */
export const useSearchHandlers = (
  stopTypeFilter: string[],
  topoiChips: any[],
  showFutureAndExpired: boolean,
  setLoading: (loading: boolean) => void,
  setLoadingSelection: (loading: boolean) => void,
  setLoadingStopPlaceName: (name: string) => void,
  setStopPlaceSearchValue: (value: string) => void,
  setPendingNavigationId: (id: string | null) => void,
) => {
  const dispatch = useDispatch() as any;

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
    [dispatch, setLoading],
  );

  // Search update handler
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
      setStopPlaceSearchValue,
    ],
  );

  // Handle selection of search result
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

        const element = result.element;
        const stopPlaceId = element.id;
        const entityType = element.entityType;

        // Force a synchronous render so the dialog is visible before the async fetch starts.
        // React 18 batching can otherwise collapse loading=true/false into a single frame.
        flushSync(() => {
          setLoadingSelection(true);
          setLoadingStopPlaceName(element.name || "");
        });

        // Determine the route for navigation
        const route =
          entityType === "GROUP_OF_STOP_PLACE"
            ? Routes.GROUP_OF_STOP_PLACE
            : Routes.STOP_PLACE;

        if (stopPlaceId && entityType === "GROUP_OF_STOP_PLACE") {
          // Fetch group of stop places data
          dispatch(getGroupOfStopPlacesById(stopPlaceId))
            .then(() => {
              // Navigate to edit page after fetching group data
              dispatch(UserActions.navigateTo(`/${route}/`, stopPlaceId));
            })
            .finally(() => {
              setLoadingSelection(false);
              setLoadingStopPlaceName("");
            });
        } else if (stopPlaceId) {
          // Loading is cleared by the useSearchBox effect when state.stopPlace.current.id
          // changes to stopPlaceId — i.e., when the full stop data has landed in Redux.
          // This keeps the dialog visible until both the panel and map have updated.
          dispatch(getStopPlaceById(stopPlaceId))
            .then(({ data }: any) => {
              if (data.stopPlace && data.stopPlace.length) {
                const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
                  data.stopPlace,
                );
                if (stopPlaces.length) {
                  dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
                }
              }
              dispatch(UserActions.navigateTo(`/${route}/`, stopPlaceId));
              setPendingNavigationId(stopPlaceId);
            })
            .catch(() => {
              setLoadingSelection(false);
              setLoadingStopPlaceName("");
              setPendingNavigationId(null);
            });
        } else {
          dispatch(StopPlaceActions.setMarkerOnMap(element));
          // Navigate to edit page after setting marker
          dispatch(UserActions.navigateTo(`/${route}/`, stopPlaceId));
          setLoadingSelection(false);
          setLoadingStopPlaceName("");
        }
        setStopPlaceSearchValue("");
        dispatch(UserActions.setSearchText(""));
        dispatch(UserActions.clearSearchResults());
      }
    },
    [
      dispatch,
      setLoadingSelection,
      setLoadingStopPlaceName,
      setStopPlaceSearchValue,
      setPendingNavigationId,
    ],
  );

  return {
    debouncedSearch,
    handleSearchUpdate,
    handleNewRequest,
  };
};
