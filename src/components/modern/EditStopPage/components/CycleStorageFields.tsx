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
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import { Parking } from "../types";
import { CycleStorageRow } from "./CycleStorageRow";

interface CycleStorageFieldsProps {
  parking: Parking;
  parkingIndex: number;
  disabled: boolean;
}

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

  return (
    <Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {formatMessage({ id: "parking_cycle_storage" })}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
        {entries.map((entry, entryIndex) => (
          <CycleStorageRow
            key={entryIndex}
            entry={entry}
            parkingIndex={parkingIndex}
            entryIndex={entryIndex}
            disabled={disabled}
          />
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
