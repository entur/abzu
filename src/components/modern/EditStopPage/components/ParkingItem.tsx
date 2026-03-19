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
import { ParkingItemProps } from "../types";

/**
 * Navigable parking row — clicking opens the ParkingPanel
 */
export const ParkingItem: React.FC<ParkingItemProps> = ({
  parking,
  index,
  canEdit,
  onDelete,
  onNavigate,
}) => {
  const { formatMessage } = useIntl();

  const displayName =
    parking.name ||
    parking.id?.split(":").pop() ||
    `${formatMessage({ id: "parking" })} ${index + 1}`;

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
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onNavigate}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {displayName}
        </Typography>
        {parking.parkingType && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            display="block"
          >
            {formatMessage({ id: parking.parkingType })}
          </Typography>
        )}
        {parking.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {parking.id}
            </Typography>
            <CopyIdButton idToCopy={parking.id} size="small" />
          </Box>
        )}
      </Box>

      {canEdit && (
        <Tooltip title={formatMessage({ id: "delete_parking" })}>
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

      <ChevronRightIcon fontSize="small" color="action" />
    </Box>
  );
};
