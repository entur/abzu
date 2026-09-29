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
import SaveIcon from "@mui/icons-material/Save";
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
import {
  getStopPlaceWithAll,
  saveParking,
} from "../../../../actions/TiamatActions.modern";
import { parkingTitleMessageId } from "../../../../models/parkingType";
import { parkingVehicleTypes } from "../../../../models/parkingVehicleType";
import mapToMutationVariables from "../../../../modelUtils/mapToQueryVariables";
import { useAppDispatch } from "../../../../store/hooks";
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
 * Saves directly via saveParking mutation (no ConfirmSaveDialog).
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
  const dispatch = useAppDispatch();

  const parking = stopPlace.parking?.[parkingIndex];
  if (!parking) return null;

  const hasFullFieldSet = Boolean(parking.hasFullFieldSet);
  const isForPedalCycle = Boolean(parking.isForPedalCycle);
  // Only known types have a message. An unknown type gets no label, so it is
  // safer to omit it than to print a message key.
  const knownVehicleTypes: string[] = parkingVehicleTypes;
  const vehicleTypes = (parking.parkingVehicleTypes ?? []).filter((type) =>
    knownVehicleTypes.includes(type),
  );

  const displayName =
    parking.name ||
    parking.id?.split(":").pop() ||
    `${formatMessage({ id: "parking" })} ${parkingIndex + 1}`;

  // Derived total capacity for parkAndRide
  const derivedCapacity = (() => {
    if (!hasFullFieldSet) return null;
    const n = Number(parking.numberOfSpaces) || 0;
    const d = Number(parking.numberOfSpacesForRegisteredDisabledUserType) || 0;
    return n + d;
  })();

  const stepFreeAccess =
    parking.accessibilityAssessment?.limitations?.stepFreeAccess ?? "";

  const handleSave = () => {
    if (!stopPlace.id) return;
    const variables = mapToMutationVariables.mapParkingToVariables(
      [parking],
      stopPlace.id,
    );
    dispatch(saveParking(variables)).then(() => {
      dispatch(getStopPlaceWithAll(stopPlace.id!, true));
    });
  };

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
        {vehicleTypes.length > 0 && (
          <TextField
            label={formatMessage({ id: "parking_vehicle_types" })}
            value={vehicleTypes
              .map((type) =>
                formatMessage({ id: `parking_vehicle_type_${type}` }),
              )
              .join(", ")}
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
            derivedCapacity={derivedCapacity ?? 0}
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

      {/* Footer */}
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
        {canEdit && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(parkingIndex)}
          >
            {formatMessage({ id: "delete_parking" })}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ ml: "auto" }}
          >
            {formatMessage({ id: "save" })}
          </Button>
        )}
      </Box>
    </Box>
  );
};
