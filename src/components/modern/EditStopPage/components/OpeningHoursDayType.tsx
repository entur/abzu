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

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { DayTypeOption } from "../../../../config/ConfigContext";
import {
  AvailabilityConditionError,
  AvailabilityConditionRow,
} from "../../../../models/availabilityCondition";

interface OpeningHoursDayTypeProps {
  condition: AvailabilityConditionRow;
  dayTypes: DayTypeOption[];
  locale: string;
  disabled: boolean;
  error: AvailabilityConditionError;
  onChange: (changes: Partial<AvailabilityConditionRow>) => void;
}

/** The day type of one condition: a list when day types are configured, else read-only text. */
export const OpeningHoursDayType: React.FC<OpeningHoursDayTypeProps> = ({
  condition,
  dayTypes,
  locale,
  disabled,
  error,
  onChange,
}) => {
  const { formatMessage } = useIntl();
  const dayTypeLabel = formatMessage({ id: "opening_hours_day_type" });
  const listedDayType = dayTypes.find(
    (type) => type.ref === condition.dayTypeRef,
  );

  const dayTypeLabelOf = (type: DayTypeOption) =>
    type.label[locale] ?? type.ref;

  if (dayTypes.length === 0) {
    return (
      <TextField
        label={dayTypeLabel}
        value={condition.dayTypeRef}
        slotProps={{ input: { readOnly: true } }}
        size="small"
        fullWidth
      />
    );
  }

  return (
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
  );
};
