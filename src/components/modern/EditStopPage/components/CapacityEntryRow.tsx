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
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
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
import { CapacityEntryTypeSelect } from "./CapacityEntryTypeSelect";

interface CapacityEntryRowProps {
  entry: CapacityEntry;
  parkingIndex: number;
  entryIndex: number;
  disabled: boolean;
  rechargingAvailable: boolean;
}

type EntryField = keyof CapacityEntry;

const countValue = (value: number | string | null): string =>
  value === null || value === undefined ? "" : String(value);

const hasCount = (value: number | string | null): boolean =>
  countValue(value) !== "";

/**
 * One capacity entry of a Park-and-Ride parking: vehicle type, user type,
 * number of spaces and number of spaces with a recharge point. The recharge
 * count shows only when recharging is available or the entry holds a count.
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

  const showRechargeCount =
    rechargingAvailable || hasCount(entry.numberOfSpacesWithRechargePoint);

  const removeButton = (
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
  );

  return (
    <Box
      data-testid="parking-capacity-entry"
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
        alignItems: "center",
        columnGap: 1,
        rowGap: 1.5,
        p: 1,
        pt: 1.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <CapacityEntryTypeSelect
        label={formatMessage({ id: "parking_vehicle_type" })}
        value={entry.parkingVehicleType}
        options={parkingVehicleTypes}
        optionLabel={parkingVehicleTypeLabel}
        disabled={disabled}
        onChange={(value) => change("parkingVehicleType", value)}
      />
      <CapacityEntryTypeSelect
        label={formatMessage({ id: "parking_user_type" })}
        value={entry.parkingUserType}
        options={parkingUserTypes}
        optionLabel={parkingUserTypeLabel}
        disabled={disabled}
        onChange={(value) => change("parkingUserType", value)}
      />
      <Box />
      <TextField
        size="small"
        type="number"
        label={formatMessage({ id: "parking_capacity_entry_spaces" })}
        disabled={disabled}
        value={countValue(entry.numberOfSpaces)}
        onChange={(e) => changeCount("numberOfSpaces", e.target.value)}
        slotProps={{ htmlInput: { min: 0 }, inputLabel: { shrink: true } }}
      />
      {showRechargeCount ? (
        <TextField
          size="small"
          type="number"
          label={formatMessage({
            id: "parking_capacity_entry_spaces_with_recharge_point",
          })}
          disabled={disabled || !rechargingAvailable}
          value={countValue(entry.numberOfSpacesWithRechargePoint)}
          onChange={(e) =>
            changeCount("numberOfSpacesWithRechargePoint", e.target.value)
          }
          slotProps={{ htmlInput: { min: 0 }, inputLabel: { shrink: true } }}
        />
      ) : (
        <Box />
      )}
      {removeButton}
    </Box>
  );
};
