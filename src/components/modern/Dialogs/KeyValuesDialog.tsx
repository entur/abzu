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
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { StopPlaceActions } from "../../../actions";
import { useAppDispatch } from "../../../store/hooks";

interface KeyValue {
  key: string;
  values: string[];
}

interface KeyValuesDialogProps {
  open: boolean;
  keyValues: KeyValue[];
  disabled: boolean;
  handleClose: () => void;
}

type Mode = "list" | "create" | "edit";

/**
 * Dialog for managing key-value metadata pairs on a stop place.
 * Dispatches directly to Redux (same pattern as AltNamesDialog).
 */
export const KeyValuesDialog: React.FC<KeyValuesDialogProps> = ({
  open,
  keyValues,
  disabled,
  handleClose,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

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

    if (mode === "create") {
      dispatch(StopPlaceActions.createKeyValuesPair(key, values));
    } else if (mode === "edit") {
      dispatch(StopPlaceActions.updateKeyValuesForKey(editingKey, values));
    }
    resetForm();
  };

  const handleDelete = (key: string) => {
    dispatch(StopPlaceActions.deleteKeyValuesByKey(key));
  };

  const isFormValid = formKey.trim().length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "key_values_hint" })}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {mode === "list" && (
          <>
            {keyValues.length === 0 ? (
              <Typography sx={{ color: "text.secondary", py: 1 }}>
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
                              onClick={() => handleDelete(kv.key)}
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
          <Stack spacing={2} sx={{ pt: 1 }}>
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
          </Stack>
        )}
      </DialogContent>

      {(mode === "create" || mode === "edit") && (
        <DialogActions>
          <Button onClick={resetForm}>{formatMessage({ id: "cancel" })}</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            {formatMessage({ id: "save" })}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
