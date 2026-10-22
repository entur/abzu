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
import { useIntl } from "react-intl";
import { SaveGroupDialogProps } from "../GroupOfStopPlaces";
import { DialogErrorAlert } from "./DialogErrorAlert";
import { useDialogMutation } from "./hooks/useDialogMutation";

/**
 * Modern save group confirmation dialog
 */
export const SaveGroupDialog: React.FC<SaveGroupDialogProps> = ({
  open,
  onSave,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const { isRunning, errorMessageId, run, resetError } =
    useDialogMutation("save_group_failed");

  useEffect(() => {
    if (open) resetError();
  }, [open, resetError]);

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
          {formatMessage({ id: "save_group_of_stop_places" })}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {formatMessage({ id: "are_you_sure_save_group_of_stop_places" })}
        </Typography>
        <DialogErrorAlert messageId={errorMessageId} />
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={onClose} color="secondary">
            {formatMessage({ id: "cancel" })}
          </Button>
          <Button
            variant="contained"
            onClick={() => run(onSave)}
            disabled={isRunning}
            startIcon={isRunning ? <CircularProgress size={16} /> : null}
          >
            {formatMessage({ id: "save" })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
