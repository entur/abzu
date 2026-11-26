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

import { TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { ModalityAllowance } from "./modalityPermissions";
import { StopTypePresetSelect } from "./StopTypePresetSelect";

interface StopNameAndTypeFieldsProps {
  name: string;
  stopType: string;
  submode: string | null;
  onNameChange: (name: string) => void;
  /** Type and submode change together: one preset sets both (F-17). */
  onModalityChange: (stopType: string, submode: string | null) => void;
  autoFocus?: boolean;
  /** The user's type permissions; illegal types are shown disabled (F-18). */
  allowance?: ModalityAllowance | null;
}

/**
 * Required name and stop type for a stop that is about to be created: by the
 * new-stop wizard, or by moving quays to a new stop. Offers the same presets
 * as the editor, only types a stop may be saved with (F-15, F-17).
 */
export const StopNameAndTypeFields = ({
  name,
  stopType,
  submode,
  onNameChange,
  onModalityChange,
  autoFocus = false,
  allowance = null,
}: StopNameAndTypeFieldsProps) => {
  const { formatMessage } = useIntl();

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
      <StopTypePresetSelect
        value={{ stopPlaceType: stopType, submode }}
        onChange={onModalityChange}
        label={formatMessage({ id: "new_stop_wizard_type_label" })}
        allowance={allowance}
        required
      />
    </>
  );
};
