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

import moment from "moment";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import {
  findStopForReport,
  getParkingForMultipleStopPlaces,
  getTagsByName,
  getTopographicPlaces,
  topographicalPlaceSearch,
} from "../../../../actions/TiamatActions";
import {
  columnOptionsQuays as defaultQuayColumns,
  columnOptionsStopPlace as defaultStopColumns,
} from "../../../../config/columnOptions";
import {
  ColumnTransformersQuays,
  ColumnTransformersStopPlace,
} from "../../../../models/columnTransformers";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { jsonArrayToCSV } from "../../../../utils/CSVHelper";
import { buildReportSearchQuery } from "../../../../utils/URLhelpers";
import { ColumnOption, FilterState, TopographicChip } from "../types";

const defaultFilters: FilterState = {
  searchQuery: "",
  stopTypeFilter: [],
  topoiChips: [],
  topographicPlaceFilterValue: "",
  withoutLocationOnly: false,
  withDuplicateImportedIds: false,
  withNearbySimilarDuplicates: false,
  hasParking: false,
  showFutureAndExpired: false,
  withTags: false,
  tags: [],
};

const downloadCSV = (
  items: unknown[],
  columns: ColumnOption[],
  filename: string,
  transformer: Record<string, (item: unknown, ...args: unknown[]) => unknown>,
) => {
  const csv = jsonArrayToCSV(items, columns, ";", transformer);
  const BOM = "\uFEFF";
  const content = BOM + csv;
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const dateNow = moment(new Date()).format("DD-MM-YYYY");
  const fullFilename = `${filename}-${dateNow}.csv`;
  const url = URL.createObjectURL(blob);
  element.href = url;
  element.setAttribute("target", "_blank");
  element.setAttribute("download", fullFilename);
  element.click();
};

export const useReportPage = (initialState: Partial<FilterState>) => {
  const dispatch = useAppDispatch();
  const { locale } = useIntl();

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [stopColumnOptions, setStopColumnOptions] =
    useState<ColumnOption[]>(defaultStopColumns);
  const [quayColumnOptions, setQuayColumnOptions] =
    useState<ColumnOption[]>(defaultQuayColumns);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [availableTags, setAvailableTags] = useState<
    Array<{ name: string; comment?: string }>
  >([]);

  // Redux selectors
  const results = useAppSelector((state: any) =>
    filters.hasParking
      ? (state.report.results || []).filter(
          (sp: any) => sp.parking && sp.parking.length,
        )
      : state.report.results || [],
  );
  const duplicateInfo = useAppSelector(
    (state: any) =>
      state.report.duplicateInfo || {
        stopPlacesWithConflict: [],
        quaysWithDuplicateImportedIds: {},
        fullConflictMap: {},
      },
  );
  const topographicalPlaces = useAppSelector(
    (state: any) => state.report.topographicalPlaces || [],
  );

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

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

  const handleColumnStopPlaceToggle = useCallback(
    (id: string, checked: boolean) => {
      setStopColumnOptions((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked } : opt)),
      );
    },
    [],
  );

  const handleColumnQuaysToggle = useCallback(
    (id: string, checked: boolean) => {
      setQuayColumnOptions((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked } : opt)),
      );
    },
    [],
  );

  const handleCheckAllStopColumns = useCallback(() => {
    setStopColumnOptions((prev) =>
      prev.map((opt) => ({ ...opt, checked: true })),
    );
  }, []);

  const handleCheckAllQuayColumns = useCallback(() => {
    setQuayColumnOptions((prev) =>
      prev.map((opt) => ({ ...opt, checked: true })),
    );
  }, []);

  const handleExportStopPlacesCSV = useCallback(() => {
    downloadCSV(
      results,
      stopColumnOptions,
      "results-stop-places",
      ColumnTransformersStopPlace as any,
    );
  }, [results, stopColumnOptions]);

  const handleExportQuaysCSV = useCallback(() => {
    let items: unknown[] = [];
    const finalColumns: ColumnOption[] = [
      { id: "stopPlaceId", checked: true },
      { id: "stopPlaceName", checked: true },
      ...quayColumnOptions,
    ];

    results.forEach((result: any) => {
      const quays = result.quays.map((quay: any) => ({
        ...quay,
        stopPlaceId: result.id,
        stopPlaceName: result.name,
      }));
      items = items.concat(quays);
    });

    downloadCSV(
      items,
      finalColumns,
      "results-quays",
      ColumnTransformersQuays as any,
    );
  }, [results, quayColumnOptions]);

  const handleExpandRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleTopographicalPlaceSearch = useCallback(
    (_event: unknown, searchText: string, reason?: string) => {
      if (reason === "clear") {
        setFilters((prev) => ({
          ...prev,
          topographicPlaceFilterValue: "",
        }));
        return;
      }
      dispatch(topographicalPlaceSearch(searchText));
    },
    [dispatch],
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

  const handleAddTopographicChip = useCallback(
    (_event: unknown, chip: TopographicChip | string | null) => {
      if (chip && typeof chip !== "string") {
        setFilters((prev) => {
          const addedIds = prev.topoiChips.map((tc) => tc.id);
          if (addedIds.indexOf(chip.id) === -1) {
            return {
              ...prev,
              topoiChips: [...prev.topoiChips, chip],
              topographicPlaceFilterValue: "",
            };
          }
          return prev;
        });
      }
    },
    [],
  );

  const handleDeleteTopographicChip = useCallback((chipId: string) => {
    setFilters((prev) => ({
      ...prev,
      topoiChips: prev.topoiChips.filter((tc) => tc.id !== chipId),
    }));
  }, []);

  const handleToggleFilterPanel = useCallback(() => {
    setFilterPanelOpen((prev) => !prev);
  }, []);

  const handleTagCheck = useCallback((name: string, checked: boolean) => {
    setFilters((prev) => {
      let nextTags = prev.tags.slice();
      if (checked) {
        nextTags.push(name);
      } else {
        nextTags = nextTags.filter((t) => t !== name);
      }
      return { ...prev, tags: nextTags };
    });
  }, []);

  const loadAvailableTags = useCallback(() => {
    const sortByName = (a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name, locale);
    dispatch(getTagsByName("")).then(({ data }: any) => {
      setAvailableTags(data.tags ? data.tags.slice().sort(sortByName) : []);
    });
  }, [dispatch, locale]);

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
            setFilters((prev) => ({ ...prev, topoiChips: chips }));
          }
        },
      );
    },
    [dispatch, createTopographicChip],
  );

  const topographicalPlacesDataSource = topographicalPlaces
    .filter(
      (place: any) =>
        place.topographicPlaceType === "county" ||
        place.topographicPlaceType === "municipality" ||
        place.topographicPlaceType === "country",
    )
    .filter(
      (place: any) =>
        filters.topoiChips.map((chip) => chip.id).indexOf(place.id) === -1,
    )
    .map((place: any) => createTopographicChip(place));

  return {
    filters,
    results,
    isLoading,
    activePageIndex,
    filterPanelOpen,
    stopColumnOptions,
    quayColumnOptions,
    expandedRows,
    duplicateInfo,
    availableTags,
    topographicalPlacesDataSource,
    handleFilterChange,
    handleSearch,
    handleSelectPage,
    handleColumnStopPlaceToggle,
    handleColumnQuaysToggle,
    handleCheckAllStopColumns,
    handleCheckAllQuayColumns,
    handleExportStopPlacesCSV,
    handleExportQuaysCSV,
    handleExpandRow,
    handleTopographicalPlaceSearch,
    handleAddTopographicChip,
    handleDeleteTopographicChip,
    handleToggleFilterPanel,
    handleTagCheck,
    loadAvailableTags,
    loadTopographicPlaces,
  };
};
