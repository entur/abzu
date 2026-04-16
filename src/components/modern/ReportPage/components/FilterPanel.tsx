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

import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import ModalityFilter from "../../../../components/EditStopPage/ModalityFilter";
import { FilterState, TopographicChip } from "../types";
import { GeneralFiltersSection } from "./GeneralFiltersSection";
import { TagFilter } from "./TagFilter";
import { TopographicFilterSection } from "./TopographicFilterSection";

const PANEL_WIDTH = 288;

interface FilterPanelProps {
  open: boolean;
  isSmallScreen: boolean;
  filters: FilterState;
  topographicalPlacesDataSource: TopographicChip[];
  availableTags: Array<{ name: string; comment?: string }>;
  onClose: () => void;
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
  onTopographicSearch: (
    event: unknown,
    searchText: string,
    reason?: string,
  ) => void;
  onAddTopographicChip: (
    event: unknown,
    chip: TopographicChip | string | null,
  ) => void;
  onDeleteTopographicChip: (chipId: string) => void;
  onTagCheck: (name: string, checked: boolean) => void;
  onLoadTags: () => void;
}

const FilterPanelContent: React.FC<
  Omit<FilterPanelProps, "open" | "isSmallScreen">
> = ({
  filters,
  topographicalPlacesDataSource,
  availableTags,
  onClose,
  onFilterChange,
  onTopographicSearch,
  onAddTopographicChip,
  onDeleteTopographicChip,
  onTagCheck,
  onLoadTags,
}) => {
  const { formatMessage, locale } = useIntl();

  const sectionLabel = (labelId: string) => (
    <Typography
      variant="caption"
      fontWeight={600}
      display="block"
      mb={0.5}
      color="text.secondary"
      textTransform="uppercase"
      letterSpacing={0.5}
    >
      {formatMessage({ id: labelId })}
    </Typography>
  );

  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        p: 2,
        overflowY: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Panel header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {formatMessage({ id: "toggle_filters" })}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={formatMessage({ id: "close_filters" })}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Modality */}
      {sectionLabel("filter_report_by_modality")}
      {/* Wrap to override ModalityFilter's inline flex container so icons wrap on small panels */}
      <Box sx={{ "& > div": { flexWrap: "wrap", gap: "2px" } }}>
        <ModalityFilter
          locale={locale}
          stopTypeFilter={filters.stopTypeFilter}
          handleApplyFilters={(f: string[]) =>
            onFilterChange("stopTypeFilter", f)
          }
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Topographic */}
      {sectionLabel("filter_report_by_topography")}
      <TopographicFilterSection
        topographicalPlacesDataSource={topographicalPlacesDataSource}
        topographicPlaceFilterValue={filters.topographicPlaceFilterValue}
        topoiChips={filters.topoiChips}
        onTopographicSearch={onTopographicSearch}
        onAddTopographicChip={onAddTopographicChip}
        onDeleteTopographicChip={onDeleteTopographicChip}
        onFilterChange={onFilterChange}
      />

      <Divider sx={{ my: 2 }} />

      {/* Tags */}
      {sectionLabel("filter_by_tags")}
      <TagFilter
        selectedTags={filters.tags}
        availableTags={availableTags}
        onTagCheck={onTagCheck}
        onLoadTags={onLoadTags}
      />

      <Divider sx={{ my: 2 }} />

      {/* General + Admin checkboxes */}
      <GeneralFiltersSection
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </Box>
  );
};

/**
 * Collapsible filter sidebar.
 * - Desktop (≥ md): smooth width-transition box embedded in the page layout.
 * - Mobile (< md): temporary Drawer that slides over content.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  isSmallScreen,
  onClose,
  ...rest
}) => {
  if (isSmallScreen) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        variant="temporary"
        anchor="left"
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 1,
          "& .MuiDrawer-paper": { width: PANEL_WIDTH },
        }}
      >
        <FilterPanelContent onClose={onClose} {...rest} />
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: open ? PANEL_WIDTH : 0,
        flexShrink: 0,
        overflow: "hidden",
        borderRight: open ? "1px solid" : "none",
        borderColor: "divider",
        transition: "width 0.2s ease",
      }}
    >
      <FilterPanelContent onClose={onClose} {...rest} />
    </Box>
  );
};
