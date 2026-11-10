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

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import {
  cycleStorageTypeLabel,
  cycleStorageTypes,
} from "../../../../models/cycleStorageType";
import { useAppDispatch } from "../../../../store/hooks";
import { Parking } from "../types";
import { CapacityEntryTypeSelect } from "./CapacityEntryTypeSelect";

interface CycleStorageFieldsProps {
  parking: Parking;
  parkingIndex: number;
  disabled: boolean;
}

const countValue = (value: number | string | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

/**
 * The cycle storage entries of a parking, one row for each entry. A row holds
 * a type and an optional number of spaces. Shown for every parking variant.
 */
export const CycleStorageFields: React.FC<CycleStorageFieldsProps> = ({
  parking,
  parkingIndex,
  disabled,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const entries = parking.placeEquipments?.cycleStorageEquipment ?? [];

  const change = (entryIndex: number, field: string, value: string | null) =>
    dispatch(
      StopPlaceActions.changeParkingCycleStorage(
        parkingIndex,
        entryIndex,
        field,
        value,
      ),
    );

  const removeLabel = formatMessage({ id: "parking_cycle_storage_remove" });

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {formatMessage({ id: "parking_cycle_storage" })}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
        {entries.map((entry, entryIndex) => (
          <Box
            key={entryIndex}
            data-testid="parking-cycle-storage-entry"
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: 1,
              p: 1,
              pt: 1.5,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <CapacityEntryTypeSelect
              label={formatMessage({ id: "parking_cycle_storage_type" })}
              value={entry.cycleStorageType ?? null}
              options={cycleStorageTypes}
              optionLabel={cycleStorageTypeLabel}
              disabled={disabled}
              offerStoredValue={false}
              onChange={(value) =>
                change(entryIndex, "cycleStorageType", value)
              }
            />
            <TextField
              size="small"
              type="number"
              label={formatMessage({ id: "parking_cycle_storage_spaces" })}
              disabled={disabled}
              value={countValue(entry.numberOfSpaces)}
              onChange={(event) =>
                change(
                  entryIndex,
                  "numberOfSpaces",
                  event.target.value !== "" && Number(event.target.value) < 0
                    ? "0"
                    : event.target.value,
                )
              }
              slotProps={{
                htmlInput: { min: 0 },
                inputLabel: { shrink: true },
              }}
            />
            <Tooltip title={removeLabel}>
              <span>
                <IconButton
                  aria-label={removeLabel}
                  disabled={disabled}
                  onClick={() =>
                    dispatch(
                      StopPlaceActions.removeParkingCycleStorage(
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
        ))}
      </Box>
      <Button
        startIcon={<AddCircleIcon />}
        disabled={disabled}
        onClick={() =>
          dispatch(StopPlaceActions.addParkingCycleStorage(parkingIndex))
        }
        size="small"
        sx={{ mt: 1 }}
      >
        {formatMessage({ id: "parking_cycle_storage_add" })}
      </Button>
    </Box>
  );
};
