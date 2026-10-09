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

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { Box, Chip, Collapse, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  buildElementListEntries,
  DirtyBadge,
  useElementStatusEnabled,
} from "../../Shared/ElementStatus";
import { ParkingSectionProps } from "../types";
import { ParkingItem } from "./ParkingItem";

export const ParkingSection: React.FC<ParkingSectionProps> = ({
  parking,
  canEdit,
  onDeleteParking,
  onNavigateToParking,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        { type: string; index: number } | undefined,
  );
  const originalParking = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent?.parking,
  );
  const [expanded, setExpanded] = useState(false);
  // Ghost rows for staged deletions come from the original snapshot, so the list
  // shows what will happen on save rather than silently dropping the row.
  const entries = buildElementListEntries(parking, originalParking);
  const isStatusEnabled = useElementStatusEnabled();

  /* The section is collapsed by default, so without a badge here a changed quay
     is invisible in the panel — the row dot is hidden with the list. DirtyBadge
     exists for exactly this: a surface that hides its contents. */
  const hasPendingEntry = entries.some((entry) => entry.status !== "unchanged");

  return (
    <Box>
      <Divider />
      {/* Section header — click to toggle */}
      <Box
        onClick={() => {
          if (expanded) dispatch(StopPlaceActions.setElementFocus(-1, "quay"));
          setExpanded((v) => !v);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.default",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <DirtyBadge dirty={isStatusEnabled && hasPendingEntry}>
          <LocalParkingIcon fontSize="small" color="action" />
        </DirtyBadge>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "parking" })}
        </Typography>
        <Chip label={parking.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
      </Box>

      {/* Collapsible parking list */}
      <Collapse in={expanded}>
        <Divider />
        {entries.map((entry, position) => (
          <ParkingItem
            key={entry.element.id || `parking-${position}`}
            parking={entry.element}
            index={entry.index ?? position}
            canEdit={canEdit}
            status={entry.status}
            focused={
              entry.index !== null &&
              (focusedElement?.type === "parkAndRide" ||
                focusedElement?.type === "bikeParking") &&
              focusedElement?.index === entry.index
            }
            onDelete={() =>
              entry.index !== null && onDeleteParking(entry.index)
            }
            onNavigate={() =>
              entry.index !== null && onNavigateToParking(entry.index)
            }
          />
        ))}
      </Collapse>
    </Box>
  );
};
