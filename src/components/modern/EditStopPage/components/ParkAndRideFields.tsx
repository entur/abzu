/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import AccessibleIcon from "@mui/icons-material/Accessible";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { parkingLayouts } from "../../../../models/parkingLayout";
import { parkingPaymentProcesses } from "../../../../models/parkingPaymentProcess";
import { useAppDispatch } from "../../../../store/hooks";
import { Parking } from "../types";

interface ParkAndRideFieldsProps {
  parking: Parking;
  parkingIndex: number;
  canEdit: boolean;
  fieldDisabled: boolean;
  derivedCapacity: number;
}

/**
 * All Park-and-Ride–specific fields: layout, payment process, capacity, recharging, accessibility.
 * Extracted from ParkingPanel to keep that component within the file size limit.
 */
export const ParkAndRideFields: React.FC<ParkAndRideFieldsProps> = ({
  parking,
  parkingIndex,
  canEdit,
  fieldDisabled,
  derivedCapacity,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const stepFreeAccess =
    parking.accessibilityAssessment?.limitations?.stepFreeAccess ?? "";

  const STEP_FREE_VALUES = ["TRUE", "FALSE", "UNKNOWN"];

  return (
    <>
      {/* Layout */}
      <FormControl fullWidth size="small" disabled={fieldDisabled}>
        <InputLabel>{formatMessage({ id: "parking_layout" })}</InputLabel>
        <Select
          value={parking.parkingLayout || ""}
          label={formatMessage({ id: "parking_layout" })}
          onChange={(e) =>
            dispatch(
              StopPlaceActions.changeParkingLayout(
                parkingIndex,
                e.target.value,
              ),
            )
          }
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
                    formatMessage({ id: `parking_payment_process_${k}` }),
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

      {/* Capacity */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {formatMessage({
            id: "parking_parkAndRide_capacity_sub_header",
          })}{" "}
          ({derivedCapacity})
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
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
                StopPlaceActions.changeParkingNumberOfSpaces(parkingIndex, val),
              );
            }}
            disabled={fieldDisabled}
            size="small"
            type="number"
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <AccessibleIcon fontSize="small" color="action" />
          <TextField
            label={formatMessage({
              id: "parking_number_of_spaces_for_registered_disabled_user_type",
            })}
            value={
              parking.numberOfSpacesForRegisteredDisabledUserType !== undefined
                ? String(parking.numberOfSpacesForRegisteredDisabledUserType)
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

      {/* Recharging */}
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
          <InputLabel>{formatMessage({ id: "stepFreeAccess" })}</InputLabel>
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
  );
};
