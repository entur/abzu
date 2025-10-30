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
import React, { useState } from "react";
import { useIntl } from "react-intl";

export interface SaveDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (userInput: { comment: string }) => void;
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

  const handleSave = () => {
    setIsSaving(true);
    handleConfirm({ comment });
  };

  const handleCloseDialog = () => {
    setComment("");
    setIsSaving(false);
    handleClose();
  };

  const getErrorMessage = () => {
    if (errorMessage) {
      return formatMessage({
        id: `humanReadableErrorCodes.${errorMessage}`,
      });
    }
    return "";
  };

  const errorMessageLabel = getErrorMessage();

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "save_dialog_title" })}
        </Typography>
        <IconButton onClick={handleCloseDialog} size="small">
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
            sx={{ mb: 2 }}
          />

          {errorMessageLabel && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessageLabel}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={
                isSaving && !errorMessage ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {formatMessage({ id: "confirm" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
