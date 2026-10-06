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
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
import { QuaysSectionProps } from "../types";

import { QuayItem } from "./QuayItem";

export const QuaysSection: React.FC<QuaysSectionProps> = ({
  quays,
  canEdit,
  onDeleteQuay,
  onNavigateToQuay,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        { type: string; index: number } | undefined,
  );
  const originalQuays = useAppSelector(
    (state) =>
      (state.stopPlace as any).originalCurrent?.quays as
        typeof quays | undefined,
  );
  const [expanded, setExpanded] = useState(false);

  // Ghost rows for staged deletions come from the original snapshot, so the list
  // shows what will happen on save rather than silently dropping the row.
  const entries = buildElementListEntries(quays, originalQuays);
  const isStatusEnabled = useElementStatusEnabled();

  /* The section is collapsed by default, so without a badge here a changed quay
     is invisible in the panel — the row dot is hidden with the list. DirtyBadge
     exists for exactly this: a surface that hides its contents. */
  const hasPendingEntry = entries.some((entry) => entry.status !== "unchanged");

  const handleToggle = () => {
    if (expanded) dispatch(StopPlaceActions.setElementFocus(-1, "quay"));
    setExpanded((v) => !v);
  };

  return (
    <Box>
      <Divider />
      {/* Section header — click to toggle */}
      <Box
        onClick={handleToggle}
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
          <LocationOnIcon fontSize="small" color="action" />
        </DirtyBadge>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "quays" })}
        </Typography>
        <Chip label={quays.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
      </Box>

      {/* Collapsible quay list */}
      <Collapse in={expanded}>
        <Divider />
        {entries.map((entry, position) => (
          <QuayItem
            key={entry.element.id || `quay-${position}`}
            quay={entry.element}
            index={entry.index ?? position}
            canEdit={canEdit}
            status={entry.status}
            focused={
              entry.index !== null &&
              focusedElement?.type === "quay" &&
              focusedElement?.index === entry.index
            }
            onDelete={() => entry.index !== null && onDeleteQuay(entry.index)}
            onNavigate={() =>
              entry.index !== null && onNavigateToQuay(entry.index)
            }
          />
        ))}
      </Collapse>
    </Box>
  );
};
