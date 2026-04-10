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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { useIntl } from "react-intl";
import ModalityIconImg from "../MainPage/ModalityIconImg";
import { ChangelogVersionHistory } from "./ChangelogVersionHistory";
import type { StopPlaceResult, VersionEntry } from "./types";

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

interface Props {
  stop: StopPlaceResult;
  entry: VersionEntry | undefined;
  onToggleVersions: (stopId: string) => void;
}

export const ChangelogResultRow = ({
  stop,
  entry,
  onToggleVersions,
}: Props) => {
  const { formatMessage } = useIntl();
  const isExpanded = !!(entry && !entry.collapsed);

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell padding="checkbox">
          <IconButton
            size="small"
            onClick={() => onToggleVersions(stop.id)}
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
            title={formatMessage({ id: "changelog_expand_versions" })}
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
            color: "text.secondary",
          }}
        >
          {stop.id}
        </TableCell>
        <TableCell>{getMunicipality(stop)}</TableCell>
        <TableCell>
          {stop.__typename === "ParentStopPlace" ? (
            <span
              aria-label={formatMessage({ id: "multimodal" })}
              title={formatMessage({ id: "multimodal" })}
              style={{ fontWeight: 600, fontSize: "0.85em" }}
            >
              MM
            </span>
          ) : stop.stopPlaceType ? (
            <span
              role="img"
              aria-label={stop.stopPlaceType}
              title={stop.stopPlaceType}
            >
              <ModalityIconImg
                type={stop.stopPlaceType}
                svgStyle={{ width: 24, height: 20 }}
                iconStyle={{}}
              />
            </span>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>{stop.version}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
          {formatDate(stop.validBetween?.fromDate)}
        </TableCell>
        <TableCell>{stop.changedBy || "—"}</TableCell>
        <TableCell
          sx={{
            color: "text.secondary",
            fontStyle: stop.versionComment ? "normal" : "italic",
          }}
        >
          {stop.versionComment || "—"}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={RESULT_COL_COUNT}
          sx={(theme) => ({
            p: 0,
            borderBottom: isExpanded
              ? `1px solid ${theme.palette.divider}`
              : "none",
          })}
        >
          <Collapse in={isExpanded} unmountOnExit>
            {entry && <ChangelogVersionHistory stop={stop} entry={entry} />}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
