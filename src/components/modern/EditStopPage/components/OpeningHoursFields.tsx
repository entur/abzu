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

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import {
  AvailabilityConditionRow,
  availabilityConditionToInput,
} from "../../../../models/availabilityCondition";
import { useAppDispatch } from "../../../../store/hooks";
import { Parking } from "../types";
import { OpeningHoursRow } from "./OpeningHoursRow";

interface OpeningHoursFieldsProps {
  parking: Parking;
  parkingIndex: number;
  fieldDisabled: boolean;
}

const inputKey = (condition: AvailabilityConditionRow): string =>
  JSON.stringify(availabilityConditionToInput(condition));

/**
 * Opening hours of a parking: one row per availability condition.
 *
 * The list is optional. Absent data means the hours are unknown, so an empty
 * list says so instead of claiming the parking is closed or always open.
 */
export const OpeningHoursFields: React.FC<OpeningHoursFieldsProps> = ({
  parking,
  parkingIndex,
  fieldDisabled,
}) => {
  const { formatMessage, locale } = useIntl();
  const dispatch = useAppDispatch();
  const dayTypes = useConfig().parkingConfig?.dayTypes ?? [];
  const conditions = parking.availabilityConditions ?? [];
  const keyCounts = conditions.reduce<Record<string, number>>((counts, row) => {
    const key = inputKey(row);
    return { ...counts, [key]: (counts[key] ?? 0) + 1 };
  }, {});

  return (
    <Box
      data-testid="opening-hours"
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Typography variant="subtitle2">
        {formatMessage({ id: "parking_opening_hours" })}
      </Typography>

      {conditions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {formatMessage({ id: "opening_hours_none" })}
        </Typography>
      )}

      {conditions.map((condition, conditionIndex) => (
        <OpeningHoursRow
          // Rows have no identity, so the position is the only stable key.
          // eslint-disable-next-line react/no-array-index-key
          key={conditionIndex}
          condition={condition}
          dayTypes={dayTypes}
          locale={locale}
          disabled={fieldDisabled}
          isDuplicate={keyCounts[inputKey(condition)] > 1}
          onChange={(changes) =>
            dispatch(
              StopPlaceActions.changeParkingAvailabilityCondition(
                parkingIndex,
                conditionIndex,
                changes,
              ),
            )
          }
          onDelete={() =>
            dispatch(
              StopPlaceActions.removeParkingAvailabilityCondition(
                parkingIndex,
                conditionIndex,
              ),
            )
          }
        />
      ))}

      <Button
        size="small"
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={fieldDisabled || dayTypes.length === 0}
        onClick={() =>
          dispatch(
            StopPlaceActions.addParkingAvailabilityCondition(parkingIndex),
          )
        }
        sx={{ alignSelf: "flex-start" }}
      >
        {formatMessage({ id: "opening_hours_add" })}
      </Button>
    </Box>
  );
};
