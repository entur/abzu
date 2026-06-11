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

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { FilterState } from "../types";
import { AdvancedFiltersMenu } from "./AdvancedFiltersMenu";
import { TagFilter } from "./TagFilter";

interface SearchSectionProps {
  filters: FilterState;
  isLoading: boolean;
  availableTags: Array<{ name: string; comment?: string }>;
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
  onSearch: () => void;
  onTagCheck: (name: string, checked: boolean) => void;
  onLoadTags: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  filters,
  isLoading,
  availableTags,
  onFilterChange,
  onSearch,
  onTagCheck,
  onLoadTags,
}) => {
  const { formatMessage } = useIntl();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 0 }}>
      <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
        {formatMessage({ id: "filter_by_tags" })}
      </Typography>
      <TagFilter
        selectedTags={filters.tags}
        availableTags={availableTags}
        onTagCheck={onTagCheck}
        onLoadTags={onLoadTags}
      />

      <Box display="flex" alignItems="flex-end" gap={1} mt={2}>
        <TextField
          variant="standard"
          type="search"
          label={formatMessage({ id: "optional_search_string" })}
          value={filters.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flex: 1, maxWidth: 330 }}
        />
        <Button
          variant="outlined"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={16} /> : <SearchIcon />
          }
          onClick={onSearch}
          sx={{ mb: 0.5 }}
        >
          {formatMessage({ id: "search" })}
        </Button>
      </Box>

      <AdvancedFiltersMenu filters={filters} onFilterChange={onFilterChange} />
    </Paper>
  );
};
