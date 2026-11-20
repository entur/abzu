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
  FormControlLabel,
  FormHelperText,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { DayTypeOption } from "../../../../config/ConfigContext";
import {
  AvailabilityConditionRow,
  availabilityConditionError,
} from "../../../../models/availabilityCondition";
import { OpeningHoursDayType } from "./OpeningHoursDayType";
import { OpeningHoursTimes } from "./OpeningHoursTimes";

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
  const hasKeptOffset = condition.keptDayOffset !== undefined;
  const timesDisabled = disabled || hasKeptOffset;

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
        <OpeningHoursDayType
          condition={condition}
          dayTypes={dayTypes}
          locale={locale}
          disabled={disabled}
          error={error}
          onChange={onChange}
        />
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
        <OpeningHoursTimes
          condition={condition}
          timesDisabled={timesDisabled}
          error={error}
          onChange={onChange}
        />
      )}

      {condition.isAvailable && hasKeptOffset && (
        <Typography variant="caption" color="text.secondary">
          {formatMessage(
            { id: "opening_hours_kept_offset" },
            { days: condition.keptDayOffset },
          )}
        </Typography>
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
