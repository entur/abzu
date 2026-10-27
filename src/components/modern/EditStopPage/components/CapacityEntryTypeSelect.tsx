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

import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

type FormatMessage = ReturnType<typeof useIntl>["formatMessage"];

interface CapacityEntryTypeSelectProps {
  label: string;
  value: string | null;
  options: string[];
  optionLabel: (value: string, formatMessage: FormatMessage) => string;
  disabled: boolean;
  offerStoredValue?: boolean;
  onChange: (value: string | null) => void;
}

const isStoredOutsideMenu = (options: string[], value: string | null) =>
  Boolean(value) && !options.includes(value as string);

/**
 * A select for one type of a capacity entry. An entry with no value shows
 * "not assigned". A stored value that is not in the menu stays selectable,
 * unless offerStoredValue is false. Then the field shows its label and the
 * menu does not offer it.
 */
export const CapacityEntryTypeSelect: React.FC<
  CapacityEntryTypeSelectProps
> = ({
  label,
  value,
  options,
  optionLabel,
  disabled,
  offerStoredValue = true,
  onChange,
}) => {
  const { formatMessage } = useIntl();
  const hideStoredValue =
    !offerStoredValue && isStoredOutsideMenu(options, value);
  const notAssigned = <em>{formatMessage({ id: "not_assigned" })}</em>;

  return (
    <TextField
      select
      size="small"
      label={label}
      disabled={disabled}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      slotProps={{
        select: {
          displayEmpty: true,
          // A hidden selected item cannot take focus, so the menu would
          // ignore the keyboard. Focus the first item instead.
          MenuProps: hideStoredValue ? { variant: "menu" } : undefined,
          renderValue: (selected) =>
            selected
              ? optionLabel(selected as string, formatMessage)
              : notAssigned,
        },
        inputLabel: { shrink: true },
      }}
      sx={{ flex: 1, minWidth: 0 }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {optionLabel(option, formatMessage)}
        </MenuItem>
      ))}
      {isStoredOutsideMenu(options, value) && (
        <MenuItem
          key={value as string}
          value={value as string}
          sx={offerStoredValue ? undefined : { display: "none" }}
        >
          {optionLabel(value as string, formatMessage)}
        </MenuItem>
      )}
    </TextField>
  );
};
