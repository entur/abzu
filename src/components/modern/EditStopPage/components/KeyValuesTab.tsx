/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import {
  KeyValue,
  KeyValuesOrigin,
  useKeyValueForm,
} from "../hooks/useKeyValueForm";

export type { KeyValuesOrigin } from "../hooks/useKeyValueForm";

interface KeyValuesTabProps {
  keyValues: KeyValue[];
  disabled: boolean;
  /** Targets the stop place or a specific quay for all edits. */
  origin: KeyValuesOrigin;
}

/**
 * Inline tab for managing key-value metadata pairs on a stop place or quay.
 * Validation and Redux dispatch live in useKeyValueForm.
 */
export const KeyValuesTab: React.FC<KeyValuesTabProps> = ({
  keyValues,
  disabled,
  origin,
}) => {
  const { formatMessage } = useIntl();
  const form = useKeyValueForm(keyValues, origin);
  const {
    mode,
    formKey,
    formValues,
    isDuplicateKey,
    hasRepeatedValues,
    canSave,
  } = form;

  const keyHelperText = isDuplicateKey
    ? `${formatMessage({ id: "key_already_exists" })}: ${formKey.trim()}`
    : undefined;
  const valuesHelperText = formatMessage({
    id: hasRepeatedValues ? "duplicate_values_removed" : "key_values_hint",
  });

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {mode === "list" && (
        <>
          {keyValues.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              {formatMessage({ id: "key_values_no" })}
            </Typography>
          ) : (
            <List dense disablePadding>
              {keyValues.map((kv, index) => (
                <React.Fragment key={`${kv.key}-${index}`}>
                  <ListItem
                    secondaryAction={
                      !disabled && (
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => form.startEdit(kv)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => form.remove(kv.key)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      )
                    }
                  >
                    <ListItemText
                      // The values are chips in a Box; render the slot as a
                      // div so they aren't nested in a <p>.
                      slotProps={{ secondary: { component: "div" } }}
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {kv.key}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          {kv.values.map((val, valueIndex) => (
                            <Chip
                              key={`${val}-${valueIndex}`}
                              label={val}
                              size="small"
                            />
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
          {!disabled && (
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={form.startCreate}
              sx={{ mt: 2 }}
            >
              {formatMessage({ id: "add" })}
            </Button>
          )}
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <Stack spacing={2}>
          <TextField
            label={formatMessage({ id: "key" })}
            value={formKey}
            onChange={(e) => form.setFormKey(e.target.value)}
            disabled={mode === "edit"}
            error={isDuplicateKey}
            helperText={keyHelperText}
            size="small"
            fullWidth
            required
          />
          <TextField
            label={formatMessage({ id: "values" })}
            value={formValues}
            onChange={(e) => form.setFormValues(e.target.value)}
            size="small"
            fullWidth
            helperText={valuesHelperText}
            slotProps={{
              formHelperText: {
                sx: hasRepeatedValues ? { color: "warning.main" } : undefined,
              },
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button size="small" onClick={form.cancel}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={form.save}
              disabled={!canSave}
            >
              {formatMessage({ id: "save" })}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
