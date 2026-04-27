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
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import React from "react";
import { useIntl } from "react-intl";

interface DateTimeSelectionProps {
  date: Moment;
  time: Moment;
  comment: string;
  earliestFrom: Date;
  disabled: boolean;
  onDateChange: (newDate: Moment | null) => void;
  onTimeChange: (newTime: Moment | null) => void;
  onCommentChange: (comment: string) => void;
}

/**
 * Date, time, and comment selection for termination
 */
export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  date,
  time,
  comment,
  earliestFrom,
  disabled,
  onDateChange,
  onTimeChange,
  onCommentChange,
}) => {
  const { formatMessage, locale } = useIntl();

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <DatePicker
            label={formatMessage({ id: "date" })}
            disabled={disabled}
            minDate={moment(earliestFrom)}
            value={date}
            onChange={onDateChange}
            format={
              new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format as any
            }
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
          <TimePicker
            label={formatMessage({ id: "time" })}
            disabled={disabled}
            value={time}
            onChange={onTimeChange}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Box>
      </LocalizationProvider>

      <TextField
        value={comment}
        disabled={disabled}
        fullWidth
        label={formatMessage({ id: "comment" })}
        onChange={(e) => onCommentChange(e.target.value)}
        sx={{ mb: 2 }}
      />
    </>
  );
};
