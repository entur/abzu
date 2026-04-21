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

import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import ModalityFilter from "../../../../components/EditStopPage/ModalityFilter";
import { FilterState, TopographicChip } from "../types";

interface ReportFiltersProps {
  stopTypeFilter: string[];
  topoiChips: TopographicChip[];
  topographicPlaceFilterValue: string;
  topographicalPlacesDataSource: TopographicChip[];
  onModalityChange: (filters: string[]) => void;
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
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  stopTypeFilter,
  topoiChips,
  topographicPlaceFilterValue,
  topographicalPlacesDataSource,
  onModalityChange,
  onTopographicSearch,
  onAddTopographicChip,
  onDeleteTopographicChip,
  onFilterChange,
}) => {
  const { formatMessage, locale } = useIntl();

  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 0 }}>
      <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
        {formatMessage({ id: "filter_report_by_modality" })}
      </Typography>
      <ModalityFilter
        locale={locale}
        stopTypeFilter={stopTypeFilter}
        handleApplyFilters={onModalityChange}
      />

      <Box mt={1}>
        <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
          {formatMessage({ id: "filter_report_by_topography" })}
        </Typography>
        <Autocomplete
          freeSolo
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.text
          }
          options={topographicalPlacesDataSource}
          onInputChange={onTopographicSearch}
          inputValue={topographicPlaceFilterValue}
          onChange={onAddTopographicChip}
          noOptionsText={formatMessage({ id: "no_results_found" })}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={formatMessage({ id: "filter_by_topography" })}
              onChange={(event) => {
                if (event.target.value !== null) {
                  onFilterChange(
                    "topographicPlaceFilterValue",
                    event.target.value,
                  );
                }
              }}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={(option as TopographicChip).id}>
              <Box display="flex" flexDirection="column" minWidth={300}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">
                    {(option as TopographicChip).text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatMessage({
                      id: (option as TopographicChip).type,
                    })}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          )}
        />

        <Box display="flex" flexWrap="wrap" mt={1} gap={0.5}>
          {topoiChips.map((chip) => {
            const isCounty = chip.type === "county";
            return (
              <Chip
                key={chip.id}
                label={chip.text}
                onDelete={() => onDeleteTopographicChip(chip.id)}
                size="small"
                sx={(theme) => ({
                  bgcolor: isCounty
                    ? theme.palette.secondary.main
                    : theme.palette.info.light,
                  color: isCounty
                    ? theme.palette.secondary.contrastText
                    : theme.palette.text.primary,
                })}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};
