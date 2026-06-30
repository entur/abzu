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

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useIntl } from "react-intl";
import { CHANGELOG_RESULT_LIMIT } from "../../graphql/Tiamat/queries";
import { ChangelogResultRow } from "./ChangelogResultRow";
import type { StopPlaceResult, VersionEntry } from "./types";

type SortKey =
  | "name"
  | "id"
  | "municipality"
  | "type"
  | "version"
  | "changedAt"
  | "changedBy";
type SortDirection = "asc" | "desc";

const getMunicipality = (stop: StopPlaceResult): string => {
  const topo = stop.topographicPlace;
  if (!topo) return "";
  const countyName = topo.parentTopographicPlace?.name?.value;
  return countyName ? `${topo.name.value}, ${countyName}` : topo.name.value;
};

const getSortValue = (stop: StopPlaceResult, key: SortKey): string | number => {
  switch (key) {
    case "name":
      return stop.name?.value ?? "";
    case "id":
      return stop.id;
    case "municipality":
      return getMunicipality(stop);
    case "type":
      return stop.stopPlaceType ?? "";
    case "version":
      return stop.version;
    case "changedAt":
      return stop.validBetween?.fromDate ?? "";
    case "changedBy":
      return stop.changedBy ?? "";
  }
};

const sortResults = (
  results: StopPlaceResult[],
  key: SortKey,
  direction: SortDirection,
): StopPlaceResult[] =>
  [...results].sort((a, b) => {
    const aVal = getSortValue(a, key);
    const bVal = getSortValue(b, key);
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

interface Props {
  results: StopPlaceResult[] | null;
  versionsMap: Record<string, VersionEntry>;
  isLoading: boolean;
  onToggleVersions: (stopId: string) => void;
}

export const ChangelogResultsTable = ({
  results,
  versionsMap,
  isLoading,
  onToggleVersions,
}: Props) => {
  const { formatMessage } = useIntl();
  const [sortKey, setSortKey] = useState<SortKey>("changedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortLabel = (key: SortKey, label: string) => (
    <TableSortLabel
      active={sortKey === key}
      direction={sortKey === key ? sortDirection : "asc"}
      onClick={() => handleSort(key)}
    >
      {label}
    </TableSortLabel>
  );

  if (results !== null && results.length === 0 && !isLoading) {
    return (
      <Typography color="text.secondary" style={{ marginTop: 8 }}>
        {formatMessage({ id: "changelog_no_results" })}
      </Typography>
    );
  }

  if (!results || results.length === 0) return null;

  const sortedResults = sortResults(results, sortKey, sortDirection);

  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        style={{ marginBottom: 8 }}
      >
        {results.length} {formatMessage({ id: "changelog_results_count" })}
        {results.length >= CHANGELOG_RESULT_LIMIT && (
          <Typography
            component="span"
            variant="body2"
            color="warning.main"
            style={{ marginLeft: 8 }}
          >
            {formatMessage({ id: "changelog_results_truncated" })}
          </Typography>
        )}
      </Typography>

      <Paper elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{ "& th": { fontWeight: 700, background: "action.hover" } }}
            >
              <TableCell padding="checkbox" />
              <TableCell>
                {sortLabel(
                  "name",
                  formatMessage({ id: "changelog_stop_name" }),
                )}
              </TableCell>
              <TableCell>{sortLabel("id", "ID")}</TableCell>
              <TableCell>
                {sortLabel(
                  "municipality",
                  formatMessage({ id: "changelog_municipality" }),
                )}
              </TableCell>
              <TableCell>
                {sortLabel("type", formatMessage({ id: "type" }))}
              </TableCell>
              <TableCell>
                {sortLabel("version", formatMessage({ id: "version" }))}
              </TableCell>
              <TableCell>
                {sortLabel(
                  "changedAt",
                  formatMessage({ id: "changelog_changed_at" }),
                )}
              </TableCell>
              <TableCell>
                {sortLabel(
                  "changedBy",
                  formatMessage({ id: "changelog_changed_by" }),
                )}
              </TableCell>
              <TableCell>
                {formatMessage({ id: "changelog_version_comment" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResults.map((stop) => (
              <ChangelogResultRow
                key={stop.id}
                stop={stop}
                entry={versionsMap[stop.id]}
                onToggleVersions={onToggleVersions}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};
