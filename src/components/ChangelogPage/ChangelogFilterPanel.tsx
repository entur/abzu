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

import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import MdSearch from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import ModalityFilter from "../EditStopPage/ModalityFilter";
import { ChangelogFavoritePopover } from "./ChangelogFavoritePopover";
import type { ChangelogFavorite, TopoChip } from "./types";

interface Props {
  stopTypeFilter: string[];
  topoiChips: TopoChip[];
  topographicPlaceFilterValue: string;
  topographicalPlacesDataSource: TopoChip[];
  searchQuery: string;
  isLoading: boolean;
  onApplyModalityFilters: (filters: string[]) => void;
  onSearchQueryChange: (query: string) => void;
  onTopographicalPlaceSearch: (
    event: React.SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  onAddChip: (event: React.SyntheticEvent, chip: TopoChip | null) => void;
  onDeleteChip: (id: string) => void;
  onSearch: () => void;
  onOpenSaveDialog: () => void;
  favorites: ChangelogFavorite[];
  onLoadFavorite: (fav: ChangelogFavorite) => void;
  onDeleteFavorite: (title: string) => void;
}

export const ChangelogFilterPanel = ({
  stopTypeFilter,
  topoiChips,
  topographicPlaceFilterValue,
  topographicalPlacesDataSource,
  searchQuery,
  isLoading,
  onApplyModalityFilters,
  onSearchQueryChange,
  onTopographicalPlaceSearch,
  onAddChip,
  onDeleteChip,
  onSearch,
  onOpenSaveDialog,
  favorites,
  onLoadFavorite,
  onDeleteFavorite,
}: Props) => {
  const { locale, formatMessage } = useIntl();
  const [favoritesAnchorEl, setFavoritesAnchorEl] =
    useState<HTMLElement | null>(null);

  return (
    <Paper elevation={2} style={{ marginBottom: 24 }}>
      {/* Row 1: Modality */}
      <div style={{ padding: "12px 16px 8px" }}>
        <Typography
          variant="overline"
          display="block"
          color="text.secondary"
          style={{ lineHeight: 1.4, marginBottom: 4 }}
        >
          {formatMessage({ id: "filter_report_by_modality" })}
        </Typography>
        <ModalityFilter
          locale={locale}
          stopTypeFilter={stopTypeFilter}
          handleApplyFilters={onApplyModalityFilters}
        />
      </div>

      <Divider />

      {/* Row 2: Topography + free-text + action buttons */}
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto auto auto",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {/* Topographical autocomplete + chips */}
        <div>
          <Typography
            variant="overline"
            display="block"
            color="text.secondary"
            style={{ lineHeight: 1.4, marginBottom: 4 }}
          >
            {formatMessage({ id: "filter_report_by_topography" })}
          </Typography>
          <Autocomplete
            freeSolo
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.text
            }
            options={topographicalPlacesDataSource}
            onInputChange={onTopographicalPlaceSearch}
            inputValue={topographicPlaceFilterValue}
            onChange={onAddChip as any}
            noOptionsText={formatMessage({ id: "no_results_found" })}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder={formatMessage({ id: "filter_by_topography" })}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={(option as TopoChip).id}>
                {(option as TopoChip).value}
              </MenuItem>
            )}
          />
          {topoiChips.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 8,
                gap: 4,
              }}
            >
              {topoiChips.map((chip) => (
                <Chip
                  key={chip.id}
                  label={chip.text}
                  onDelete={() => onDeleteChip(chip.id)}
                  size="small"
                  sx={{
                    bgcolor:
                      chip.type === "county" ? "info.main" : "info.light",
                    color: "info.contrastText",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Free-text search */}
        <div>
          <Typography
            variant="overline"
            display="block"
            color="text.secondary"
            style={{ lineHeight: 1.4, marginBottom: 4 }}
          >
            {formatMessage({ id: "search" })}
          </Typography>
          <TextField
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={formatMessage({ id: "search" })}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={onSearch}
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <MdSearch />
            )
          }
          style={{ height: 40, whiteSpace: "nowrap", marginTop: 24 }}
        >
          {formatMessage({ id: "changelog_search_button" })}
        </Button>

        <Button
          variant="outlined"
          onClick={onOpenSaveDialog}
          startIcon={<BookmarkAddIcon />}
          style={{ height: 40, whiteSpace: "nowrap", marginTop: 24 }}
        >
          {formatMessage({ id: "changelog_save_filter" })}
        </Button>

        <IconButton
          onClick={(e) => setFavoritesAnchorEl(e.currentTarget)}
          title={formatMessage({ id: "changelog_saved_filters" })}
          style={{ height: 40, width: 40, marginTop: 24 }}
        >
          <BookmarkIcon />
        </IconButton>
      </div>

      <ChangelogFavoritePopover
        anchorEl={favoritesAnchorEl}
        favorites={favorites}
        onLoad={onLoadFavorite}
        onDelete={onDeleteFavorite}
        onClose={() => setFavoritesAnchorEl(null)}
      />
    </Paper>
  );
};
