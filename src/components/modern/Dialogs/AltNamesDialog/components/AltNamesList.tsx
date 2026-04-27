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

import { Box, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { AlternativeName } from "../types";
import { AltNameListItem } from "./AltNameListItem";

export interface AltNamesListProps {
  altNames: AlternativeName[];
  disabled?: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

/**
 * List of all alternative names
 */
export const AltNamesList: React.FC<AltNamesListProps> = ({
  altNames,
  disabled,
  onEdit,
  onRemove,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ mb: 3, maxHeight: 300, overflowY: "auto" }}>
      {altNames.map((altName, index) => (
        <AltNameListItem
          key={`altName-${index}`}
          altName={altName}
          index={index}
          disabled={disabled}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
      {altNames.length === 0 && (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
        >
          {formatMessage({ id: "alternative_names_no" })}
        </Typography>
      )}
    </Box>
  );
};
