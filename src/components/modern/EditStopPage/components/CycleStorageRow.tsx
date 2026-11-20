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

import { Box, TextField } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import {
  cycleStorageTypeLabel,
  cycleStorageTypes,
} from "../../../../models/cycleStorageType";
import { useAppDispatch } from "../../../../store/hooks";
import { CycleStorageEntry } from "../types";
import { CapacityEntryTypeSelect } from "./CapacityEntryTypeSelect";
import {
  clampNegativeCount,
  countValue,
  entryRowSx,
  RemoveEntryButton,
} from "./parkingRowControls";

interface CycleStorageRowProps {
  entry: CycleStorageEntry;
  parkingIndex: number;
  entryIndex: number;
  disabled: boolean;
}

/** One cycle storage entry of a parking: a type and a number of spaces. */
export const CycleStorageRow: React.FC<CycleStorageRowProps> = ({
  entry,
  parkingIndex,
  entryIndex,
  disabled,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const change = (field: keyof CycleStorageEntry, value: string | null) =>
    dispatch(
      StopPlaceActions.changeParkingCycleStorage(
        parkingIndex,
        entryIndex,
        field,
        value,
      ),
    );

  return (
    <Box data-testid="parking-cycle-storage-entry" sx={entryRowSx}>
      <CapacityEntryTypeSelect
        label={formatMessage({ id: "parking_cycle_storage_type" })}
        value={entry.cycleStorageType ?? null}
        options={cycleStorageTypes}
        optionLabel={cycleStorageTypeLabel}
        disabled={disabled}
        offerStoredValue={false}
        onChange={(value) => change("cycleStorageType", value)}
      />
      <TextField
        size="small"
        type="number"
        label={formatMessage({ id: "parking_cycle_storage_spaces" })}
        disabled={disabled}
        value={countValue(entry.numberOfSpaces)}
        onChange={(event) =>
          change("numberOfSpaces", clampNegativeCount(event.target.value))
        }
        slotProps={{
          htmlInput: { min: 0 },
          inputLabel: { shrink: true },
        }}
      />
      <RemoveEntryButton
        label={formatMessage({ id: "parking_cycle_storage_remove" })}
        disabled={disabled}
        onRemove={() =>
          dispatch(
            StopPlaceActions.removeParkingCycleStorage(
              parkingIndex,
              entryIndex,
            ),
          )
        }
      />
    </Box>
  );
};
