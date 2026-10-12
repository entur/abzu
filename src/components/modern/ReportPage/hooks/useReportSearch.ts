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
import { replace } from "redux-first-history";
import {
  findStopForReport,
  getParkingForMultipleStopPlaces,
} from "../../../../actions/TiamatActions.modern";
import AppRoutes from "../../../../routes";
import { useAppDispatch } from "../../../../store/hooks";
import { FilterState } from "../types";
import { hasReportCriteria } from "../utils/reportCriteria";
import { toReportQueryString } from "../utils/reportQueryString";

export interface UseReportSearchResult {
  isLoading: boolean;
  activePageIndex: number;
  /** Searches, or first asks when nothing narrows the search (F-65). */
  handleSearch: () => void;
  handleSelectPage: (pageIndex: number) => void;
  isConfirmingFullSearch: boolean;
  confirmFullSearch: () => void;
  cancelFullSearch: () => void;
}

export const useReportSearch = (
  filters: FilterState,
): UseReportSearchResult => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isConfirmingFullSearch, setIsConfirmingFullSearch] = useState(false);

  const runSearch = useCallback(() => {
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
        // Through the router (not raw pushState), so the Reports tab can
        // bring the user back to this search (F-65).
        dispatch(
          replace(
            `${import.meta.env.BASE_URL}${AppRoutes.REPORTS}${toReportQueryString(
              { ...queryVariables, showFutureAndExpired },
            )}`,
          ),
        );
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

  const handleSearch = useCallback(() => {
    if (hasReportCriteria(filters)) {
      runSearch();
      return;
    }
    setIsConfirmingFullSearch(true);
  }, [filters, runSearch]);

  const confirmFullSearch = useCallback(() => {
    setIsConfirmingFullSearch(false);
    runSearch();
  }, [runSearch]);

  const handleSelectPage = useCallback((pageIndex: number) => {
    setActivePageIndex(pageIndex);
  }, []);

  return {
    isLoading,
    activePageIndex,
    handleSearch,
    handleSelectPage,
    isConfirmingFullSearch,
    confirmFullSearch,
    cancelFullSearch: () => setIsConfirmingFullSearch(false),
  };
};
