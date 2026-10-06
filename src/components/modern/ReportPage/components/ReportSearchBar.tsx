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
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { headerSearchDesktopContainer, searchFieldSx } from "../../styles";

const LOADING_SPINNER_SIZE = 14;

interface ReportSearchBarProps {
  searchQuery: string;
  isLoading: boolean;
  activeFilterCount: number;
  filterPanelOpen: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onToggleFilterPanel: () => void;
}

/**
 * Report search bar rendered inside the AppBar header slot.
 * Styled to match the main-page SearchInput: solid rounded white box on the AppBar.
 * The filter toggle and search button live inside the field as end adornments.
 */
export const ReportSearchBar: React.FC<ReportSearchBarProps> = ({
  searchQuery,
  isLoading,
  activeFilterCount,
  filterPanelOpen,
  onQueryChange,
  onSearch,
  onToggleFilterPanel,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <Box sx={headerSearchDesktopContainer}>
      <TextField
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        sx={searchFieldSx(theme)}
        slotProps={{
          htmlInput: {
            placeholder: formatMessage({ id: "report_search_placeholder" }),
          },
          input: {
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={onToggleFilterPanel}
                    aria-label={formatMessage({
                      id: filterPanelOpen ? "close_filters" : "toggle_filters",
                    })}
                    sx={{
                      color: filterPanelOpen
                        ? theme.palette.warning.main
                        : theme.palette.action.active,
                    }}
                  >
                    <Badge badgeContent={activeFilterCount} color="error">
                      <FilterListIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </InputAdornment>
                {/* A named action, not a bare magnifier: this search only runs when
                    submitted, unlike the main page's search-as-you-type. */}
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={onSearch}
                    disabled={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={LOADING_SPINNER_SIZE} />
                      ) : undefined
                    }
                    sx={{ mr: -0.5, minWidth: "auto", whiteSpace: "nowrap" }}
                  >
                    {formatMessage({ id: "search" })}
                  </Button>
                </InputAdornment>
              </>
            ),
          },
        }}
      />
    </Box>
  );
};
