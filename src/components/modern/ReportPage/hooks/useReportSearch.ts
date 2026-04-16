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

import { useCallback, useState } from "react";
import {
  findStopForReport,
  getParkingForMultipleStopPlaces,
} from "../../../../actions/TiamatActions";
import { useAppDispatch } from "../../../../store/hooks";
import { buildReportSearchQuery } from "../../../../utils/URLhelpers";
import { FilterState } from "../types";

export interface UseReportSearchResult {
  isLoading: boolean;
  activePageIndex: number;
  handleSearch: () => void;
  handleSelectPage: (pageIndex: number) => void;
}

export const useReportSearch = (
  filters: FilterState,
): UseReportSearchResult => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleSearch = useCallback(() => {
    const {
      searchQuery,
      topoiChips,
      stopTypeFilter,
      withoutLocationOnly,
      withDuplicateImportedIds,
      withNearbySimilarDuplicates,
      hasParking,
      withTags,
      showFutureAndExpired,
      tags,
    } = filters;

    setIsLoading(true);

    const queryVariables = {
      query: searchQuery,
      withoutLocationOnly,
      withDuplicateImportedIds,
      pointInTime:
        withDuplicateImportedIds ||
        withNearbySimilarDuplicates ||
        !showFutureAndExpired
          ? new Date().toISOString()
          : null,
      stopPlaceType: stopTypeFilter,
      withNearbySimilarDuplicates,
      hasParking,
      withTags,
      tags,
      versionValidity: showFutureAndExpired ? "MAX_VERSION" : null,
      municipalityReference: topoiChips
        .filter((t) => t.type === "municipality")
        .map((t) => t.id),
      countyReference: topoiChips
        .filter((t) => t.type === "county")
        .map((t) => t.id),
      countryReference: topoiChips
        .filter((t) => t.type === "country")
        .map((t) => t.id),
    };

    dispatch(findStopForReport(queryVariables))
      .then((response: any) => {
        const stopPlaces = response.data.stopPlace;
        const stopPlaceIds: string[] = [];
        for (let i = 0; i < stopPlaces.length; i++) {
          if (stopPlaces[i].__typename === "ParentStopPlace") {
            const childStops = stopPlaces[i].children;
            for (let j = 0; j < childStops.length; j++) {
              stopPlaceIds.push(childStops[j].id);
            }
          } else {
            stopPlaceIds.push(stopPlaces[i].id);
          }
        }
        buildReportSearchQuery({ ...queryVariables, showFutureAndExpired });
        if (stopPlaceIds.length > 0) {
          dispatch(getParkingForMultipleStopPlaces(stopPlaceIds)).then(() => {
            setIsLoading(false);
            setActivePageIndex(0);
          });
        } else {
          setIsLoading(false);
          setActivePageIndex(0);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [filters, dispatch]);

  const handleSelectPage = useCallback((pageIndex: number) => {
    setActivePageIndex(pageIndex);
  }, []);

  return { isLoading, activePageIndex, handleSearch, handleSelectPage };
};
