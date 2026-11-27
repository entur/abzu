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
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useId } from "react";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { useHiddenStopTypes } from "./hooks/useHiddenStopTypes";
import {
  parseModalityPickerValue,
  toModalityPickerValue,
} from "./modalityPickerValue";
import { isModalityAllowed, ModalityAllowance } from "./modalityPermissions";
import {
  groupStopTypePresets,
  presetLabelId,
  StopTypePreset,
} from "./stopTypePresets";

const OPTION_ICON_SIZE = 20;
const optionIconStyle = { width: OPTION_ICON_SIZE, height: OPTION_ICON_SIZE };

interface StopTypePresetSelectProps {
  /** The current type and submode; an empty type means none chosen yet. */
  value: StopTypePreset;
  onChange: (stopPlaceType: string, submode: string | null) => void;
  label: React.ReactNode;
  /** Presets outside the user's permissions are shown disabled (F-18). */
  allowance?: ModalityAllowance | null;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

/**
 * The one stop type picker (F-17): curated presets that set type and submode
 * together, grouped by transport mode with icons, the same when creating a
 * stop, moving quays to a new stop and editing.
 */
export const StopTypePresetSelect = ({
  value,
  onChange,
  label,
  allowance = null,
  disabled = false,
  required = false,
  error = false,
  helperText,
}: StopTypePresetSelectProps) => {
  const { formatMessage } = useIntl();
  const labelId = useId();
  const groups = groupStopTypePresets(useHiddenStopTypes(), value);
  const selected = value.stopPlaceType
    ? toModalityPickerValue(value.stopPlaceType, value.submode)
    : "";

  const options = groups.flatMap(({ transportMode, presets }) => [
    <ListSubheader key={`group-${transportMode}`}>
      {formatMessage({ id: `transport_mode_${transportMode}` })}
    </ListSubheader>,
    ...presets.map((preset) => {
      const optionValue = toModalityPickerValue(
        preset.stopPlaceType,
        preset.submode,
      );
      const isAllowed = isModalityAllowed(
        allowance,
        preset.stopPlaceType,
        preset.submode,
      );
      return (
        <MenuItem
          key={optionValue}
          value={optionValue}
          disabled={!isAllowed && optionValue !== selected}
          sx={{ gap: 1.5 }}
        >
          <ModalityIconImg
            type={preset.stopPlaceType}
            submode={preset.submode}
            svgStyle={optionIconStyle}
          />
          {formatMessage({ id: presetLabelId(preset) })}
        </MenuItem>
      );
    }),
  ]);

  return (
    <FormControl
      size="small"
      fullWidth
      required={required}
      disabled={disabled}
      error={error}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={selected}
        label={label}
        onChange={(event) => {
          const { stopPlaceType, submode } = parseModalityPickerValue(
            event.target.value,
          );
          onChange(stopPlaceType, submode);
        }}
        renderValue={(current) =>
          current ? (
            <Box component="span">
              {formatMessage({
                id: presetLabelId(parseModalityPickerValue(current)),
              })}
            </Box>
          ) : null
        }
      >
        {options}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
