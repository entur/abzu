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

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface Version {
  version?: number | string;
  name?: string;
  fromDate?: string;
  toDate?: string;
  changedBy?: string;
  versionComment?: string;
}

interface VersionsDialogProps {
  open: boolean;
  versions: Version[];
  handleClose: () => void;
}

/**
 * Read-only dialog showing the version history of a stop place.
 * Versions are displayed sorted descending by version number.
 */
export const VersionsDialog: React.FC<VersionsDialogProps> = ({
  open,
  versions,
  handleClose,
}) => {
  const { formatMessage } = useIntl();

  const sorted = [...versions].sort((a, b) => {
    const av = Number(a.version ?? 0);
    const bv = Number(b.version ?? 0);
    return bv - av;
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" component="span" sx={{ flex: 1 }}>
          {formatMessage({ id: "versions" })}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {sorted.length === 0 ? (
          <Typography sx={{ p: 3, color: "text.secondary" }}>
            {formatMessage({ id: "no_versions_found" })}
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "version" })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "valid_from" })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "expires" })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "changed_by" })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "comment" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((v, i) => (
                <TableRow key={i} hover>
                  <TableCell>{v.version ?? "—"}</TableCell>
                  <TableCell>{v.fromDate ?? "—"}</TableCell>
                  <TableCell>{v.toDate ?? "—"}</TableCell>
                  <TableCell>{v.changedBy ?? "—"}</TableCell>
                  <TableCell>{v.versionComment ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};
