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
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useHiddenStopTypes } from "./hooks/useHiddenStopTypes";
import { getAllowedStopTypes } from "./stopPlaceTypeRules";

interface StopNameAndTypeFieldsProps {
  name: string;
  stopType: string;
  onNameChange: (name: string) => void;
  onStopTypeChange: (stopType: string) => void;
  autoFocus?: boolean;
}

/**
 * Required name and stop type for a stop that is about to be created: by the
 * new-stop wizard, or by moving quays to a new stop. Lists only the types a
 * stop may be saved with (F-15).
 */
export const StopNameAndTypeFields = ({
  name,
  stopType,
  onNameChange,
  onStopTypeChange,
  autoFocus = false,
}: StopNameAndTypeFieldsProps) => {
  const { formatMessage } = useIntl();
  const allowedStopTypes = getAllowedStopTypes(useHiddenStopTypes());
  const typeLabel = formatMessage({ id: "new_stop_wizard_type_label" });

  return (
    <>
      <TextField
        label={formatMessage({ id: "new_stop_wizard_name_label" })}
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
        fullWidth
        size="small"
        required
      />
      <FormControl size="small" fullWidth required>
        <InputLabel>{typeLabel}</InputLabel>
        <Select
          value={stopType}
          label={typeLabel}
          onChange={(event) => onStopTypeChange(event.target.value)}
        >
          {allowedStopTypes.map((key) => (
            <MenuItem key={key} value={key}>
              {formatMessage({ id: `stopTypes_${key}_name` })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
