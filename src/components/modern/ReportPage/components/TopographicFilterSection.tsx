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
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useIntl } from "react-intl";
import { FilterState, TopographicChip } from "../types";

interface TopographicFilterSectionProps {
  topographicalPlacesDataSource: TopographicChip[];
  topographicPlaceFilterValue: string;
  topoiChips: TopographicChip[];
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

export const TopographicFilterSection: React.FC<
  TopographicFilterSectionProps
> = ({
  topographicalPlacesDataSource,
  topographicPlaceFilterValue,
  topoiChips,
  onTopographicSearch,
  onAddTopographicChip,
  onDeleteTopographicChip,
  onFilterChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
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
        {topoiChips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.text}
            onDelete={() => onDeleteTopographicChip(chip.id)}
            size="small"
            sx={(theme) => ({
              bgcolor:
                chip.type === "county"
                  ? theme.palette.info.main
                  : alpha(theme.palette.info.main, 0.2),
              color:
                chip.type === "county"
                  ? theme.palette.info.contrastText
                  : theme.palette.text.primary,
            })}
          />
        ))}
      </Box>
    </>
  );
};
