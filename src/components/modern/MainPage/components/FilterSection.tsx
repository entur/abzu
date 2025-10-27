/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import ModalityFilter from "../../../EditStopPage/ModalityFilter";
import TopographicalFilter from "../../../MainPage/TopographicalFilter";
import { modernCard } from "../../styles";
import { FilterSectionProps } from "../types";

export const FilterSection: React.FC<FilterSectionProps> = ({
  showMoreFilterOptions,
  stopTypeFilter,
  topographicalPlacesDataSource,
  topographicPlaceFilterValue,
  topoiChips,
  showFutureAndExpired,
  onToggleFilter,
  onApplyModalityFilters,
  onTopographicalPlaceInput,
  onAddChip,
  onDeleteChip,
  onToggleShowFutureAndExpired,
}) => {
  const theme = useTheme();
  const { formatMessage, locale } = useIntl();

  return (
    <Paper elevation={0} sx={modernCard(theme)}>
      {showMoreFilterOptions ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              paddingBottom: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <span style={{ fontWeight: 500, fontSize: "0.9375rem" }}>
              {formatMessage({ id: "filters" })}
            </span>
            <IconButton
              onClick={() => onToggleFilter(false)}
              size="small"
              sx={{
                color: theme.palette.action.active,
              }}
              aria-label={formatMessage({ id: "close_filters" })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              "& > div": {
                display: "flex",
                padding: 1,
                justifyContent: { xs: "flex-start", sm: "space-between" },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 0.5, sm: 0 },
                overflowX: { xs: "auto", sm: "visible" },
              },
            }}
          >
            <ModalityFilter
              locale={locale}
              stopTypeFilter={stopTypeFilter}
              handleApplyFilters={onApplyModalityFilters}
            />
          </Box>

          <Autocomplete
            freeSolo
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.text
            }
            options={topographicalPlacesDataSource}
            onInputChange={onTopographicalPlaceInput}
            inputValue={topographicPlaceFilterValue}
            onChange={(event, value) => onAddChip(event, value as any)}
            noOptionsText={formatMessage({ id: "no_results_found" })}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={formatMessage({ id: "filter_by_topography" })}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.id}>
                {option.value}
              </MenuItem>
            )}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFutureAndExpired}
                  onChange={(_e, value) => onToggleShowFutureAndExpired(value)}
                  size="small"
                />
              }
              label={formatMessage({
                id: "show_future_expired_and_terminated",
              })}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.8125rem",
                },
              }}
            />
          </FormGroup>

          <TopographicalFilter
            topoiChips={topoiChips}
            handleDeleteChip={onDeleteChip}
          />
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              "& > div": {
                display: "flex",
                padding: 1,
                justifyContent: { xs: "flex-start", sm: "space-between" },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 0.5, sm: 0 },
                overflowX: { xs: "auto", sm: "visible" },
              },
            }}
          >
            <ModalityFilter
              locale={locale}
              stopTypeFilter={stopTypeFilter}
              handleApplyFilters={onApplyModalityFilters}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Button
              onClick={() => onToggleFilter(true)}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              {formatMessage({ id: "filters_more" })}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
