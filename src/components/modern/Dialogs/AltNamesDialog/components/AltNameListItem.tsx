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

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import * as altNameConfig from "../../../../../config/altNamesConfig";
import { AlternativeName } from "../types";

export interface AltNameListItemProps {
  altName: AlternativeName;
  index: number;
  disabled?: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

/**
 * Individual alternative name list item with edit/delete actions
 */
export const AltNameListItem: React.FC<AltNameListItemProps> = ({
  altName,
  index,
  disabled,
  onEdit,
  onRemove,
}) => {
  const { formatMessage } = useIntl();

  const getNameTypeByLocale = (nameType: string) => {
    if (altNameConfig.allNameTypes.includes(nameType)) {
      return formatMessage({
        id: `altNamesDialog_nameTypes_${nameType}`,
      });
    }
    return formatMessage({ id: "not_assigned" });
  };

  const getLangByLocale = (lang: string) => {
    if (altNameConfig.languages.includes(lang)) {
      return formatMessage({
        id: `altNamesDialog_languages_${lang}`,
      });
    }
    return formatMessage({ id: "not_assigned" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" sx={{ flex: 1, minWidth: 120 }}>
        {getNameTypeByLocale(altName.nameType)}
      </Typography>
      <Typography variant="body2" sx={{ flex: 2, px: 1 }}>
        {altName.name.value}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1, color: "text.secondary" }}>
        {getLangByLocale(altName.name.lang)}
      </Typography>
      {!disabled && (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => onEdit(index)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onRemove(index)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
