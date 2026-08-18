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
import { useIntl } from "react-intl";
import { GroupOfStopPlacesDetailsProps } from "../types";

/**
 * Details form component for group of stop places
 * Shows name and description fields
 */
export const GroupOfStopPlacesDetails: React.FC<
  GroupOfStopPlacesDetailsProps
> = ({ name, description, canEdit, onNameChange, onDescriptionChange }) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label={formatMessage({ id: "name" })}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={!canEdit}
        fullWidth
        required
        error={!name}
        helperText={!name ? formatMessage({ id: "name_is_required" }) : ""}
        variant="outlined"
        size="small"
      />
      <TextField
        label={formatMessage({ id: "description" })}
        value={description || ""}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={!canEdit}
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        size="small"
      />
    </Box>
  );
};
