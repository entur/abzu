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

import AccessibleIcon from "@mui/icons-material/Accessible";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import {
  getStopPlaceWithAll,
  saveParking,
} from "../../../../actions/TiamatActions";
import { parkingLayouts } from "../../../../models/parkingLayout";
import { parkingPaymentProcesses } from "../../../../models/parkingPaymentProcess";
import PARKING_TYPE from "../../../../models/parkingType";
import mapToMutationVariables from "../../../../modelUtils/mapToQueryVariables";
import { useAppDispatch } from "../../../../store/hooks";
import { CopyIdButton } from "../../Shared";
import { ParkingPanelProps } from "../types";

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
          <>
            {/* ── parkAndRide fields ── */}

            {/* Layout */}
            <FormControl fullWidth size="small" disabled={fieldDisabled}>
              <InputLabel>{formatMessage({ id: "parking_layout" })}</InputLabel>
              <Select
                value={parking.parkingLayout || ""}
                label={formatMessage({ id: "parking_layout" })}
                onChange={(e) => onTypeChange(parkingIndex, e.target.value)}
              >
                <MenuItem value="">
                  <em>{formatMessage({ id: "parking_layout_undefined" })}</em>
                </MenuItem>
                {parkingLayouts.map((layout) => (
                  <MenuItem key={layout} value={layout}>
                    {formatMessage({ id: `parking_layout_${layout}` })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Payment process (multi-select) */}
            <FormControl fullWidth size="small" disabled={fieldDisabled}>
              <InputLabel>
                {formatMessage({ id: "parking_payment_process" })}
              </InputLabel>
              <Select
                multiple
                value={parking.parkingPaymentProcess || []}
                label={formatMessage({ id: "parking_payment_process" })}
                renderValue={(selected: string[]) =>
                  selected.length === 0
                    ? formatMessage({ id: "parking_payment_process_undefined" })
                    : selected
                        .map((k) =>
                          formatMessage({
                            id: `parking_payment_process_${k}`,
                          }),
                        )
                        .join(", ")
                }
                onChange={(e) =>
                  dispatch(
                    StopPlaceActions.changeParkingPaymentProcess(
                      parkingIndex,
                      e.target.value as string[],
                    ),
                  )
                }
              >
                {parkingPaymentProcesses.map((key) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox
                      checked={
                        (parking.parkingPaymentProcess || []).indexOf(key) > -1
                      }
                      size="small"
                    />
                    <ListItemText
                      primary={formatMessage({
                        id: `parking_payment_process_${key}`,
                      })}
                      secondary={
                        key === "payByPrepaidToken"
                          ? formatMessage({
                              id: `parking_payment_process_${key}_hover`,
                            })
                          : undefined
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Capacity sub-section */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({
                  id: "parking_parkAndRide_capacity_sub_header",
                })}{" "}
                ({derivedCapacity ?? 0})
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <LocalParkingIcon fontSize="small" color="action" />
                <TextField
                  label={formatMessage({ id: "parking_number_of_spaces" })}
                  value={
                    parking.numberOfSpaces !== undefined
                      ? String(parking.numberOfSpaces)
                      : ""
                  }
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    dispatch(
                      StopPlaceActions.changeParkingNumberOfSpaces(
                        parkingIndex,
                        val,
                      ),
                    );
                  }}
                  disabled={fieldDisabled}
                  size="small"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <AccessibleIcon fontSize="small" color="action" />
                <TextField
                  label={formatMessage({
                    id: "parking_number_of_spaces_for_registered_disabled_user_type",
                  })}
                  value={
                    parking.numberOfSpacesForRegisteredDisabledUserType !==
                    undefined
                      ? String(
                          parking.numberOfSpacesForRegisteredDisabledUserType,
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    dispatch(
                      StopPlaceActions.changeParkingNumberOfSpacesForRegisteredDisabledUserType(
                        parkingIndex,
                        val,
                      ),
                    );
                  }}
                  disabled={fieldDisabled}
                  size="small"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Box>

            {/* Recharging sub-section */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "parking_recharging_sub_header" })}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.25, mb: 0.5, fontStyle: "italic" }}
              >
                {formatMessage({ id: "parking_recharging_available_info" })}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={!!parking.rechargingAvailable}
                    onChange={(e) =>
                      dispatch(
                        StopPlaceActions.changeParkingRechargingAvailable(
                          parkingIndex,
                          e.target.checked,
                        ),
                      )
                    }
                    disabled={fieldDisabled}
                    size="small"
                  />
                }
                label={formatMessage({
                  id: parking.rechargingAvailable
                    ? "parking_recharging_available_true"
                    : "parking_recharging_available_false",
                })}
              />

              <TextField
                label={formatMessage({
                  id: "parking_number_of_spaces_with_recharge_point",
                })}
                value={
                  parking.numberOfSpacesWithRechargePoint !== undefined
                    ? String(parking.numberOfSpacesWithRechargePoint)
                    : ""
                }
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  dispatch(
                    StopPlaceActions.changeParkingNumberOfSpacesWithRechargePoint(
                      parkingIndex,
                      val,
                    ),
                  );
                }}
                disabled={!parking.rechargingAvailable || fieldDisabled}
                size="small"
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Step-free accessibility */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "parking_accessibility" })}
              </Typography>
              <FormControl
                fullWidth
                size="small"
                disabled={fieldDisabled}
                sx={{ mt: 1 }}
              >
                <InputLabel>
                  {formatMessage({ id: "stepFreeAccess" })}
                </InputLabel>
                <Select
                  value={stepFreeAccess}
                  label={formatMessage({ id: "stepFreeAccess" })}
                  onChange={(e) =>
                    dispatch(
                      StopPlaceActions.setParkingStepFreeAccess(
                        parkingIndex,
                        e.target.value,
                      ),
                    )
                  }
                >
                  <MenuItem value="">
                    <em>—</em>
                  </MenuItem>
                  {STEP_FREE_VALUES.map((v) => (
                    <MenuItem key={v} value={v}>
                      {formatMessage({
                        id: `accessibilityAssessments_stepFreeAccess_${v.toLowerCase()}`,
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
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
