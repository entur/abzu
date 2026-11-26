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

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import type { KeyValue } from "../hooks/useKeyValueForm";

interface KeyValueRowProps {
  keyValue: KeyValue;
  /** Read-only: no edit or delete. */
  disabled: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

/**
 * One key with its values. The edit and delete buttons have a column of
 * their own, so many values wrap under the key instead of under the buttons
 * (F-72). Delete is red like every other delete (F-73); it's staged until
 * the stop is saved.
 */
export const KeyValueRow = ({
  keyValue,
  disabled,
  onEdit,
  onRemove,
}: KeyValueRowProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "start",
        columnGap: 1,
        py: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {keyValue.key}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
          {keyValue.values.map((value, valueIndex) => (
            <Chip key={`${value}-${valueIndex}`} label={value} size="small" />
          ))}
        </Box>
      </Box>
      {!disabled && (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={onEdit}
            aria-label={formatMessage({ id: "edit" })}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={onRemove}
            aria-label={formatMessage({ id: "remove" })}
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};
