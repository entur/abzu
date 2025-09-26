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

import { FilterList as FilterIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import MdSpinner from "../../../../static/icons/spinner";
import { SearchInputProps } from "../types";

export const SearchInput: React.FC<SearchInputProps> = ({
  menuItems,
  loading,
  stopPlaceSearchValue,
  showFilters = false,
  activeFilterCount = 0,
  onSearchUpdate,
  onNewRequest,
  onToggleFilters,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <div className="search-input-container">
      <Autocomplete
        freeSolo
        options={menuItems}
        loading={loading}
        filterOptions={(options) => options} // Disable client-side filtering
        loadingText={
          <MenuItem className="search-menu-item loading">
            <MdSpinner className="search-loading-spinner" />
            <span>{formatMessage({ id: "loading" })}</span>
          </MenuItem>
        }
        onInputChange={onSearchUpdate}
        inputValue={stopPlaceSearchValue}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option.id || option.text}
            className="search-menu-item"
          >
            {option.menuDiv}
          </MenuItem>
        )}
        onChange={(event, value) => onNewRequest(event, value as any)}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option?.text || ""
        }
        noOptionsText={formatMessage({ id: "no_results_found" })}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              border: `1px solid ${theme.palette.divider}`,
              mt: 1,
              maxHeight: "60vh",
              overflow: "auto",
              maxWidth: { xs: "calc(100vw - 32px)", sm: "460px" },
              width: "100%",
            },
          },
          popper: {
            sx: {
              zIndex: theme.zIndex.modal + 1,
              width: "100%",
              maxWidth: { xs: "calc(100vw - 32px)", sm: "460px" },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: "filter_by_name" })}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {onToggleFilters && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onToggleFilters}
                        size="small"
                        sx={{
                          marginRight: -1,
                          color: showFilters
                            ? theme.palette.primary.main
                            : theme.palette.action.active,
                        }}
                        aria-label={formatMessage({ id: "toggle_filters" })}
                      >
                        {activeFilterCount > 0 ? (
                          <Badge
                            badgeContent={activeFilterCount}
                            color="primary"
                            variant="standard"
                          >
                            <FilterIcon fontSize="small" />
                          </Badge>
                        ) : (
                          <FilterIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
                "&:hover": {
                  "& > fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused": {
                  "& > fieldset": {
                    borderWidth: 2,
                  },
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: theme.palette.primary.main,
                },
              },
            }}
          />
        )}
      />
    </div>
  );
};
