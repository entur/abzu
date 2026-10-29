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

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { capacityEntriesTotal } from "../../../../models/parkingCapacity";
import { parkingTitleMessageId } from "../../../../models/parkingType";
import { parkingVehicleTypeLabel } from "../../../../models/parkingVehicleType";
import { CenterMapButton, CopyIdButton } from "../../Shared";
import { ParkingPanelProps } from "../types";
import { ParkAndRideFields } from "./ParkAndRideFields";
import { StopPlaceBreadcrumb } from "./StopPlaceBreadcrumb";

const STEP_FREE_VALUES = ["TRUE", "FALSE", "UNKNOWN"];

/**
 * Full parking editor panel.
 *
 * Renders a different field set depending on which fields Tiamat holds:
 * - full field set: layout, payment process, recharging, space counts, step-free accessibility
 * - reduced field set: total capacity only
 *
 * The header icon follows the vehicle types, not the field set. A parking can
 * hold the full field set and still be for bicycles.
 *
 * Save opens the stop's save dialog: parking is saved as part of the whole
 * stop version, so other unsaved edits are never discarded (F-24a).
 */
export const ParkingPanel: React.FC<ParkingPanelProps> = ({
  parkingIndex,
  stopPlace,
  canEdit,
  onBack,
  onDelete,
  onNameChange,
  onTypeChange,
  onCapacityChange,
}) => {
  const { formatMessage } = useIntl();

  const parking = stopPlace.parking?.[parkingIndex];
  if (!parking) return null;

  const hasFullFieldSet = Boolean(parking.hasFullFieldSet);
  const isForPedalCycle = Boolean(parking.isForPedalCycle);
  const vehicleTypeLabels = (parking.parkingVehicleTypes ?? []).map((type) =>
    parkingVehicleTypeLabel(type, formatMessage),
  );

  const displayName =
    parking.name ||
    parking.id?.split(":").pop() ||
    `${formatMessage({ id: "parking" })} ${parkingIndex + 1}`;

  const derivedCapacity = hasFullFieldSet
    ? capacityEntriesTotal(parking)
    : null;

  const stepFreeAccess =
    parking.accessibilityAssessment?.limitations?.stepFreeAccess ?? "";

  const isExpired = !!parking.hasExpired;
  const fieldDisabled = !canEdit || isExpired;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StopPlaceBreadcrumb stopPlace={stopPlace} />

      <Divider />

      {/* ── Parking header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          minHeight: 48,
          gap: 0.5,
        }}
      >
        <Tooltip title={formatMessage({ id: "back" })}>
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {isForPedalCycle ? (
          <DirectionsBikeIcon sx={{ fontSize: "1.3rem", flexShrink: 0 }} />
        ) : (
          <LocalParkingIcon sx={{ fontSize: "1.3rem", flexShrink: 0 }} />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
            {displayName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatMessage({
                id: parkingTitleMessageId(parking.parkingType),
              })}
            </Typography>
            {isExpired && (
              <Chip
                label={formatMessage({ id: "parking_expired" })}
                size="small"
                color="warning"
              />
            )}
          </Box>
        </Box>
        {parking.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {parking.id}
            </Typography>
            <CopyIdButton idToCopy={parking.id} size="small" />
          </Box>
        )}
        <CenterMapButton location={stopPlace.location} />
      </Box>

      <Divider />

      {/* Scrollable fields */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Name — common to both types */}
        <TextField
          label={formatMessage({ id: "name" })}
          value={parking.name || ""}
          onChange={(e) => onNameChange(parkingIndex, e.target.value)}
          disabled={fieldDisabled}
          size="small"
          fullWidth
        />

        {/* Vehicle types — read-only. Tiamat owns this field. */}
        {vehicleTypeLabels.length > 0 && (
          <TextField
            label={formatMessage({ id: "parking_vehicle_types" })}
            value={vehicleTypeLabels.join(", ")}
            slotProps={{ input: { readOnly: true } }}
            size="small"
            fullWidth
          />
        )}

        {hasFullFieldSet ? (
          <ParkAndRideFields
            parking={parking}
            parkingIndex={parkingIndex}
            canEdit={canEdit}
            fieldDisabled={fieldDisabled}
            derivedCapacity={derivedCapacity}
          />
        ) : (
          /* ── bikeParking: capacity only ── */
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsBikeIcon fontSize="small" color="action" />
            <TextField
              label={formatMessage({ id: "totalCapacity" })}
              value={
                parking.totalCapacity !== undefined
                  ? String(parking.totalCapacity)
                  : ""
              }
              onChange={(e) => onCapacityChange(parkingIndex, e.target.value)}
              disabled={fieldDisabled}
              size="small"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Box>
        )}
      </Box>

      {/* Footer, only with something in it: an empty one left a blank band
          on read-only views (older version, F-96). */}
      {canEdit && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(parkingIndex)}
            >
              {formatMessage({ id: "delete_parking" })}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
