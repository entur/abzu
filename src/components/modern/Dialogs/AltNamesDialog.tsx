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
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { StopPlaceActions } from "../../../actions";
import * as altNameConfig from "../../../config/altNamesConfig";
import { ConfirmDialog } from "./ConfirmDialog";

interface AlternativeName {
  name: {
    value: string;
    lang: string;
  };
  nameType: string;
}

export interface AltNamesDialogProps {
  open: boolean;
  handleClose: () => void;
  altNames: AlternativeName[];
  disabled?: boolean;
}

interface EditingState {
  isEditing: boolean;
  editingId: number | null;
  lang: string;
  value: string;
  type: string;
}

export const AltNamesDialog: React.FC<AltNamesDialogProps> = ({
  open,
  handleClose,
  altNames = [],
  disabled,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [state, setState] = useState<EditingState>({
    isEditing: false,
    editingId: null,
    lang: "",
    value: "",
    type: "",
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState(-1);

  const getConflictingIndex = (
    languageString: string,
    nameTypeString: string,
  ) => {
    let conflictFoundIndex = -1;

    for (let i = 0; i < altNames.length; i++) {
      const altName = altNames[i];
      if (
        altName.name &&
        nameTypeString === "translation" &&
        altName.name.lang === languageString &&
        altName.nameType === nameTypeString
      ) {
        conflictFoundIndex = i;
        break;
      }
    }
    return conflictFoundIndex;
  };

  const handleAddPendingAltName = () => {
    dispatch(StopPlaceActions.addAltName(pendingPayload) as any);
    dispatch(StopPlaceActions.removeAltName(pendingRemoveIndex) as any);

    setState({
      lang: "",
      value: "",
      type: "",
      isEditing: false,
      editingId: null,
    });
    setConfirmDialogOpen(false);
    setPendingPayload(null);
    setPendingRemoveIndex(-1);
  };

  const handleAddAltName = () => {
    const { lang, value, type } = state;

    const payload = {
      nameType: type,
      lang,
      value,
    };

    const conflictFoundIndex = getConflictingIndex(lang, type);

    if (conflictFoundIndex > -1) {
      setPendingPayload(payload);
      setPendingRemoveIndex(conflictFoundIndex);
      setConfirmDialogOpen(true);
    } else {
      dispatch(StopPlaceActions.addAltName(payload) as any);
      setState({
        ...state,
        lang: "",
        value: "",
        type: "",
      });
    }
  };

  const handleEditAltName = () => {
    const { lang, value, type, editingId } = state;

    const payload = {
      nameType: type,
      lang,
      value,
      id: editingId,
    };

    const conflictFoundIndex = getConflictingIndex(lang, type);

    if (conflictFoundIndex > -1 && conflictFoundIndex !== editingId) {
      setPendingPayload(payload);
      setPendingRemoveIndex(conflictFoundIndex);
      setConfirmDialogOpen(true);
    } else {
      dispatch(StopPlaceActions.editAltName(payload) as any);
      setState({
        lang: "",
        value: "",
        type: "",
        isEditing: false,
        editingId: null,
      });
    }
  };

  const handleRemoveName = (index: number) => {
    dispatch(StopPlaceActions.removeAltName(index) as any);
  };

  const handleStartEdit = (index: number) => {
    const altName = altNames[index];
    setState({
      isEditing: true,
      editingId: index,
      lang: altName.name.lang,
      value: altName.name.value,
      type: altName.nameType,
    });
  };

  const handleCancelEdit = () => {
    setState({
      lang: "",
      value: "",
      type: "",
      isEditing: false,
      editingId: null,
    });
  };

  const getNameTypeByLocale = (nameType: string) => {
    if (altNameConfig.allNameTypes.includes(nameType)) {
      return formatMessage({
        id: `altNamesDialog_nameTypes_${nameType}`,
      });
    }
  };

  const getLangByLocale = (lang: string) => {
    if (altNameConfig.languages.includes(lang)) {
      return formatMessage({
        id: `altNamesDialog_languages_${lang}`,
      });
    }
  };

  const { isEditing, lang, value, type } = state;
  const isFormValid = !!lang && !!type && !!value;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {formatMessage({ id: "alternative_names" })}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* List of existing alternative names */}
            <Box sx={{ mb: 3, maxHeight: 300, overflowY: "auto" }}>
              {altNames.map((an, i) => (
                <Box
                  key={`altName-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 120 }}>
                    {getNameTypeByLocale(an.nameType) ||
                      formatMessage({ id: "not_assigned" })}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 2, px: 1 }}>
                    {an.name.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, color: "text.secondary" }}
                  >
                    {getLangByLocale(an.name.lang) ||
                      formatMessage({ id: "not_assigned" })}
                  </Typography>
                  {!disabled && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleStartEdit(i)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveName(i)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
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

            {/* Add/Edit form */}
            {!disabled && (
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
                  <FormControl fullWidth>
                    <InputLabel>
                      {formatMessage({ id: "name_type" })}
                    </InputLabel>
                    <Select
                      value={type}
                      label={formatMessage({ id: "name_type" })}
                      onChange={(e) =>
                        setState({ ...state, type: e.target.value })
                      }
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

                  <TextField
                    label={formatMessage({ id: "name" })}
                    fullWidth
                    value={value}
                    onChange={(e) =>
                      setState({ ...state, value: e.target.value })
                    }
                  />

                  <FormControl fullWidth>
                    <InputLabel>{formatMessage({ id: "language" })}</InputLabel>
                    <Select
                      value={lang}
                      label={formatMessage({ id: "language" })}
                      onChange={(e) =>
                        setState({ ...state, lang: e.target.value })
                      }
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

                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    {isEditing && (
                      <Button variant="outlined" onClick={handleCancelEdit}>
                        {formatMessage({ id: "cancel" })}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={isEditing ? handleEditAltName : handleAddAltName}
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
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialogOpen}
        title={formatMessage({ id: "overwrite_alt_name_title" })}
        body={formatMessage({ id: "overwrite_alt_name_body" })}
        confirmText={formatMessage({ id: "overwrite_alt_name_confirm" })}
        cancelText={formatMessage({ id: "overwrite_alt_name_cancel" })}
        onConfirm={handleAddPendingAltName}
        onClose={() => setConfirmDialogOpen(false)}
      />
    </>
  );
};
