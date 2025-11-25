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
import { useCallback, useMemo } from "react";
import { extractCoordinates } from "../../../../../utils/";
import { createSearchMenuItem } from "../../components";
import {
  MenuItem,
  TopographicalDataSource,
  TopographicalPlace,
} from "../../types";

/**
 * Hook for computing menu items and topographical data sources
 * Handles search results formatting and topographical place display
 */
export const useSearchMenuItems = (
  dataSource: any[] | undefined,
  searchText: string,
  formatMessage: (descriptor: { id: string }) => string,
  stopTypeFilter: string[],
  topoiChips: any[],
  topographicalPlaces: TopographicalPlace[],
  removeFiltersAndSearch: () => void,
) => {
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

  // Menu items for search results
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

  // Topographical places data source
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
    menuItems,
    topographicalPlacesDataSource,
  };
};
