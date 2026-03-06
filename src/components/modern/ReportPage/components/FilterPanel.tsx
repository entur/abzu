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
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import ModalityFilter from "../../../../components/EditStopPage/ModalityFilter";
import { FilterState, TopographicChip } from "../types";
import { TagFilter } from "./TagFilter";

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
      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        mb={0.5}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {formatMessage({ id: "filter_report_by_modality" })}
      </Typography>
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
      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        mb={0.5}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {formatMessage({ id: "filter_report_by_topography" })}
      </Typography>
      <Autocomplete
        freeSolo
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.text
        }
        options={topographicalPlacesDataSource}
        onInputChange={onTopographicSearch}
        inputValue={filters.topographicPlaceFilterValue}
        onChange={onAddTopographicChip}
        noOptionsText={formatMessage({ id: "no_results_found" })}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            size="small"
            label={formatMessage({ id: "filter_by_topography" })}
            onChange={(e) => {
              if (e.target.value !== null) {
                onFilterChange("topographicPlaceFilterValue", e.target.value);
              }
            }}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={(option as TopographicChip).id}>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              gap={1}
            >
              <Typography variant="body2">
                {(option as TopographicChip).text}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                flexShrink={0}
              >
                {formatMessage({ id: (option as TopographicChip).type })}
              </Typography>
            </Box>
          </MenuItem>
        )}
      />
      <Box display="flex" flexWrap="wrap" mt={1} gap={0.5}>
        {filters.topoiChips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.text}
            onDelete={() => onDeleteTopographicChip(chip.id)}
            size="small"
            sx={{
              bgcolor: chip.type === "county" ? "#73919b" : "#cde7eb",
              color: chip.type === "county" ? "#fff" : "#000",
            }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tags */}
      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        mb={0.5}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {formatMessage({ id: "filter_by_tags" })}
      </Typography>
      <TagFilter
        selectedTags={filters.tags}
        availableTags={availableTags}
        onTagCheck={onTagCheck}
        onLoadTags={onLoadTags}
      />

      <Divider sx={{ my: 2 }} />

      {/* General + Advanced filters as inline checkboxes */}
      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        mb={0.5}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {formatMessage({ id: "filters_general" })}
      </Typography>
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.hasParking}
            onChange={(_e, v) => onFilterChange("hasParking", v)}
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "has_parking" })}
          </Typography>
        }
      />
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.showFutureAndExpired}
            onChange={(_e, v) => onFilterChange("showFutureAndExpired", v)}
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "show_future_expired_and_terminated" })}
          </Typography>
        }
      />

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        mb={0.5}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {formatMessage({ id: "filters_admin" })}
      </Typography>
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.withoutLocationOnly}
            onChange={(_e, v) => onFilterChange("withoutLocationOnly", v)}
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "only_without_coordinates" })}
          </Typography>
        }
      />
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.withDuplicateImportedIds}
            onChange={(_e, v) => onFilterChange("withDuplicateImportedIds", v)}
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "only_duplicate_importedIds" })}
          </Typography>
        }
      />
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.withNearbySimilarDuplicates}
            onChange={(_e, v) =>
              onFilterChange("withNearbySimilarDuplicates", v)
            }
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "with_nearby_similar_duplicates" })}
          </Typography>
        }
      />
      <FormControlLabel
        sx={{ ml: 0 }}
        control={
          <Checkbox
            size="small"
            checked={filters.withTags}
            onChange={(_e, v) => onFilterChange("withTags", v)}
          />
        }
        label={
          <Typography variant="body2">
            {formatMessage({ id: "only_with_tags" })}
          </Typography>
        }
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
