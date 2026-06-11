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

import { Box } from "@mui/material";
import { useEffect } from "react";
import { useHeaderSlot } from "../../../components/modern/Header/HeaderSlotContext";
import { useResponsive } from "../../../theme/hooks";
import {
  FilterPanel,
  ReportActionBar,
  ReportFooter,
  ReportResultsTable,
  ReportSearchBar,
} from "./components";
import { useReportPage } from "./hooks/useReportPage";
import { FilterState } from "./types";

interface ReportPageProps {
  initialState?: Partial<FilterState>;
}

/**
 * Modern ReportPage — orchestrates the filter panel, results table, and footer.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐ ← AppBar (with injected ReportSearchBar)
 *   ├──────────────────────────────────────────┤
 *   │ [Filter ☰]  [Stop cols▾]  [Quay cols▾]  │ ← ReportActionBar (sticky)
 *   ├──────────────────────────────────────────┤
 *   │ ┌──────────┐ ┌────────────────────────┐ │
 *   │ │ Filters  │ │    Results table       │ │
 *   │ │ (panel)  │ │    (scrollable)        │ │
 *   │ └──────────┘ └────────────────────────┘ │
 *   ├──────────────────────────────────────────┤
 *   │ [Pages 1 2 3 ...]          [Export ▾]   │ ← ReportFooter
 *   └──────────────────────────────────────────┘
 */
export const ReportPage: React.FC<ReportPageProps> = ({
  initialState = {},
}) => {
  const { isSmallScreen } = useResponsive();

  const {
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
    handleTagCheck,
    handleToggleFilterPanel,
    loadAvailableTags,
    loadTopographicPlaces,
  } = useReportPage(initialState);

  // Load topographic places from URL state on mount
  useEffect(() => {
    const ids = initialState.topoiChips?.map((c) => c.id) ?? [];
    if (ids.length) {
      loadTopographicPlaces(ids);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute active filter count for badge display
  const activeFilterCount =
    filters.stopTypeFilter.length +
    filters.topoiChips.length +
    filters.tags.length +
    (filters.withoutLocationOnly ? 1 : 0) +
    (filters.withDuplicateImportedIds ? 1 : 0) +
    (filters.withNearbySimilarDuplicates ? 1 : 0) +
    (filters.hasParking ? 1 : 0) +
    (filters.showFutureAndExpired ? 1 : 0) +
    (filters.withTags ? 1 : 0);

  // Inject compact search bar into the AppBar header slot
  useHeaderSlot(
    <ReportSearchBar
      searchQuery={filters.searchQuery}
      isLoading={isLoading}
      activeFilterCount={activeFilterCount}
      filterPanelOpen={filterPanelOpen}
      onQueryChange={(v) => handleFilterChange("searchQuery", v)}
      onSearch={handleSearch}
      onToggleFilterPanel={handleToggleFilterPanel}
    />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      filters.searchQuery,
      isLoading,
      activeFilterCount,
      filterPanelOpen,
      handleSearch,
    ],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Sticky action bar: filter toggle + column selectors */}
      <ReportActionBar
        filterPanelOpen={filterPanelOpen}
        activeFilterCount={activeFilterCount}
        stopColumnOptions={stopColumnOptions}
        quayColumnOptions={quayColumnOptions}
        resultCount={results.length}
        onToggleFilterPanel={handleToggleFilterPanel}
        onStopColumnToggle={handleColumnStopPlaceToggle}
        onQuayColumnToggle={handleColumnQuaysToggle}
        onCheckAllStopColumns={handleCheckAllStopColumns}
        onCheckAllQuayColumns={handleCheckAllQuayColumns}
      />

      {/* Main content: filter panel + table */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Left filter panel */}
        <FilterPanel
          open={filterPanelOpen}
          isSmallScreen={isSmallScreen}
          filters={filters}
          topographicalPlacesDataSource={topographicalPlacesDataSource}
          availableTags={availableTags}
          onClose={handleToggleFilterPanel}
          onFilterChange={handleFilterChange}
          onTopographicSearch={handleTopographicalPlaceSearch}
          onAddTopographicChip={
            handleAddTopographicChip as (
              event: unknown,
              chip: import("./types").TopographicChip | string | null,
            ) => void
          }
          onDeleteTopographicChip={handleDeleteTopographicChip}
          onTagCheck={handleTagCheck}
          onLoadTags={loadAvailableTags}
        />

        {/* Scrollable results area */}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <ReportResultsTable
            results={results}
            activePageIndex={activePageIndex}
            stopColumnOptions={stopColumnOptions}
            quayColumnOptions={quayColumnOptions}
            duplicateInfo={duplicateInfo}
            expandedRows={expandedRows}
            onExpandToggle={handleExpandRow}
          />
        </Box>
      </Box>

      {/* Footer: pagination + CSV export */}
      <ReportFooter
        results={results}
        activePageIndex={activePageIndex}
        onSelectPage={handleSelectPage}
        onExportStopPlaces={handleExportStopPlacesCSV}
        onExportQuays={handleExportQuaysCSV}
      />
    </Box>
  );
};

export default ReportPage;
