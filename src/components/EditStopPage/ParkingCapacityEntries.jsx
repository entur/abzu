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

import AddCircle from "@mui/icons-material/AddCircle";
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import {
  parkingUserTypeLabel,
  parkingUserTypes,
} from "../../models/parkingUserType";
import {
  parkingVehicleTypeLabel,
  parkingVehicleTypes,
} from "../../models/parkingVehicleType";
import { injectIntl } from "../../utils/injectIntl";

// A stored value this editor does not name stays selectable, so the field
// shows it instead of an empty selection.
const optionsWith = (options, value) =>
  value && !options.includes(value) ? options.concat(value) : options;

const countValue = (value) =>
  value === null || value === undefined ? "" : value;

const ParkingCapacityEntries = ({
  intl: { formatMessage },
  capacityEntries,
  disabled,
  rechargingAvailable,
  handleChangeEntry,
  handleAddEntry,
  handleRemoveEntry,
}) => (
  <Box sx={{ paddingLeft: "16px", paddingRight: "16px" }}>
    {capacityEntries.map((entry, entryIndex) => (
      <Box
        key={entryIndex}
        data-testid="parking-capacity-entry"
        sx={{ display: "flex", gap: 1, alignItems: "flex-end", mb: 1 }}
      >
        <TextField
          select
          variant="standard"
          label={formatMessage({ id: "parking_vehicle_type" })}
          disabled={disabled}
          value={entry.parkingVehicleType ?? ""}
          onChange={(event) =>
            handleChangeEntry(
              entryIndex,
              "parkingVehicleType",
              event.target.value || null,
            )
          }
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) =>
                selected ? (
                  parkingVehicleTypeLabel(selected, formatMessage)
                ) : (
                  <em>{formatMessage({ id: "not_assigned" })}</em>
                ),
            },
            inputLabel: { shrink: true },
          }}
          sx={{ flex: 2 }}
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
          variant="standard"
          label={formatMessage({ id: "parking_user_type" })}
          disabled={disabled}
          value={entry.parkingUserType ?? ""}
          onChange={(event) =>
            handleChangeEntry(
              entryIndex,
              "parkingUserType",
              event.target.value || null,
            )
          }
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) =>
                selected ? (
                  parkingUserTypeLabel(selected, formatMessage)
                ) : (
                  <em>{formatMessage({ id: "not_assigned" })}</em>
                ),
            },
            inputLabel: { shrink: true },
          }}
          sx={{ flex: 2 }}
        >
          {optionsWith(parkingUserTypes, entry.parkingUserType).map((type) => (
            <MenuItem key={type} value={type}>
              {parkingUserTypeLabel(type, formatMessage)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="standard"
          type="number"
          label={formatMessage({ id: "parking_number_of_spaces" })}
          disabled={disabled}
          value={countValue(entry.numberOfSpaces)}
          onChange={(event) =>
            handleChangeEntry(entryIndex, "numberOfSpaces", event.target.value)
          }
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{ flex: 1 }}
        />
        <TextField
          variant="standard"
          type="number"
          label={formatMessage({
            id: "parking_number_of_spaces_with_recharge_point",
          })}
          disabled={disabled || !rechargingAvailable}
          value={countValue(entry.numberOfSpacesWithRechargePoint)}
          onChange={(event) =>
            handleChangeEntry(
              entryIndex,
              "numberOfSpacesWithRechargePoint",
              event.target.value,
            )
          }
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{ flex: 1 }}
        />
        <IconButton
          aria-label={formatMessage({ id: "parking_capacity_entry_remove" })}
          disabled={disabled}
          onClick={() => handleRemoveEntry(entryIndex)}
          size="small"
        >
          <RemoveCircle />
        </IconButton>
      </Box>
    ))}
    <Button
      startIcon={<AddCircle />}
      disabled={disabled}
      onClick={handleAddEntry}
      size="small"
    >
      {formatMessage({ id: "parking_capacity_entry_add" })}
    </Button>
  </Box>
);

export default injectIntl(ParkingCapacityEntries);
