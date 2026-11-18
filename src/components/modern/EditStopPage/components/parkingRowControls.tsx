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

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

/**
 * Grid and box styles of one entry row in the parking panel: two fields and a
 * remove button, inside a bordered box.
 */
export const entryRowSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
  alignItems: "center",
  columnGap: 1,
  p: 1,
  pt: 1.5,
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
} as const;

/** The text of a count field. A missing count shows as an empty field. */
export const countValue = (
  value: number | string | null | undefined,
): string => (value === null || value === undefined ? "" : String(value));

/** A count below zero becomes "0". An empty field stays empty. */
export const clampNegativeCount = (value: string): string =>
  value !== "" && Number(value) < 0 ? "0" : value;

interface RemoveEntryButtonProps {
  label: string;
  disabled: boolean;
  onRemove: () => void;
}

/** The remove button of an entry row, with a tooltip that shows its label. */
export const RemoveEntryButton: React.FC<RemoveEntryButtonProps> = ({
  label,
  disabled,
  onRemove,
}) => (
  <Tooltip title={label}>
    <span>
      <IconButton
        aria-label={label}
        disabled={disabled}
        onClick={onRemove}
        size="small"
      >
        <RemoveCircleIcon fontSize="small" />
      </IconButton>
    </span>
  </Tooltip>
);
