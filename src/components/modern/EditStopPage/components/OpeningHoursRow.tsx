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

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { DayTypeOption } from "../../../../config/ConfigContext";
import {
  AvailabilityConditionRow,
  endsBefore,
  availabilityConditionError,
} from "../../../../models/availabilityCondition";

const TIME_FORMAT = "HH:mm";

const toMoment = (time: string): Moment | null =>
  time ? moment(time, TIME_FORMAT) : null;

interface OpeningHoursRowProps {
  condition: AvailabilityConditionRow;
  dayTypes: DayTypeOption[];
  locale: string;
  disabled: boolean;
  isDuplicate: boolean;
  onChange: (changes: Partial<AvailabilityConditionRow>) => void;
  onDelete: () => void;
}

/** One availability condition: day type, open switch, from, until and delete. */
export const OpeningHoursRow: React.FC<OpeningHoursRowProps> = ({
  condition,
  dayTypes,
  locale,
  disabled,
  isDuplicate,
  onChange,
  onDelete,
}) => {
  const { formatMessage } = useIntl();
  const error = availabilityConditionError(condition);
  const listedDayType = dayTypes.find(
    (type) => type.ref === condition.dayTypeRef,
  );
  const hasKeptOffset = condition.keptDayOffset !== undefined;
  const timesDisabled = disabled || hasKeptOffset;
  const showNextDay =
    condition.nextDay || endsBefore(condition.startTime, condition.endTime);
  const dayTypeLabel = formatMessage({ id: "opening_hours_day_type" });

  const dayTypeLabelOf = (type: DayTypeOption) =>
    type.label[locale] ?? type.ref;

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
    <Box
      data-testid="opening-hours-row"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        border: 1,
        borderColor: error ? "error.main" : "divider",
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {dayTypes.length > 0 ? (
          <FormControl
            fullWidth
            size="small"
            disabled={disabled}
            error={error === "dayType"}
          >
            <InputLabel>{dayTypeLabel}</InputLabel>
            <Select
              value={condition.dayTypeRef}
              label={dayTypeLabel}
              onChange={(e) => onChange({ dayTypeRef: e.target.value })}
            >
              {!listedDayType && condition.dayTypeRef && (
                <MenuItem value={condition.dayTypeRef}>
                  {condition.dayTypeRef}
                </MenuItem>
              )}
              {dayTypes.map((type) => (
                <MenuItem key={type.ref} value={type.ref}>
                  {dayTypeLabelOf(type)}
                </MenuItem>
              ))}
            </Select>
            {error === "dayType" && (
              <FormHelperText>
                {formatMessage({ id: "opening_hours_error_day_type" })}
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          <TextField
            label={dayTypeLabel}
            value={condition.dayTypeRef}
            slotProps={{ input: { readOnly: true } }}
            size="small"
            fullWidth
          />
        )}
        <Tooltip title={formatMessage({ id: "opening_hours_delete" })}>
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={onDelete}
              aria-label={formatMessage({ id: "opening_hours_delete" })}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={condition.isAvailable}
            disabled={disabled}
            onChange={(e) => onChange({ isAvailable: e.target.checked })}
          />
        }
        label={formatMessage({ id: "opening_hours_open" })}
      />

      {condition.isAvailable && (
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
                    endTime: e.target.checked ? "00:00" : "",
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
      )}

      {error === "times" && (
        <FormHelperText error>
          {formatMessage({ id: "opening_hours_error_times" })}
        </FormHelperText>
      )}
      {isDuplicate && (
        <FormHelperText>
          {formatMessage({ id: "opening_hours_duplicate" })}
        </FormHelperText>
      )}
    </Box>
  );
};
