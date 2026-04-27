/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useCallback } from "react";
import {
  getTopographicPlaces,
  topographicalPlaceSearch,
} from "../../../../actions/TiamatActions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { FilterState, TopographicChip } from "../types";

const VALID_TOPO_TYPES = ["county", "municipality", "country"];

export interface UseTopographicPlaceSearchResult {
  topographicalPlacesDataSource: TopographicChip[];
  handleTopographicalPlaceSearch: (
    _event: unknown,
    searchText: string,
    reason?: string,
  ) => void;
  loadTopographicPlaces: (topographicalPlaceIds: string[]) => void;
}

export const useTopographicPlaceSearch = (
  topoiChips: TopographicChip[],
  setTopoiChips: (chips: TopographicChip[]) => void,
  handleFilterChange: (key: keyof FilterState, value: unknown) => void,
): UseTopographicPlaceSearchResult => {
  const dispatch = useAppDispatch();

  const topographicalPlaces = useAppSelector(
    (state: any) => state.report.topographicalPlaces || [],
  );

  const getTopographicalNames = useCallback((place: any): string => {
    let name = place.name.value;
    if (
      place.topographicPlaceType === "municipality" &&
      place.parentTopographicPlace
    ) {
      name += `, ${place.parentTopographicPlace.name.value}`;
    }
    return name;
  }, []);

  const createTopographicChip = useCallback(
    (place: any): TopographicChip => {
      const name = getTopographicalNames(place);
      return {
        id: place.id,
        text: name,
        type: place.topographicPlaceType,
      };
    },
    [getTopographicalNames],
  );

  const handleTopographicalPlaceSearch = useCallback(
    (_event: unknown, searchText: string, reason?: string) => {
      if (reason === "clear") {
        handleFilterChange("topographicPlaceFilterValue", "");
        return;
      }
      dispatch(topographicalPlaceSearch(searchText));
    },
    [dispatch, handleFilterChange],
  );

  const loadTopographicPlaces = useCallback(
    (topographicalPlaceIds: string[]) => {
      if (!topographicalPlaceIds.length) return;
      dispatch(getTopographicPlaces(topographicalPlaceIds)).then(
        (response: any) => {
          if (response.data && Object.keys(response.data).length) {
            const chips: TopographicChip[] = [];
            Object.keys(response.data).forEach((result) => {
              const place =
                response.data[result] && response.data[result].length
                  ? response.data[result][0]
                  : null;
              if (place) {
                chips.push(createTopographicChip(place));
              }
            });
            setTopoiChips(chips);
          }
        },
      );
    },
    [dispatch, createTopographicChip, setTopoiChips],
  );

  const topographicalPlacesDataSource = topographicalPlaces
    .filter((place: any) =>
      VALID_TOPO_TYPES.includes(place.topographicPlaceType),
    )
    .filter(
      (place: any) =>
        topoiChips.map((chip) => chip.id).indexOf(place.id) === -1,
    )
    .map((place: any) => createTopographicChip(place));

  return {
    topographicalPlacesDataSource,
    handleTopographicalPlaceSearch,
    loadTopographicPlaces,
  };
};
