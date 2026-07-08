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

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useIntl } from "react-intl";
import ModalityIconTray from "../ReportPage/ModalityIconTray";
import type { StopPlaceResult, VersionEntry } from "./types";

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
};

interface Props {
  stop: StopPlaceResult;
  entry: VersionEntry;
}

export const ChangelogVersionHistory = ({ stop, entry }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ bgcolor: "background.default", padding: "0 0 0 48px" }}>
      {stop.__typename === "ParentStopPlace" &&
        stop.children &&
        stop.children.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 0 4px",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              style={{ marginRight: 4 }}
            >
              {formatMessage({ id: "stop_places" })}:
            </Typography>
            <ModalityIconTray
              modalities={stop.children.map((c) => ({
                stopPlaceType: c.stopPlaceType,
              }))}
            />
          </div>
        )}

      {entry.loading && (
        <div
          style={{ padding: 16, display: "flex", alignItems: "center", gap: 8 }}
        >
          <CircularProgress size={14} />
          <Typography variant="caption" color="text.secondary">
            {formatMessage({ id: "changelog_loading_versions" })}
          </Typography>
        </div>
      )}

      {!entry.loading && entry.versions && entry.versions.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                },
              }}
            >
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
              <TableCell>
                {formatMessage({ id: "changelog_valid_to" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entry.versions.map((v) => (
              <TableRow key={v.version} sx={{ "& td": { fontSize: "0.8rem" } }}>
                <TableCell>{v.version}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {formatDate(v.validBetween?.fromDate)}
                </TableCell>
                <TableCell>{v.changedBy || "—"}</TableCell>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    fontStyle: v.versionComment ? "normal" : "italic",
                  }}
                >
                  {v.versionComment || "—"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {formatDate(v.validBetween?.toDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!entry.loading && entry.versions?.length === 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          style={{ display: "block", padding: 12 }}
        >
          {formatMessage({ id: "changelog_no_results" })}
        </Typography>
      )}
    </Box>
  );
};
