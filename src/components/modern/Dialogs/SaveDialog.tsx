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

import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { MutationErrorCodes } from "../../../models/ErrorCodes";

/** Matches Tiamat's stop_place.version_comment varchar(255) column (F-39). */
const VERSION_COMMENT_MAX_LENGTH = 255;

const isKnownErrorCode = (error: unknown): error is string =>
  typeof error === "string" &&
  Object.values(MutationErrorCodes).includes(error);

export interface SaveDialogProps {
  open: boolean;
  handleClose: () => void;
  /** May return a promise that rejects with a MutationErrorCodes value; the
      dialog then stays open, shows the error and lets the user retry. */
  handleConfirm: (userInput: { comment: string }) => void | Promise<void>;
  errorMessage?: string;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({
  open,
  handleClose,
  handleConfirm,
  errorMessage,
}) => {
  const { formatMessage } = useIntl();
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorCode, setSaveErrorCode] = useState("");

  /* The parent closes the dialog through `open`, so every opening starts
     clean; otherwise a spinner left over from the last save blocks Confirm. */
  useEffect(() => {
    if (!open) return;
    setComment("");
    setIsSaving(false);
    setSaveErrorCode("");
  }, [open]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveErrorCode("");
    try {
      await handleConfirm({ comment });
    } catch (error) {
      setSaveErrorCode(
        isKnownErrorCode(error) ? error : MutationErrorCodes.ERROR_STOP_PLACE,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    if (isSaving) return;
    handleClose();
  };

  const visibleErrorCode = saveErrorCode || errorMessage;
  const errorMessageLabel = visibleErrorCode
    ? formatMessage({ id: `humanReadableErrorCodes.${visibleErrorCode}` })
    : "";

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" component="span" sx={{ flex: 1 }}>
          {formatMessage({ id: "save_dialog_title" })}
        </Typography>
        <IconButton
          onClick={handleCloseDialog}
          disabled={isSaving}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            label={formatMessage({ id: "comment" })}
            fullWidth
            multiline
            rows={3}
            autoFocus
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            helperText={`${comment.length}/${VERSION_COMMENT_MAX_LENGTH}`}
            slotProps={{
              htmlInput: { maxLength: VERSION_COMMENT_MAX_LENGTH },
              formHelperText: { sx: { textAlign: "right" } },
            }}
            sx={{ mb: 2 }}
          />

          {errorMessageLabel && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessageLabel}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              {formatMessage({ id: "confirm" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
