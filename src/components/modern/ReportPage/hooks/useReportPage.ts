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
import { useAppSelector } from "../../../../store/hooks";
import { FilterState } from "../types";
import { useReportColumns } from "./useReportColumns";
import { useReportExport } from "./useReportExport";
import { useReportFilters } from "./useReportFilters";
import { useReportSearch } from "./useReportSearch";
import { useReportTags } from "./useReportTags";
import { useTopographicPlaceSearch } from "./useTopographicPlaceSearch";

export const useReportPage = (initialState: Partial<FilterState>) => {
  const {
    filters,
    handleFilterChange,
    handleTagCheck,
    handleAddTopographicChip,
    handleDeleteTopographicChip,
    setTopoiChips,
  } = useReportFilters(initialState);

  const { isLoading, activePageIndex, handleSearch, handleSelectPage } =
    useReportSearch(filters);

  const {
    stopColumnOptions,
    quayColumnOptions,
    handleColumnStopPlaceToggle,
    handleColumnQuaysToggle,
    handleCheckAllStopColumns,
    handleCheckAllQuayColumns,
  } = useReportColumns();

  const { availableTags, loadAvailableTags } = useReportTags();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);

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

  const { handleExportStopPlacesCSV, handleExportQuaysCSV } = useReportExport(
    results,
    stopColumnOptions,
    quayColumnOptions,
  );

  const {
    topographicalPlacesDataSource,
    handleTopographicalPlaceSearch,
    loadTopographicPlaces,
  } = useTopographicPlaceSearch(
    filters.topoiChips,
    setTopoiChips,
    handleFilterChange,
  );

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

  const handleToggleFilterPanel = useCallback(() => {
    setFilterPanelOpen((prev) => !prev);
  }, []);

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
