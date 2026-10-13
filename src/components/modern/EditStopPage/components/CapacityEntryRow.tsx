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

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import {
  parkingUserTypeLabel,
  parkingUserTypes,
} from "../../../../models/parkingUserType";
import {
  parkingVehicleTypeLabel,
  parkingVehicleTypes,
} from "../../../../models/parkingVehicleType";
import { useAppDispatch } from "../../../../store/hooks";
import { CapacityEntry } from "../types";

interface CapacityEntryRowProps {
  entry: CapacityEntry;
  parkingIndex: number;
  entryIndex: number;
  disabled: boolean;
  rechargingAvailable: boolean;
}

type EntryField = keyof CapacityEntry;

// A stored value this editor does not name stays selectable, so the field
// shows it instead of an empty selection.
const optionsWith = (options: string[], value: string | null): string[] =>
  value && !options.includes(value) ? options.concat(value) : options;

const countValue = (value: number | string | null): string =>
  value === null || value === undefined ? "" : String(value);

/**
 * One capacity entry of a Park-and-Ride parking: vehicle type, user type,
 * number of spaces and number of spaces with a recharge point.
 */
export const CapacityEntryRow: React.FC<CapacityEntryRowProps> = ({
  entry,
  parkingIndex,
  entryIndex,
  disabled,
  rechargingAvailable,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const notAssigned = <em>{formatMessage({ id: "not_assigned" })}</em>;

  const change = (field: EntryField, value: string | null) =>
    dispatch(
      StopPlaceActions.changeParkingCapacityEntry(
        parkingIndex,
        entryIndex,
        field,
        value,
      ),
    );

  const changeCount = (field: EntryField, value: string) =>
    change(field, value !== "" && Number(value) < 0 ? "0" : value);

  return (
    <Box
      data-testid="parking-capacity-entry"
      sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
    >
      <TextField
        select
        size="small"
        label={formatMessage({ id: "parking_vehicle_type" })}
        disabled={disabled}
        value={entry.parkingVehicleType ?? ""}
        onChange={(e) => change("parkingVehicleType", e.target.value || null)}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (selected) =>
              selected
                ? parkingVehicleTypeLabel(selected as string, formatMessage)
                : notAssigned,
          },
          inputLabel: { shrink: true },
        }}
        sx={{ flex: "1 1 45%" }}
      >
        {optionsWith(parkingVehicleTypes, entry.parkingVehicleType).map(
          (type) => (
            <MenuItem key={type} value={type}>
              {parkingVehicleTypeLabel(type, formatMessage)}
            </MenuItem>
          ),
        )}
      </TextField>
      <TextField
        select
        size="small"
        label={formatMessage({ id: "parking_user_type" })}
        disabled={disabled}
        value={entry.parkingUserType ?? ""}
        onChange={(e) => change("parkingUserType", e.target.value || null)}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (selected) =>
              selected
                ? parkingUserTypeLabel(selected as string, formatMessage)
                : notAssigned,
          },
          inputLabel: { shrink: true },
        }}
        sx={{ flex: "1 1 45%" }}
      >
        {optionsWith(parkingUserTypes, entry.parkingUserType).map((type) => (
          <MenuItem key={type} value={type}>
            {parkingUserTypeLabel(type, formatMessage)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        type="number"
        label={formatMessage({ id: "parking_number_of_spaces" })}
        disabled={disabled}
        value={countValue(entry.numberOfSpaces)}
        onChange={(e) => changeCount("numberOfSpaces", e.target.value)}
        slotProps={{ htmlInput: { min: 0 } }}
        sx={{ flex: "1 1 35%" }}
      />
      <TextField
        size="small"
        type="number"
        label={formatMessage({
          id: "parking_number_of_spaces_with_recharge_point",
        })}
        disabled={disabled || !rechargingAvailable}
        value={countValue(entry.numberOfSpacesWithRechargePoint)}
        onChange={(e) =>
          changeCount("numberOfSpacesWithRechargePoint", e.target.value)
        }
        slotProps={{ htmlInput: { min: 0 } }}
        sx={{ flex: "1 1 35%" }}
      />
      <Tooltip title={formatMessage({ id: "parking_capacity_entry_remove" })}>
        <span>
          <IconButton
            aria-label={formatMessage({ id: "parking_capacity_entry_remove" })}
            disabled={disabled}
            onClick={() =>
              dispatch(
                StopPlaceActions.removeParkingCapacityEntry(
                  parkingIndex,
                  entryIndex,
                ),
              )
            }
            size="small"
          >
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
