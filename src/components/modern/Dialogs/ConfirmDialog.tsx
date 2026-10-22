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
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { ConfirmDialogProps } from "../GroupOfStopPlaces";
import { DialogErrorAlert } from "./DialogErrorAlert";
import { useDialogMutation } from "./hooks/useDialogMutation";

const DEFAULT_FAILURE_MESSAGE_ID = "action_failed";

/**
 * Modern confirmation dialog component with X close button
 * Follows the established modern UI pattern
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  body,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  additionalContent,
  failureMessageId = DEFAULT_FAILURE_MESSAGE_ID,
}) => {
  const { isRunning, errorMessageId, run, resetError } =
    useDialogMutation(failureMessageId);

  useEffect(() => {
    if (open) resetError();
  }, [open, resetError]);

  // A synchronous onConfirm resolves at once, so plain confirms work as before.
  const handleConfirm = () => run(async () => onConfirm());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Typography variant="h6" component="span" sx={{ flex: 1 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: additionalContent ? 2 : 3 }}>
          {body}
        </Typography>
        {additionalContent}
        <DialogErrorAlert messageId={errorMessageId} />
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={onClose} color="secondary">
            {cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={isRunning}
            startIcon={isRunning ? <CircularProgress size={16} /> : null}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
