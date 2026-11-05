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

import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import React from "react";
import { useIntl } from "react-intl";
import {
  AvailabilityConditionError,
  AvailabilityConditionRow,
  endsBefore,
  MIDNIGHT,
} from "../../../../models/availabilityCondition";

const TIME_FORMAT = "HH:mm";

const toMoment = (time: string): Moment | null =>
  time ? moment(time, TIME_FORMAT) : null;

interface OpeningHoursTimesProps {
  condition: AvailabilityConditionRow;
  timesDisabled: boolean;
  error: AvailabilityConditionError;
  onChange: (changes: Partial<AvailabilityConditionRow>) => void;
}

/** The from and until pickers, the end of day checkbox and the next day caption. */
export const OpeningHoursTimes: React.FC<OpeningHoursTimesProps> = ({
  condition,
  timesDisabled,
  error,
  onChange,
}) => {
  const { formatMessage } = useIntl();
  const showNextDay =
    condition.nextDay || endsBefore(condition.startTime, condition.endTime);

  const changeTime =
    (field: "startTime" | "endTime") => (value: Moment | null) => {
      if (value === null) {
        onChange({ [field]: "", nextDay: false });
        return;
      }
      if (!value.isValid()) return;
      onChange({ [field]: value.format(TIME_FORMAT), nextDay: false });
    };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TimePicker
          label={formatMessage({ id: "opening_hours_from" })}
          ampm={false}
          disabled={timesDisabled}
          value={toMoment(condition.startTime)}
          onChange={changeTime("startTime")}
          slotProps={{
            textField: { size: "small", error: error === "times" },
          }}
        />
        <TimePicker
          label={formatMessage({ id: "opening_hours_until" })}
          ampm={false}
          disabled={timesDisabled || condition.endOfDay}
          value={condition.endOfDay ? null : toMoment(condition.endTime)}
          onChange={changeTime("endTime")}
          slotProps={{
            textField: { size: "small", error: error === "times" },
          }}
        />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={condition.endOfDay}
            disabled={timesDisabled}
            onChange={(e) =>
              onChange({
                endOfDay: e.target.checked,
                nextDay: false,
                endTime: e.target.checked ? MIDNIGHT : "",
              })
            }
          />
        }
        label={formatMessage({ id: "opening_hours_end_of_day" })}
      />
      {showNextDay && !condition.endOfDay && (
        <Typography variant="caption" color="text.secondary">
          {formatMessage({ id: "opening_hours_next_day" })}
        </Typography>
      )}
    </LocalizationProvider>
  );
};
