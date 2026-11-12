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

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Button,
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
import { LightingEnum } from "../../../../models/Lighting";
import { parkingLayouts } from "../../../../models/parkingLayout";
import { parkingPaymentProcesses } from "../../../../models/parkingPaymentProcess";
import { paymentMethods } from "../../../../models/paymentMethod";
import { useAppDispatch } from "../../../../store/hooks";
import { Parking } from "../types";
import { CapacityEntryRow } from "./CapacityEntryRow";

interface ParkAndRideFieldsProps {
  parking: Parking;
  parkingIndex: number;
  canEdit: boolean;
  fieldDisabled: boolean;
  derivedCapacity: number | null;
}

/**
 * All Park-and-Ride–specific fields: layout, payment process, payment methods, capacity, recharging, accessibility.
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
        <InputLabel shrink>
          {formatMessage({ id: "parking_layout" })}
        </InputLabel>
        <Select
          value={parking.parkingLayout || ""}
          displayEmpty
          notched
          label={formatMessage({ id: "parking_layout" })}
          renderValue={(selected: string) =>
            selected ? (
              formatMessage({
                id: `parking_layout_${selected}`,
                defaultMessage: selected,
              })
            ) : (
              <em>{formatMessage({ id: "parking_layout_undefined" })}</em>
            )
          }
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
              {formatMessage({
                id: `parking_layout_${layout}`,
                defaultMessage: layout,
              })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Secure, lighting and the parent stop place reference */}
      <FormControlLabel
        control={
          <Switch
            checked={!!parking.secure}
            onChange={(e) =>
              dispatch(
                StopPlaceActions.changeParkingSecure(
                  parkingIndex,
                  e.target.checked,
                ),
              )
            }
            disabled={fieldDisabled}
            size="small"
          />
        }
        label={formatMessage({ id: "parking_secure" })}
      />

      <FormControl fullWidth size="small" disabled={fieldDisabled}>
        <InputLabel shrink>
          {formatMessage({ id: "parking_lighting" })}
        </InputLabel>
        <Select
          value={parking.lighting || ""}
          displayEmpty
          notched
          label={formatMessage({ id: "parking_lighting" })}
          renderValue={(selected: string) =>
            selected ? (
              formatMessage({
                id: `lighting_${selected.toLowerCase()}`,
                defaultMessage: selected,
              })
            ) : (
              <em>{formatMessage({ id: "parking_lighting_undefined" })}</em>
            )
          }
          onChange={(e) =>
            dispatch(
              StopPlaceActions.changeParkingLighting(
                parkingIndex,
                e.target.value,
              ),
            )
          }
        >
          <MenuItem value="">
            <em>{formatMessage({ id: "parking_lighting_undefined" })}</em>
          </MenuItem>
          {Object.values(LightingEnum).map((value) => (
            <MenuItem key={value} value={value}>
              {formatMessage({
                id: `lighting_${value.toLowerCase()}`,
                defaultMessage: value,
              })}
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
                    // defaultMessage falls back to the raw enum value so a
                    // stop place holding a value with no translated label
                    // still renders something readable instead of an empty
                    // string.
                    formatMessage({
                      id: `parking_payment_process_${k}`,
                      defaultMessage: k,
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
                  defaultMessage: key,
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

      {/* Payment methods (multi-select) */}
      <FormControl fullWidth size="small" disabled={fieldDisabled}>
        <InputLabel>
          {formatMessage({ id: "parking_payment_methods" })}
        </InputLabel>
        <Select
          multiple
          value={parking.paymentMethods || []}
          label={formatMessage({ id: "parking_payment_methods" })}
          renderValue={(selected: string[]) =>
            selected.length === 0
              ? formatMessage({ id: "parking_payment_methods_undefined" })
              : selected
                  .map((k) =>
                    // defaultMessage falls back to the raw enum value so a
                    // stop place holding a value with no translated label
                    // still renders something readable instead of an empty
                    // string.
                    formatMessage({
                      id: `parking_payment_methods_${k}`,
                      defaultMessage: k,
                    }),
                  )
                  .join(", ")
          }
          onChange={(e) =>
            dispatch(
              StopPlaceActions.changeParkingPaymentMethods(
                parkingIndex,
                e.target.value as string[],
              ),
            )
          }
        >
          {paymentMethods.map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox
                checked={(parking.paymentMethods || []).indexOf(key) > -1}
                size="small"
              />
              <ListItemText
                primary={formatMessage({
                  id: `parking_payment_methods_${key}`,
                  defaultMessage: key,
                })}
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
          ({derivedCapacity ?? formatMessage({ id: "not_assigned" })})
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
          {(parking.capacityEntries ?? []).map((entry, entryIndex) => (
            <CapacityEntryRow
              key={entryIndex}
              entry={entry}
              parkingIndex={parkingIndex}
              entryIndex={entryIndex}
              disabled={fieldDisabled}
              rechargingAvailable={!!parking.rechargingAvailable}
            />
          ))}
        </Box>
        <Button
          startIcon={<AddCircleIcon />}
          disabled={fieldDisabled}
          onClick={() =>
            dispatch(StopPlaceActions.addParkingCapacityEntry(parkingIndex))
          }
          size="small"
          sx={{ mt: 1 }}
        >
          {formatMessage({ id: "parking_capacity_entry_add" })}
        </Button>
      </Box>

      {/* Recharging */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {formatMessage({ id: "parking_recharging_sub_header" })}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.25, mb: 0.5, fontStyle: "italic" }}
        >
          {formatMessage({ id: "parking_recharging_available_info" })}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={!!parking.rechargingAvailable}
              onChange={(e) => {
                dispatch(
                  StopPlaceActions.changeParkingRechargingAvailable(
                    parkingIndex,
                    e.target.checked,
                  ),
                );
                if (!e.target.checked) {
                  dispatch(
                    StopPlaceActions.clearParkingRechargePointCounts(
                      parkingIndex,
                    ),
                  );
                }
              }}
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
