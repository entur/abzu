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

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import * as altNameConfig from "../../../../../config/altNamesConfig";
import { EditingState } from "../types";

export interface AltNameFormProps {
  state: EditingState;
  disabled?: boolean;
  onFieldChange: (field: keyof EditingState, value: string) => void;
  onAdd: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

/**
 * Form for adding/editing alternative names
 */
export const AltNameForm: React.FC<AltNameFormProps> = ({
  state,
  disabled,
  onFieldChange,
  onAdd,
  onEdit,
  onCancel,
}) => {
  const { formatMessage } = useIntl();

  const { isEditing, lang, value, type } = state;
  const isFormValid = !!lang && !!type && !!value;

  if (disabled) return null;

  return (
    <Box
      sx={{
        pt: 2,
        borderTop: "2px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {isEditing
          ? formatMessage({ id: "editing" })
          : formatMessage({ id: "alternative_names_add" })}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Name Type Select */}
        <FormControl fullWidth>
          <InputLabel>{formatMessage({ id: "name_type" })}</InputLabel>
          <Select
            value={type}
            label={formatMessage({ id: "name_type" })}
            onChange={(e) => onFieldChange("type", e.target.value)}
          >
            {altNameConfig.supportedNameTypes.map((nameType) => (
              <MenuItem key={nameType} value={nameType}>
                {formatMessage({
                  id: `altNamesDialog_nameTypes_${nameType}`,
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Name Value */}
        <TextField
          label={formatMessage({ id: "name" })}
          fullWidth
          value={value}
          onChange={(e) => onFieldChange("value", e.target.value)}
        />

        {/* Language Select */}
        <FormControl fullWidth>
          <InputLabel>{formatMessage({ id: "language" })}</InputLabel>
          <Select
            value={lang}
            label={formatMessage({ id: "language" })}
            onChange={(e) => onFieldChange("lang", e.target.value)}
          >
            {altNameConfig.languages.map((language) => (
              <MenuItem key={language} value={language}>
                {formatMessage({
                  id: `altNamesDialog_languages_${language}`,
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {isEditing && (
            <Button variant="outlined" onClick={onCancel}>
              {formatMessage({ id: "cancel" })}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={isEditing ? onEdit : onAdd}
            disabled={!isFormValid}
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
          >
            {isEditing
              ? formatMessage({ id: "update" })
              : formatMessage({ id: "add" })}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
