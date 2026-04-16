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
} from "../../../../actions/TiamatActions";
import PARKING_TYPE from "../../../../models/parkingType";
import mapToMutationVariables from "../../../../modelUtils/mapToQueryVariables";
import { useAppDispatch } from "../../../../store/hooks";
import { CopyIdButton } from "../../Shared";
import { ParkingPanelProps } from "../types";
import { ParkAndRideFields } from "./ParkAndRideFields";

const STEP_FREE_VALUES = ["TRUE", "FALSE", "UNKNOWN"];

/**
 * Full parking editor panel.
 *
 * Renders a different field set depending on `parkingType`:
 * - parkAndRide: layout, payment process, recharging, space counts, step-free accessibility
 * - bikeParking: total capacity only
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

  const isParkAndRide = parking.parkingType === PARKING_TYPE.PARK_AND_RIDE;

  const displayName =
    parking.name ||
    parking.id?.split(":").pop() ||
    `${formatMessage({ id: "parking" })} ${parkingIndex + 1}`;

  // Derived total capacity for parkAndRide
  const derivedCapacity = (() => {
    if (!isParkAndRide) return null;
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
      dispatch(getStopPlaceWithAll(stopPlace.id!));
    });
  };

  const isExpired = !!parking.hasExpired;
  const fieldDisabled = !canEdit || isExpired;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
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
        <Typography
          variant="subtitle1"
          sx={{ flex: 1, fontWeight: 600 }}
          noWrap
        >
          {displayName}
        </Typography>
        {parking.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary">
              {parking.id}
            </Typography>
            <CopyIdButton idToCopy={parking.id} size="small" />
          </Box>
        )}
        {isExpired && (
          <Chip
            label={formatMessage({ id: "parking_expired" })}
            size="small"
            color="warning"
          />
        )}
      </Box>

      <Divider />

      {/* Section title */}
      <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {formatMessage({
            id: `parking_item_title_${parking.parkingType || "parkAndRide"}`,
          })}
        </Typography>
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

        {isParkAndRide ? (
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
              inputProps={{ min: 0 }}
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
