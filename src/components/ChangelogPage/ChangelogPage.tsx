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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MdSearch from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import ModalityFilter from "../EditStopPage/ModalityFilter";
import ChangelogFavoritePopover from "./ChangelogFavoritePopover.tsx";

export interface TopoChip {
  id: string;
  text: string;
  type: "municipality" | "county" | "country";
  value: React.ReactNode;
}

export interface ChangelogFavorite {
  title: string;
  searchQuery: string;
  stopTypeFilter: string[];
  topoiChips: Omit<TopoChip, "value">[];
}

export interface StopPlaceVersion {
  version: number;
  changedBy?: string | null;
  versionComment?: string | null;
  validBetween?: { fromDate?: string | null; toDate?: string | null } | null;
}

export interface VersionEntry {
  loading: boolean;
  versions: StopPlaceVersion[] | null;
  collapsed: boolean;
}

export interface StopPlaceResult {
  id: string;
  __typename: string;
  name?: { value: string } | null;
  stopPlaceType?: string | null;
  version: number;
  changedBy?: string | null;
  versionComment?: string | null;
  validBetween?: { fromDate?: string | null; toDate?: string | null } | null;
  topographicPlace?: {
    name: { value: string };
    topographicPlaceType: string;
    parentTopographicPlace?: { name: { value: string } } | null;
  } | null;
}

interface Props extends WrappedComponentProps {
  stopTypeFilter: string[];
  topoiChips: TopoChip[];
  topographicPlaceFilterValue: string;
  topographicalPlacesDataSource: TopoChip[];
  searchQuery: string;
  isLoading: boolean;
  results: StopPlaceResult[] | null;
  versionsMap: Record<string, VersionEntry>;
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
  onToggleVersions: (stopId: string) => void;
  favorites: ChangelogFavorite[];
  favoriteNameDialogOpen: boolean;
  onOpenSaveDialog: () => void;
  onCloseSaveDialog: () => void;
  onSaveFavorite: (title: string) => void;
  onLoadFavorite: (fav: ChangelogFavorite) => void;
  onDeleteFavorite: (title: string) => void;
}

// Number of columns in the results table (used for colSpan on expanded rows)
const RESULT_COL_COUNT = 9;

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
};

const getMunicipality = (stop: StopPlaceResult): string => {
  const topo = stop.topographicPlace;
  if (!topo) return "—";
  const countyName = topo.parentTopographicPlace?.name?.value;
  return countyName ? `${topo.name.value}, ${countyName}` : topo.name.value;
};

interface LocalState {
  favoritesAnchorEl: HTMLElement | null;
  saveDialogTitleText: string;
  saveDialogError: string;
}

class ChangelogPage extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      favoritesAnchorEl: null,
      saveDialogTitleText: "",
      saveDialogError: "",
    };
  }

  render() {
    const {
      intl,
      stopTypeFilter,
      topoiChips,
      topographicPlaceFilterValue,
      topographicalPlacesDataSource,
      searchQuery,
      isLoading,
      results,
      versionsMap,
      onApplyModalityFilters,
      onSearchQueryChange,
      onTopographicalPlaceSearch,
      onAddChip,
      onDeleteChip,
      onSearch,
      onToggleVersions,
      favorites,
      favoriteNameDialogOpen,
      onOpenSaveDialog,
      onCloseSaveDialog,
      onSaveFavorite,
      onLoadFavorite,
      onDeleteFavorite,
    } = this.props;
    const { favoritesAnchorEl, saveDialogTitleText, saveDialogError } =
      this.state;
    const { locale, formatMessage } = intl;

    return (
      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          {formatMessage({ id: "changelog" })}
        </Typography>

        {/* ── Filter panel ── */}
        <Paper elevation={2} style={{ marginBottom: 24 }}>
          {/* Row 1: Modality */}
          <div style={{ padding: "12px 16px 8px" }}>
            <Typography
              variant="overline"
              display="block"
              style={{ lineHeight: 1.4, marginBottom: 4, color: "#555" }}
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

          {/* Row 2: Topography + free-text + search button */}
          <div
            style={{
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto auto auto",
              gap: 16,
              alignItems: "flex-end",
            }}
          >
            {/* Topographical autocomplete */}
            <div>
              <Typography
                variant="overline"
                display="block"
                style={{ lineHeight: 1.4, marginBottom: 4, color: "#555" }}
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
                      style={{
                        backgroundColor:
                          chip.type === "county" ? "#73919b" : "#cde7eb",
                        color: chip.type === "county" ? "#fff" : "#000",
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
                style={{ lineHeight: 1.4, marginBottom: 4, color: "#555" }}
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

            {/* Search button */}
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
              style={{ height: 40, whiteSpace: "nowrap" }}
            >
              {formatMessage({ id: "changelog_search_button" })}
            </Button>

            {/* Save filter button */}
            <Button
              variant="outlined"
              onClick={onOpenSaveDialog}
              startIcon={<BookmarkAddIcon />}
              style={{ height: 40, whiteSpace: "nowrap" }}
            >
              {formatMessage({ id: "changelog_save_filter" })}
            </Button>

            {/* Load saved filters */}
            <IconButton
              onClick={(e) =>
                this.setState({ favoritesAnchorEl: e.currentTarget })
              }
              title={formatMessage({ id: "changelog_saved_filters" })}
              style={{ height: 40, width: 40, alignSelf: "flex-end" }}
            >
              <BookmarkIcon />
            </IconButton>
          </div>
        </Paper>

        {/* ── Results ── */}
        {results !== null && results.length === 0 && !isLoading && (
          <Typography color="text.secondary" style={{ marginTop: 8 }}>
            {formatMessage({ id: "changelog_no_results" })}
          </Typography>
        )}

        {results && results.length > 0 && (
          <Paper elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{ "& th": { fontWeight: 700, background: "#f5f5f5" } }}
                >
                  <TableCell padding="checkbox" />
                  <TableCell>
                    {formatMessage({ id: "changelog_stop_name" })}
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>
                    {formatMessage({ id: "changelog_municipality" })}
                  </TableCell>
                  <TableCell>{formatMessage({ id: "type" })}</TableCell>
                  <TableCell>{formatMessage({ id: "version" })}</TableCell>
                  <TableCell>
                    {formatMessage({ id: "changelog_changed_at" })}
                  </TableCell>
                  <TableCell>
                    {formatMessage({ id: "changelog_changed_by" })}
                  </TableCell>
                  <TableCell>
                    {formatMessage({ id: "changelog_version_comment" })}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((stop) => {
                  const entry = versionsMap[stop.id];
                  const isExpanded = !!(entry && !entry.collapsed);

                  return (
                    <React.Fragment key={stop.id}>
                      <TableRow hover>
                        <TableCell padding="checkbox">
                          <IconButton
                            size="small"
                            onClick={() => onToggleVersions(stop.id)}
                            sx={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                            title={formatMessage({
                              id: "changelog_expand_versions",
                            })}
                          >
                            <ExpandMoreIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {stop.name?.value || "—"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            color: "#555",
                          }}
                        >
                          {stop.id}
                        </TableCell>
                        <TableCell>{getMunicipality(stop)}</TableCell>
                        <TableCell>{stop.stopPlaceType || "—"}</TableCell>
                        <TableCell>{stop.version}</TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}
                        >
                          {formatDate(stop.validBetween?.fromDate)}
                        </TableCell>
                        <TableCell>{stop.changedBy || "—"}</TableCell>
                        <TableCell
                          sx={{
                            color: "#555",
                            fontStyle: stop.versionComment
                              ? "normal"
                              : "italic",
                          }}
                        >
                          {stop.versionComment || "—"}
                        </TableCell>
                      </TableRow>

                      {/* Expanded version history */}
                      <TableRow>
                        <TableCell
                          colSpan={RESULT_COL_COUNT}
                          sx={{
                            p: 0,
                            borderBottom: isExpanded
                              ? "1px solid #e0e0e0"
                              : "none",
                          }}
                        >
                          <Collapse in={isExpanded} unmountOnExit>
                            <div
                              style={{
                                background: "#fafafa",
                                padding: "0 0 0 48px",
                              }}
                            >
                              {entry?.loading ? (
                                <div
                                  style={{
                                    padding: 16,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <CircularProgress size={14} />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatMessage({
                                      id: "changelog_loading_versions",
                                    })}
                                  </Typography>
                                </div>
                              ) : entry?.versions &&
                                entry.versions.length > 0 ? (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow
                                      sx={{
                                        "& th": {
                                          fontWeight: 600,
                                          fontSize: "0.75rem",
                                          color: "#555",
                                        },
                                      }}
                                    >
                                      <TableCell>
                                        {formatMessage({ id: "version" })}
                                      </TableCell>
                                      <TableCell>
                                        {formatMessage({
                                          id: "changelog_changed_at",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {formatMessage({
                                          id: "changelog_changed_by",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {formatMessage({
                                          id: "changelog_version_comment",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {formatMessage({
                                          id: "changelog_valid_to",
                                        })}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {entry.versions.map((v) => (
                                      <TableRow
                                        key={v.version}
                                        sx={{ "& td": { fontSize: "0.8rem" } }}
                                      >
                                        <TableCell>{v.version}</TableCell>
                                        <TableCell
                                          sx={{ whiteSpace: "nowrap" }}
                                        >
                                          {formatDate(v.validBetween?.fromDate)}
                                        </TableCell>
                                        <TableCell>
                                          {v.changedBy || "—"}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            color: "#555",
                                            fontStyle: v.versionComment
                                              ? "normal"
                                              : "italic",
                                          }}
                                        >
                                          {v.versionComment || "—"}
                                        </TableCell>
                                        <TableCell
                                          sx={{ whiteSpace: "nowrap" }}
                                        >
                                          {formatDate(v.validBetween?.toDate)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  style={{ display: "block", padding: 12 }}
                                >
                                  {formatMessage({
                                    id: "changelog_no_results",
                                  })}
                                </Typography>
                              )}
                            </div>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* ── Save filter dialog ── */}
        <Dialog
          open={favoriteNameDialogOpen}
          onClose={onCloseSaveDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {formatMessage({ id: "changelog_save_filter_title" })}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              value={saveDialogTitleText}
              onChange={(e) =>
                this.setState({
                  saveDialogTitleText: e.target.value,
                  saveDialogError: "",
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!saveDialogTitleText.trim()) {
                    this.setState({
                      saveDialogError: formatMessage({
                        id: "field_is_required",
                      }),
                    });
                  } else {
                    onSaveFavorite(saveDialogTitleText.trim());
                    this.setState({
                      saveDialogTitleText: "",
                      saveDialogError: "",
                    });
                  }
                }
              }}
              error={Boolean(saveDialogError)}
              helperText={saveDialogError}
              variant="outlined"
              size="small"
              style={{ marginTop: 8 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                onCloseSaveDialog();
                this.setState({ saveDialogTitleText: "", saveDialogError: "" });
              }}
            >
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="text"
              onClick={() => {
                if (!saveDialogTitleText.trim()) {
                  this.setState({
                    saveDialogError: formatMessage({ id: "field_is_required" }),
                  });
                } else {
                  onSaveFavorite(saveDialogTitleText.trim());
                  this.setState({
                    saveDialogTitleText: "",
                    saveDialogError: "",
                  });
                }
              }}
            >
              {formatMessage({ id: "use" })}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Favourites popover ── */}
        <ChangelogFavoritePopover
          anchorEl={favoritesAnchorEl}
          favorites={favorites}
          onLoad={onLoadFavorite}
          onDelete={onDeleteFavorite}
          onClose={() => this.setState({ favoritesAnchorEl: null })}
        />
      </div>
    );
  }
}

export default injectIntl(ChangelogPage);
