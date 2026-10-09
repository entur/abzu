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

import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { ColumnOption } from "../types";
import { ColumnSelector } from "./ColumnSelector";

interface ReportActionBarProps {
  filterPanelOpen: boolean;
  activeFilterCount: number;
  stopColumnOptions: ColumnOption[];
  quayColumnOptions: ColumnOption[];
  resultCount: number;
  onToggleFilterPanel: () => void;
  onStopColumnToggle: (id: string, checked: boolean) => void;
  onQuayColumnToggle: (id: string, checked: boolean) => void;
  onCheckAllStopColumns: () => void;
  onCheckAllQuayColumns: () => void;
}

/**
 * Sticky action bar sitting directly below the AppBar.
 * Houses the filter panel toggle and the column visibility selectors.
 */
export const ReportActionBar: React.FC<ReportActionBarProps> = ({
  filterPanelOpen,
  activeFilterCount,
  stopColumnOptions,
  quayColumnOptions,
  resultCount,
  onToggleFilterPanel,
  onStopColumnToggle,
  onQuayColumnToggle,
  onCheckAllStopColumns,
  onCheckAllQuayColumns,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        flexShrink: 0,
        minHeight: 44,
      }}
    >
      {/* Filter panel toggle */}
      <Tooltip
        title={formatMessage({
          id: filterPanelOpen ? "close_filters" : "toggle_filters",
        })}
      >
        <IconButton
          size="small"
          onClick={onToggleFilterPanel}
          color={filterPanelOpen ? "primary" : "default"}
        >
          <Badge badgeContent={activeFilterCount} color="error">
            <FilterListIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Column visibility selectors */}
      <ColumnSelector
        columnOptions={stopColumnOptions}
        buttonLabel={formatMessage({ id: "column_filter_label_stop_place" })}
        captionLabel={formatMessage({ id: "stop_place" })}
        onColumnToggle={onStopColumnToggle}
        onCheckAll={onCheckAllStopColumns}
      />
      <ColumnSelector
        columnOptions={quayColumnOptions}
        buttonLabel={formatMessage({ id: "column_filter_label_quays" })}
        captionLabel={formatMessage({ id: "quays" })}
        onColumnToggle={onQuayColumnToggle}
        onCheckAll={onCheckAllQuayColumns}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* Result count */}
      {resultCount > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pr: 1 }}>
          {resultCount} {formatMessage({ id: "stop_places" })}
        </Typography>
      )}
    </Box>
  );
};
