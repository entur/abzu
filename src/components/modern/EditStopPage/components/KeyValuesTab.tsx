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
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions, UserActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";

interface KeyValue {
  key: string;
  values: string[];
}

/** Which element the key-value CRUD actions target. */
export interface KeyValuesOrigin {
  type: "stopPlace" | "quay";
  index: number;
}

interface KeyValuesTabProps {
  keyValues: KeyValue[];
  disabled: boolean;
  /** Targets the stop place or a specific quay for all edits. */
  origin: KeyValuesOrigin;
}

type Mode = "list" | "create" | "edit";

/**
 * Inline tab for managing key-value metadata pairs on a stop place.
 * Dispatches directly to Redux (same actions as the former KeyValuesDialog).
 */
export const KeyValuesTab: React.FC<KeyValuesTabProps> = ({
  keyValues,
  disabled,
  origin,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  // The key-value CRUD thunks read the target element from
  // state.user.keyValuesOrigin, so point it at this tab's element before each
  // mutation (stop place vs a specific quay).
  const applyOrigin = () => {
    dispatch(UserActions.setKeyValuesOrigin(origin.type, origin.index));
  };

  const [mode, setMode] = useState<Mode>("list");
  const [editingKey, setEditingKey] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formValues, setFormValues] = useState("");

  const resetForm = () => {
    setMode("list");
    setEditingKey("");
    setFormKey("");
    setFormValues("");
  };

  const handleStartCreate = () => {
    setMode("create");
    setFormKey("");
    setFormValues("");
  };

  const handleStartEdit = (kv: KeyValue) => {
    setMode("edit");
    setEditingKey(kv.key);
    setFormKey(kv.key);
    setFormValues(kv.values.join(", "));
  };

  const handleSave = () => {
    const key = formKey.trim();
    if (!key) return;
    const values = formValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    applyOrigin();
    if (mode === "create") {
      dispatch(StopPlaceActions.createKeyValuesPair(key, values));
    } else if (mode === "edit") {
      dispatch(StopPlaceActions.updateKeyValuesForKey(editingKey, values));
    }
    resetForm();
  };

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
              {keyValues.map((kv) => (
                <React.Fragment key={kv.key}>
                  <ListItem
                    secondaryAction={
                      !disabled && (
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleStartEdit(kv)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                              applyOrigin();
                              dispatch(
                                StopPlaceActions.deleteKeyValuesByKey(kv.key),
                              );
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      )
                    }
                  >
                    <ListItemText
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
                          {kv.values.map((val) => (
                            <Chip key={val} label={val} size="small" />
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
              onClick={handleStartCreate}
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
            onChange={(e) => setFormKey(e.target.value)}
            disabled={mode === "edit"}
            size="small"
            fullWidth
            required
          />
          <TextField
            label={formatMessage({ id: "values" })}
            value={formValues}
            onChange={(e) => setFormValues(e.target.value)}
            size="small"
            fullWidth
            helperText={formatMessage({ id: "key_values_hint" })}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={resetForm}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={!formKey.trim()}
            >
              {formatMessage({ id: "save" })}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
