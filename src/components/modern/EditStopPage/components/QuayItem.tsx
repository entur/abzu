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

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import {
  ElementStatusDot,
  getElementRowStatusSx,
  useElementStatusEnabled,
} from "../../Shared/ElementStatus";
import { QuayItemProps } from "../types";

/** Matches QuayMarkers' marker-scale transition and MarkerPopup's timeout, so focus-change feels like one motion. */
const FOCUS_TRANSITION_MS = 200;

/**
 * Navigable quay row — clicking the row opens the QuayPanel
 */
export const QuayItem: React.FC<QuayItemProps> = ({
  quay,
  index,
  canEdit,
  focused,
  onDelete,
  onNavigate,
  status = "unchanged",
}) => {
  const { formatMessage } = useIntl();
  const isStatusEnabled = useElementStatusEnabled();

  const isGhost = status === "deleted";

  const displayCode =
    quay.publicCode ||
    quay.id ||
    `${formatMessage({ id: "quay" })} ${index + 1}`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        cursor: "pointer",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: focused ? "action.selected" : "transparent",
        borderLeft: "3px solid",
        borderLeftColor: focused ? "success.main" : "transparent",
        transition: `background-color ${FOCUS_TRANSITION_MS}ms, border-color ${FOCUS_TRANSITION_MS}ms`,
        "&:hover": { bgcolor: focused ? "action.selected" : "action.hover" },
        ...getElementRowStatusSx(status),
      }}
      onClick={isGhost ? undefined : onNavigate}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ElementStatusDot status={status} enabled={isStatusEnabled} />
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {displayCode}
          </Typography>
        </Box>
        {quay.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: "block" }}
          >
            {quay.description}
          </Typography>
        )}
        {quay.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {quay.id}
            </Typography>
            <CopyIdButton idToCopy={quay.id} size="small" />
          </Box>
        )}
      </Box>

      {canEdit && !isGhost && (
        <Tooltip title={formatMessage({ id: "delete_quay" })}>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ mr: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {!isGhost && <ChevronRightIcon fontSize="small" color="action" />}
    </Box>
  );
};
